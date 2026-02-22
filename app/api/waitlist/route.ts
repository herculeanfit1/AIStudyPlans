import { NextRequest, NextResponse } from 'next/server';
import {
  sendWaitlistConfirmationEmail,
  sendWaitlistAdminNotification,
} from "@/lib/email";
import { addToWaitlist, startFeedbackCampaign } from "@/lib/supabase";
import { waitlistSchema, validateInput } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

// Use nodejs runtime for Azure Static Web Apps
export const runtime = "nodejs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Cache-Control": "no-store, max-age=0",
};

/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      ...CORS_HEADERS,
      "Access-Control-Max-Age": "86400",
    },
  });
}

/**
 * API route handler for waitlist signups
 */
export async function POST(request: NextRequest) {
  const rateLimitResult = rateLimit(request, {
    limit: 5,
    windowMs: 60 * 60 * 1000,
    message: "Too many waitlist signup attempts. Please wait before trying again.",
    standardHeaders: true,
  });

  if (rateLimitResult) {
    return rateLimitResult;
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse(
        { success: false, message: "Invalid JSON in request body" },
        400
      );
    }

    const validation = validateInput(waitlistSchema, body);
    if (!validation.success || !validation.data) {
      const errorMessage = Object.values(validation.error || {}).join('. ');
      return jsonResponse(
        { success: false, message: errorMessage || "Invalid input data", errors: validation.error },
        422
      );
    }

    const { name, email, source } = validation.data;

    // Add user to database
    const dbResult = await addToWaitlist(name, email, source);
    if (!dbResult.success) {
      console.error("Error adding user to database:", dbResult.error);
      // Continue — still send welcome email
    }

    // Validate email service is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY environment variable is not set");
      return jsonResponse(
        { success: false, message: "Email service not configured" },
        503
      );
    }

    // Send confirmation email
    try {
      await sendWaitlistConfirmationEmail(email);
    } catch (confirmationError: unknown) {
      const msg = confirmationError instanceof Error ? confirmationError.message : 'Unknown error';
      console.error(`Error sending confirmation email: ${msg}`);
      return jsonResponse(
        { success: false, message: "Failed to send confirmation email. Please contact support@aistudyplans.com." },
        500
      );
    }

    // Send admin notification (non-blocking)
    try {
      await sendWaitlistAdminNotification(name, email);
    } catch (adminEmailError: unknown) {
      const msg = adminEmailError instanceof Error ? adminEmailError.message : 'Unknown error';
      console.error(`Admin notification email failed: ${msg}`);
    }

    // Start feedback campaign
    if (dbResult.success && dbResult.user) {
      await startFeedbackCampaign(dbResult.user.id);
    }

    return jsonResponse({
      success: true,
      message: "Successfully joined the waitlist. Please check your email for confirmation.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error processing waitlist signup:", msg);
    return jsonResponse(
      { success: false, message: "Internal server error. Please contact support@aistudyplans.com." },
      500
    );
  }
}

function jsonResponse(data: Record<string, unknown>, status: number = 200) {
  return NextResponse.json(data, {
    status,
    headers: CORS_HEADERS,
  });
}
