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
    // Enhanced logging for production debugging
    console.log(
      `🚀 Waitlist API route called (${process.env.NODE_ENV} environment)`,
    );
    console.log(
      `🔧 Environment config: URL=${process.env.NEXT_PUBLIC_APP_URL || "not set"}`,
    );

    // Explicitly log configuration presence for debugging
    const resendApiKeyPresent = !!process.env.RESEND_API_KEY;
    console.log(
      `📧 Email config: RESEND_API_KEY=${resendApiKeyPresent ? "present" : "MISSING"}, FROM=${!!process.env.EMAIL_FROM ? "present" : "MISSING"}, REPLY=${!!process.env.EMAIL_REPLY_TO ? "present" : "MISSING"}`,
    );
    console.log(
      `📊 Database config: SUPABASE_URL=${!!process.env.NEXT_PUBLIC_SUPABASE_URL ? "present" : "MISSING"}, ANON_KEY=${!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "present" : "MISSING"}`,
    );

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
      
      // Log validation error instead of tracking
      console.log("Waitlist validation error", { 
        error: errorMessage,
        input: body
      });
      
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

    console.log(`👤 Received waitlist request for: ${name} (${email})`);
    console.log(`✅ Validated waitlist signup: ${name} (${email})`);

    try {
      // Add user to database
      console.log(`📥 Adding user to database: ${name} (${email})`);
      const dbResult = await addToWaitlist(name, email, source);

      if (!dbResult.success) {
        console.error("❌ Error adding user to database:", dbResult.error);
        // Log database error instead of tracking
        console.log("Waitlist database error", {
          error: dbResult.error,
          email: email
        });
        // We'll continue even if DB insertion fails to ensure the welcome email is still sent
        console.log("⚠️ Continuing with email sending despite database error");
      } else {
        console.log(
          `✅ Successfully added user to database: ${dbResult.user?.id}`,
        );
        // Log successful database addition instead of tracking
        console.log("Waitlist database success", {
          userId: dbResult.user?.id,
          email: email
        });
      }

      // Validate required environment variables are set
      if (!process.env.RESEND_API_KEY) {
        console.error("❌ RESEND_API_KEY environment variable is not set");
        // Log configuration error instead of tracking
        console.log("Waitlist config error", {
          error: "Missing RESEND_API_KEY"
        });
        return createJsonResponse({
          error: "Email service not configured",
          success: false,
          details:
            "Missing API key configuration. Please check server environment variables.",
        }, 500);
      }

      // Send confirmation email with detailed logging
      console.log(`📧 Sending waitlist confirmation email to ${email}...`);
      try {
        const result = await sendWaitlistConfirmationEmail(email);
        console.log(
          `✅ Confirmation email sent successfully, ID: ${result?.messageId}`,
        );
        // Log successful email send instead of tracking
        console.log("Waitlist email sent", {
          type: "confirmation",
          email: email,
          messageId: result?.messageId
        });
      } catch (confirmationError: any) {
        console.error(
          `❌ Error sending confirmation email: ${confirmationError?.message}`,
          confirmationError,
        );
        // Log email error instead of tracking
        console.error("Confirmation email error", {
          type: "confirmation_email",
          email: email,
          error: confirmationError
        });
        throw confirmationError;
      }

      // Send admin notification
      console.log("📧 Sending admin notification email...");
      try {
        const adminResult = await sendWaitlistAdminNotification(name, email);
        console.log(
          `✅ Admin notification email sent successfully, ID: ${adminResult?.messageId}`,
        );
        // Log successful admin notification instead of tracking
        console.log("Waitlist admin email sent", {
          type: "admin_notification",
          email: email,
          messageId: adminResult?.messageId
        });
      } catch (adminEmailError: any) {
        console.error(
          `⚠️ Admin notification email failed, but continuing: ${adminEmailError?.message}`,
        );
        // Log admin email error instead of tracking
        console.error("Admin notification email error", {
          type: "admin_notification_email",
          email: email,
          error: adminEmailError
        });
        // Don't throw - we still want to continue if admin email fails
      }

      // Start feedback campaign (set up, but first email will be sent by cron job)
      if (dbResult.success && dbResult.user) {
        console.log(
          `📊 Starting feedback campaign for user: ${dbResult.user.id}`,
        );
        await startFeedbackCampaign(dbResult.user.id);
        // Log feedback campaign start instead of tracking
        console.log("Feedback campaign started", {
          userId: dbResult.user.id,
          email: email
        });
      }

      // Track overall success
      console.log("Waitlist signup success", {
        email: email,
        name: name,
        source: source
      });

      // Return a successful JSON response
      return createJsonResponse({
        success: true,
        message:
          "Successfully joined the waitlist. Please check your email for confirmation.",
        debug:
          process.env.NODE_ENV !== "production"
            ? {
                emailConfig: {
                  apiKey: resendApiKeyPresent ? "present" : "missing",
                  from: process.env.EMAIL_FROM ? "configured" : "missing",
                  replyTo: process.env.EMAIL_REPLY_TO
                    ? "configured"
                    : "missing",
                },
                environment: process.env.NODE_ENV,
              }
            : undefined,
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
