import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { storeContactSubmission } from "../lib/contact.js";
import { rateLimit } from "../lib/rate-limit.js";
import { salesContactSchema, validateInput } from "../lib/validation.js";

app.http("contactSales", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "contact/sales",
  handler: async (request: HttpRequest): Promise<HttpResponseInit> => {
    const rl = rateLimit(request, {
      limit: 5,
      windowMs: 60 * 60 * 1000,
      message: "Too many contact submissions. Please try again later.",
      standardHeaders: true,
    });
    if (rl) return rl;

    try {
      const body = (await request.json()) as Record<string, unknown>;
      const validation = validateInput(salesContactSchema, body);
      if (!validation.success) {
        const errorMessage = Object.values(validation.error || {}).join(". ");
        return {
          status: 422,
          jsonBody: {
            success: false,
            message: errorMessage || "Invalid input data",
            errors: validation.error,
          },
        };
      }

      const { name, email, company, message } = validation.data!;
      const result = await storeContactSubmission({ name, email, company, message, type: "sales" });

      if (result.success) {
        return {
          status: 200,
          jsonBody: { success: true, message: "Contact form submitted successfully." },
        };
      }
      return {
        status: 500,
        jsonBody: { success: false, message: result.error || "Failed to submit contact form" },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      console.error("Error handling sales contact form:", message);
      return { status: 500, jsonBody: { success: false, message } };
    }
  },
});
