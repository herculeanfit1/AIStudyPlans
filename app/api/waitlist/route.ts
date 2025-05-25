import { NextRequest } from 'next/server';
import {
  sendWaitlistConfirmationEmail,
  sendWaitlistAdminNotification,
} from "@/lib/email";
import { addToWaitlist, startFeedbackCampaign } from "@/lib/supabase";
import { waitlistSchema, validateInput } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

// Use nodejs runtime for Azure Static Web Apps
export const runtime = "nodejs";

/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function OPTIONS() {
  // Use standard Response instead of NextResponse
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Max-Age": "86400",
      "Cache-Control": "no-store, max-age=0"
    }
  });
}

/**
 * API route handler for waitlist signups
 */
export async function POST(request: NextRequest) {
  // Apply rate limiting (5 waitlist signups per hour per IP)
  const rateLimitResult = rateLimit(request, { 
    limit: 5, 
    windowMs: 60 * 60 * 1000, // 1 hour
    message: "Too many waitlist signup attempts. Please wait before trying again.",
    standardHeaders: true
  });
  
  if (rateLimitResult) {
    return rateLimitResult;
  }

  try {
    // Get body data using a more resilient approach with explicit error handling
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("❌ Error parsing request body as JSON:", parseError);
      return createJsonResponse({
        error: "Invalid JSON in request body",
        details: "Could not parse the request body as valid JSON"
      }, 400);
    }
    
    // Use Zod validation for input data
    const validation = validateInput(waitlistSchema, body);
    if (!validation.success) {
      // Format validation errors
      const errorMessage = Object.values(validation.error || {}).join('. ');
      console.error(`❌ Validation error: ${errorMessage}`);
      
      return createJsonResponse({ 
        error: errorMessage || "Invalid input data",
        validation_errors: validation.error
      }, 400);
    }
    
    // If validation passes, we can safely use the data
    if (!validation.success || !validation.data) {
      console.error("❌ Validation failed but data is missing");
      return createJsonResponse({ 
        error: "Invalid input data - validation passed but data is missing"
      }, 400);
    }
    
    const { name, email, source } = validation.data;

    try {
      // Add user to database
      const dbResult = await addToWaitlist(name, email, source);

      if (!dbResult.success) {
        console.error("❌ Error adding user to database:", dbResult.error);
        // We'll continue even if DB insertion fails to ensure the welcome email is still sent
      }

      // Validate required environment variables are set
      if (!process.env.RESEND_API_KEY) {
        console.error("❌ RESEND_API_KEY environment variable is not set");
        return createJsonResponse({
          error: "Email service not configured",
          success: false,
          details:
            "Missing API key configuration. Please check server environment variables.",
        }, 500);
      }

      // Send confirmation email with detailed logging
      try {
        await sendWaitlistConfirmationEmail(email);
      } catch (confirmationError: any) {
        console.error(
          `❌ Error sending confirmation email: ${confirmationError?.message}`,
          confirmationError,
        );
        throw confirmationError;
      }

      // Send admin notification
      try {
        await sendWaitlistAdminNotification(name, email);
      } catch (adminEmailError: any) {
        console.error(
          `⚠️ Admin notification email failed, but continuing: ${adminEmailError?.message}`,
        );
        // Don't throw - we still want to continue if admin email fails
      }

      // Start feedback campaign (set up, but first email will be sent by cron job)
      if (dbResult.success && dbResult.user) {
        await startFeedbackCampaign(dbResult.user.id);
      }

      // Track overall success
      return createJsonResponse({
        success: true,
        message:
          "Successfully joined the waitlist. Please check your email for confirmation.",
      }, 200);
    } catch (emailError: any) {
      console.error(
        "❌ Error processing emails:",
        emailError?.message || emailError,
      );
      // Include more detailed error information
      const errorDetails = {
        message: emailError?.message || "Unknown error",
        code: emailError?.code,
        statusCode: emailError?.statusCode,
        name: emailError?.name,
        stack:
          process.env.NODE_ENV === "development"
            ? emailError?.stack
            : undefined,
      };
      console.error("❌ Error details:", JSON.stringify(errorDetails));

      // Track email processing error
      console.error("Email processing error", {
        error_type: "email_processing",
        details: errorDetails
      });

      // Return error response as JSON
      return createJsonResponse({
        error: "Failed to send emails",
        message: emailError?.message || "Unknown error",
        details: errorDetails,
        success: false,
        contact:
          "Please contact support@aistudyplans.com to ensure your spot on the waitlist.",
      }, 500);
    }
  } catch (error: any) {
    console.error(
      "❌ Error processing waitlist signup:",
      error?.message || error,
    );

    // Track overall process error
    console.error("Waitlist signup error", {
      route: "/api/waitlist",
      operation: "POST"
    });

    // Always return properly formatted JSON even for unknown errors
    return createJsonResponse({
      error: "Internal server error",
      details: error?.message || "Unknown error",
      contact:
        "Please contact support@aistudyplans.com to ensure your spot on the waitlist.",
    }, 500);
  }
}

/**
 * Helper function to create a JSON Response with proper headers
 * This ensures all responses are consistently formatted
 */
function createJsonResponse(data: any, status: number = 200) {
  // Make sure to wrap the response in a try-catch to ensure a proper response
  try {
    const jsonString = JSON.stringify(data);
    return new Response(jsonString, { 
      status, 
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        "Cache-Control": "no-store, max-age=0"
      } 
    });
  } catch (jsonError) {
    console.error("❌ Error creating JSON response:", jsonError);
    // If JSON stringification fails for any reason, create a basic error response
    return new Response(JSON.stringify({ 
      error: "Error processing response",
      success: false
    }), { 
      status: 500, 
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      } 
    });
  }
}
