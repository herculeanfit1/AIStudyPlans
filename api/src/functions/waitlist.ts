import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { sendWaitlistAdminNotification, sendWaitlistConfirmationEmail } from "../lib/email.js";
import { rateLimit } from "../lib/rate-limit.js";
import { addToWaitlist, startFeedbackCampaign } from "../lib/supabase.js";
import { validateInput, waitlistSchema } from "../lib/validation.js";

app.http("waitlist", {
  methods: ["POST", "OPTIONS"],
  authLevel: "anonymous",
  route: "waitlist",
  handler: async (request: HttpRequest): Promise<HttpResponseInit> => {
    const CORS = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    };

    if (request.method === "OPTIONS") {
      return { status: 204, headers: { ...CORS, "Access-Control-Max-Age": "86400" } };
    }

    const rl = rateLimit(request, {
      limit: 5,
      windowMs: 60 * 60 * 1000,
      message: "Too many waitlist signup attempts. Please wait before trying again.",
      standardHeaders: true,
    });
    if (rl) return { ...rl, headers: { ...rl.headers, ...CORS } };

    try {
      const body = (await request.json()) as Record<string, unknown>;
      const validation = validateInput(waitlistSchema, body);
      if (!validation.success || !validation.data) {
        const errorMessage = Object.values(validation.error || {}).join(". ");
        return {
          status: 422,
          jsonBody: {
            success: false,
            message: errorMessage || "Invalid input data",
            errors: validation.error,
          },
          headers: CORS,
        };
      }

      const { name, email, source } = validation.data;
      const dbResult = await addToWaitlist(name, email, source);

      if (!process.env.RESEND_API_KEY) {
        return {
          status: 503,
          jsonBody: { success: false, message: "Email service not configured" },
          headers: CORS,
        };
      }

      try {
        await sendWaitlistConfirmationEmail(email);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        console.error(`Error sending confirmation email: ${msg}`);
        return {
          status: 500,
          jsonBody: {
            success: false,
            message: "Failed to send confirmation email. Please contact support@aistudyplans.com.",
          },
          headers: CORS,
        };
      }

      try {
        await sendWaitlistAdminNotification(name, email);
      } catch {
        /* non-blocking */
      }

      if (dbResult.success && dbResult.user) {
        await startFeedbackCampaign(dbResult.user.id);
      }

      return {
        status: 200,
        jsonBody: {
          success: true,
          message: "Successfully joined the waitlist. Please check your email for confirmation.",
        },
        headers: CORS,
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      console.error("Error processing waitlist signup:", msg);
      return {
        status: 500,
        jsonBody: {
          success: false,
          message: "Internal server error. Please contact support@aistudyplans.com.",
        },
        headers: CORS,
      };
    }
  },
});
