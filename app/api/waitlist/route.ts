import { NextRequest, NextResponse } from "next/server";
import {
  sendWaitlistConfirmationEmail,
  sendWaitlistAdminNotification,
} from "@/lib/email";
import { addToWaitlist, startFeedbackCampaign } from "@/lib/supabase";
import { trackEvent, trackException } from "@/lib/monitoring";
import { waitlistSchema, validateInput } from "@/lib/validation";

// Use edge runtime instead of nodejs for static export compatibility
// Change from edge to nodejs runtime
export const runtime = "nodejs";

// This is required for static export in Next.js when using output: 'export'
export function generateStaticParams() {
  // Return an empty array since we don't want to pre-render any API routes
  return [];
}

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

    // Get body data, using a more resilient approach
    const body = await request.json().catch(() => ({}));
    
    // Use Zod validation for input data
    const validation = validateInput(waitlistSchema, body);
    if (!validation.success) {
      // Format validation errors
      const errorMessage = Object.values(validation.error || {}).join('. ');
      console.error(`❌ Validation error: ${errorMessage}`);
      
      // Track validation error
      trackEvent("WaitlistValidationError", { 
        error: errorMessage,
        input: body
      });
      
      return new Response(
        JSON.stringify({ 
          error: errorMessage || "Invalid input data",
          validation_errors: validation.error
        }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          } 
        }
      );
    }
    
    // If validation passes, we can safely use the data
    const { name, email, source } = validation.data;

    console.log(`👤 Received waitlist request for: ${name} (${email})`);
    console.log(`✅ Validated waitlist signup: ${name} (${email})`);

    try {
      // Add user to database
      console.log(`📥 Adding user to database: ${name} (${email})`);
      const dbResult = await addToWaitlist(name, email, source);

      if (!dbResult.success) {
        console.error("❌ Error adding user to database:", dbResult.error);
        // Track database error
        trackEvent("WaitlistDatabaseError", {
          error: dbResult.error,
          email: email
        });
        // We'll continue even if DB insertion fails to ensure the welcome email is still sent
        console.log("⚠️ Continuing with email sending despite database error");
      } else {
        console.log(
          `✅ Successfully added user to database: ${dbResult.user?.id}`,
        );
        // Track successful database addition
        trackEvent("WaitlistDatabaseSuccess", {
          userId: dbResult.user?.id,
          email: email
        });
      }

      // Validate required environment variables are set
      if (!process.env.RESEND_API_KEY) {
        console.error("❌ RESEND_API_KEY environment variable is not set");
        // Track configuration error
        trackEvent("WaitlistConfigError", {
          error: "Missing RESEND_API_KEY"
        });
        return new Response(
          JSON.stringify({
            error: "Email service not configured",
            success: false,
            details:
              "Missing API key configuration. Please check server environment variables.",
          }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }

      // Send confirmation email with detailed logging
      console.log(`📧 Sending waitlist confirmation email to ${email}...`);
      try {
        const result = await sendWaitlistConfirmationEmail(email);
        console.log(
          `✅ Confirmation email sent successfully, ID: ${result?.messageId}`,
        );
        // Track successful email send
        trackEvent("WaitlistEmailSent", {
          type: "confirmation",
          email: email,
          messageId: result?.messageId
        });
      } catch (confirmationError: any) {
        console.error(
          `❌ Error sending confirmation email: ${confirmationError?.message}`,
          confirmationError,
        );
        // Track email error
        trackException(confirmationError as Error, {
          type: "confirmation_email",
          email: email
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
        // Track successful admin notification
        trackEvent("WaitlistEmailSent", {
          type: "admin_notification",
          email: email,
          messageId: adminResult?.messageId
        });
      } catch (adminEmailError: any) {
        console.error(
          `⚠️ Admin notification email failed, but continuing: ${adminEmailError?.message}`,
        );
        // Track admin email error
        trackException(adminEmailError as Error, {
          type: "admin_notification_email",
          email: email
        });
        // Don't throw - we still want to continue if admin email fails
      }

      // Start feedback campaign (set up, but first email will be sent by cron job)
      if (dbResult.success && dbResult.user) {
        console.log(
          `📊 Starting feedback campaign for user: ${dbResult.user.id}`,
        );
        await startFeedbackCampaign(dbResult.user.id);
        // Track feedback campaign start
        trackEvent("FeedbackCampaignStarted", {
          userId: dbResult.user.id,
          email: email
        });
      }

      // Track overall success
      trackEvent("WaitlistSignupSuccess", {
        email: email,
        name: name,
        source: source
      });

      // Use simpler Response format rather than NextResponse
      return new Response(
        JSON.stringify({
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
        }),
        { 
          status: 200, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
            "Cache-Control": "no-store, max-age=0"
          } 
        },
      );
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
      trackException(emailError as Error, {
        error_type: "email_processing",
        details: errorDetails
      });

      // Use simpler Response format rather than NextResponse
      return new Response(
        JSON.stringify({
          error: "Failed to send emails",
          message: emailError?.message || "Unknown error",
          details: errorDetails,
          success: false,
          contact:
            "Please contact support@aistudyplans.com to ensure your spot on the waitlist.",
        }),
        { 
          status: 500, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
            "Cache-Control": "no-store, max-age=0"
          } 
        },
      );
    }
  } catch (error: any) {
    console.error(
      "❌ Error processing waitlist signup:",
      error?.message || error,
    );

    // Track overall process error
    trackException(error as Error, {
      route: "/api/waitlist",
      operation: "POST"
    });

    // Use simpler Response format rather than NextResponse
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error?.message || "Unknown error",
        contact:
          "Please contact support@aistudyplans.com to ensure your spot on the waitlist.",
      }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
          "Cache-Control": "no-store, max-age=0"
        } 
      },
    );
  }
}
