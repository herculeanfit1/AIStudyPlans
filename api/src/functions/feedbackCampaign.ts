import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { sendFeedbackCampaignEmail } from "../lib/email.js";
import { getUsersForNextFeedbackEmail, updateEmailSequencePosition } from "../lib/supabase.js";

app.http("feedbackCampaign", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "feedback-campaign",
  handler: async (request: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const authHeader = request.headers.get("authorization");
      const apiKey = process.env.FEEDBACK_CAMPAIGN_API_KEY;

      if (!apiKey) {
        return {
          status: 503,
          jsonBody: { success: false, message: "Campaign API key not configured" },
        };
      }
      if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
        return { status: 401, jsonBody: { success: false, message: "Unauthorized" } };
      }

      const { users, error: fetchError } = await getUsersForNextFeedbackEmail();
      if (fetchError) {
        return { status: 500, jsonBody: { success: false, message: "Failed to fetch users" } };
      }

      const results = [];
      for (const user of users) {
        try {
          const emailResult = await sendFeedbackCampaignEmail(user);
          if (emailResult?.success) {
            const newPosition = (user.email_sequence_position || 1) + 1;
            await updateEmailSequencePosition(user.id, newPosition);
            results.push({
              userId: user.id,
              success: true,
              sequencePosition: user.email_sequence_position,
            });
          }
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Unknown error";
          results.push({ userId: user.id, success: false, error: msg });
        }
      }

      return {
        status: 200,
        jsonBody: {
          success: true,
          message: `Processed ${users.length} users`,
          data: { processed: users.length, results },
        },
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      console.error("Error processing feedback campaign:", msg);
      return { status: 500, jsonBody: { success: false, message: "Internal server error" } };
    }
  },
});
