import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { rateLimit } from "../lib/rate-limit.js";
import { storeFeedback } from "../lib/supabase.js";

app.http("feedbackSubmit", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "feedback/submit",
  handler: async (request: HttpRequest): Promise<HttpResponseInit> => {
    const rl = rateLimit(request, {
      limit: 3, windowMs: 60 * 60 * 1000,
      message: "Too many feedback submissions. Please wait before trying again.",
      standardHeaders: true,
    });
    if (rl) return rl;

    try {
      const { userId, feedbackText, feedbackType, rating, emailId } =
        (await request.json()) as Record<string, unknown>;

      if (!userId || !feedbackText || !feedbackType) {
        return { status: 400, jsonBody: { success: false, message: "Missing required fields" } };
      }

      const result = await storeFeedback(
        parseInt(String(userId), 10),
        String(feedbackText),
        String(feedbackType) as "feature_request" | "general" | "improvement" | "bug",
        rating as number | undefined,
        emailId as string | undefined,
      );

      if (result.success) {
        return { status: 200, jsonBody: { success: true } };
      }
      return { status: 500, jsonBody: { success: false, message: result.error || "Failed to submit feedback" } };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Error submitting feedback:", error);
      return { status: 500, jsonBody: { success: false, message } };
    }
  },
});
