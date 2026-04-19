import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { storeContactSubmission } from "../lib/contact.js";
import { rateLimit } from "../lib/rate-limit.js";
import { supportContactSchema, validateInput } from "../lib/validation.js";

app.http("contactSupport", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "contact/support",
  handler: async (request: HttpRequest): Promise<HttpResponseInit> => {
    const rl = rateLimit(request, {
      limit: 5, windowMs: 60 * 60 * 1000,
      message: "Too many contact submissions. Please try again later.",
      standardHeaders: true,
    });
    if (rl) return rl;

    try {
      const body = (await request.json()) as Record<string, unknown>;
      const validation = validateInput(supportContactSchema, body);
      if (!validation.success) {
        const errorMessage = Object.values(validation.error || {}).join(". ");
        return { status: 422, jsonBody: { success: false, message: errorMessage || "Invalid input data", errors: validation.error } };
      }

      const { name, email, subject, message, issueType } = validation.data!;
      const result = await storeContactSubmission({ name, email, subject, message, issueType, type: "support" });

      if (result.success) {
        return { status: 200, jsonBody: { success: true, message: "Support request submitted successfully." } };
      }
      return { status: 500, jsonBody: { success: false, message: result.error || "Failed to submit contact form" } };
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      console.error("Error handling support contact form:", message);
      return { status: 500, jsonBody: { success: false, message } };
    }
  },
});
