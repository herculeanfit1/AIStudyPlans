import { createClient } from "@supabase/supabase-js";
import { addFeedbackSubmission } from "./admin-supabase";
import { FeedbackResponse as FeedbackResponseType } from "./types";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Check if we're in a development environment with missing credentials
const isMockMode = !supabaseUrl || !supabaseAnonKey;

// Create a single supabase client for the entire app (or a mock if credentials are missing)
export const supabase = isMockMode
  ? createMockClient()
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false // Don't persist the session in local storage
      }
    });

// Create a mock client for development without Supabase
function createMockClient() {
  // eslint-disable-next-line no-console
  console.log("Using mock Supabase client - no credentials provided");

  // Create a mock response creator function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createMockResponse = (data: any = [], error: any = null) => {
    return Promise.resolve({ data, error });
  };

  // Mock PostgrestBuilder that handles multiple query methods
  const createMockQueryBuilder = () => {
    const builder = {
      eq: () => builder,
      lt: () => builder,
      order: () => createMockResponse([]),
      limit: () => createMockResponse([]),
      single: () => createMockResponse(null),
      select: () => builder,
    };
    return builder;
  };

  return {
    from: () => ({
      select: () => createMockQueryBuilder(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      insert: (data: any) => ({
        select: () => ({
          single: () =>
            createMockResponse({
              id: 1,
              name: data && data.length > 0 ? data[0].name : "Mock User",
              email:
                data && data.length > 0 ? data[0].email : "mock@example.com",
              source: data && data.length > 0 ? data[0].source : undefined,
              feedback_campaign_started:
                data && data.length > 0 ? data[0].feedback_campaign_started : false,
            }),
        }),
      }),
      update: () => ({
        eq: () => createMockResponse(null),
      }),
    }),
  };
}

// Type definitions for our database tables
export type WaitlistUser = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  feedback_campaign_started: boolean;
  last_email_sent_at?: string;
  email_sequence_position?: number;
  tags?: string[];
  source?: string;
  notes?: string;
};

// Use the imported type
export type FeedbackResponse = FeedbackResponseType;

// Helper functions for waitlist operations
export async function addToWaitlist(
  name: string,
  email: string,
  source?: string,
): Promise<{ success: boolean; error?: string; user?: WaitlistUser }> {
  try {
    // eslint-disable-next-line no-console
    console.log(`Attempting to add user to waitlist: ${name} (${email}) with Supabase URL: ${supabaseUrl.substring(0, 15)}...`);
    
    // Check if user already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from("waitlist_users")
      .select("id, email")
      .eq("email", email)
      .limit(1);

    if (checkError) {
      console.error("Error checking if user exists:", checkError);
      throw checkError;
    }

    // If user already exists, return success but don't add again
    if (existingUsers && existingUsers.length > 0) {
      return {
        success: true,
        user: existingUsers[0] as WaitlistUser,
        error: "User already on waitlist",
      };
    }

    // Insert new user
    const response = await supabase
      .from("waitlist_users")
      .insert([{ name, email, source, feedback_campaign_started: false }])
      .select()
      .single();

    // Handle error safely
    const { error, data } = response as { error: unknown; data: unknown };
    if (error) throw error;

    return { success: true, user: data as WaitlistUser };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error adding to waitlist:", message);
    return { success: false, error: message };
  }
}

// Start feedback campaign for a user
// Note: The first feedback email will be sent 3-7 days after signup by the scheduled job
export async function startFeedbackCampaign(
  userId: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await supabase
      .from("waitlist_users")
      .update({
        feedback_campaign_started: true,
        email_sequence_position: 0, // Start at 0, first email (position 1) will be sent by scheduled job
        last_email_sent_at: new Date().toISOString(), // Record welcome email time
      })
      .eq("id", userId);

    const { error } = response as { error: unknown };
    if (error) throw error;

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error starting feedback campaign:", message);
    return { success: false, error: message };
  }
}

// Store feedback from user
export async function storeFeedback(
  waitlistUserId: number,
  feedbackText: string,
  feedbackType: "feature_request" | "general" | "improvement" | "bug",
  rating?: number,
  emailId?: string,
): Promise<{ success: boolean; error?: string }> {
  if (isMockMode) {
    // eslint-disable-next-line no-console
    console.log("MOCK: Storing feedback:", {
      waitlistUserId,
      feedbackText,
      feedbackType,
      rating,
      emailId,
    });
    // Simulate a brief delay for realism
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Add to the admin dashboard's real feedback collection
    const feedback: FeedbackResponse = {
      id: String(Date.now()), // Convert timestamp to string ID
      waitlist_user_id: waitlistUserId, // Type will accept number or string
      feedback_text: feedbackText,
      feedback_type: feedbackType,
      rating,
      email_id: emailId,
      created_at: new Date().toISOString(),
      user_id: `user-${waitlistUserId}`,
    };

    // Add to admin dashboard data
    addFeedbackSubmission(
      feedback,
      `User ${waitlistUserId}`,
      `user${waitlistUserId}@example.com`,
    );

    return { success: true };
  }

  try {
    const response = await supabase.from("feedback_responses").insert([
      {
        waitlist_user_id: waitlistUserId,
        feedback_text: feedbackText,
        feedback_type: feedbackType,
        rating,
        email_id: emailId,
      },
    ]);

    const { error } = response as { error: unknown };
    if (error) throw error;

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error storing feedback:", message);
    return { success: false, error: message };
  }
}

// Get all users who need the next email in their feedback campaign
export async function getUsersForNextFeedbackEmail(): Promise<{
  users: WaitlistUser[];
  error?: string;
}> {
  if (isMockMode) {
    // Return mock data
    return {
      users: [
        {
          id: 1,
          name: "Mock User",
          email: "mock@example.com",
          created_at: new Date().toISOString(),
          feedback_campaign_started: true,
          email_sequence_position: 1,
          last_email_sent_at: new Date(
            Date.now() - 6 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
    };
  }

  try {
    const now = new Date();

    // Time windows for each email in the sequence
    // Welcome email (position 0) -> First feedback email (position 1): 3-7 days
    // First feedback (position 1) -> Second feedback (position 2): 7-14 days
    // Second feedback (position 2) -> Third feedback (position 3): 7-14 days
    // Third feedback (position 3) -> Final feedback (position 4): 7-14 days

    // Get the appropriate time threshold based on sequence position
    const getTimeThresholdForPosition = function (position: number): Date {
      // For new signups (position 0), send first feedback email after 5 days (middle of 3-7 day range)
      if (position === 0) {
        return new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
      }
      // For all other positions, use 10 days (middle of 7-14 day range)
      return new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    };

    // Get users who:
    // 1. Have started the campaign
    // 2. Haven't received all emails yet (position < 4)
    // 3. Are due for their next email based on position-specific timing
    const { data, error } = await supabase
      .from("waitlist_users")
      .select("*")
      .eq("feedback_campaign_started", true)
      .lt("email_sequence_position", 4) // Max 4 feedback emails (5 total including welcome)
      .lt("last_email_sent_at", getTimeThresholdForPosition(0).toISOString())
      .order("last_email_sent_at", { ascending: true });

    if (error) throw error;

    // Further filter users based on their specific position
    const filteredUsers = (data as WaitlistUser[]).filter((user) => {
      const position = user.email_sequence_position || 0;
      const lastSentTime = new Date(user.last_email_sent_at || "");
      const threshold = getTimeThresholdForPosition(position);
      return lastSentTime < threshold;
    });

    // Sort by priority: earlier signups first, and by sequence position
    filteredUsers.sort((a, b) => {
      // First by sequence position (lower position = higher priority)
      const posA = a.email_sequence_position || 0;
      const posB = b.email_sequence_position || 0;
      if (posA !== posB) return posA - posB;

      // Then by last email time (earlier = higher priority)
      const timeA = new Date(a.last_email_sent_at || "").getTime();
      const timeB = new Date(b.last_email_sent_at || "").getTime();
      return timeA - timeB;
    });

    return { users: filteredUsers || [] };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error getting users for feedback emails:", message);
    return { users: [], error: message };
  }
}

// Update email sequence position for a user
export async function updateEmailSequencePosition(
  userId: number,
  newPosition: number,
): Promise<{ success: boolean; error?: string }> {
  if (isMockMode) {
    // eslint-disable-next-line no-console
    console.log("MOCK: Updating email sequence position:", {
      userId,
      newPosition,
    });
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from("waitlist_users")
      .update({
        email_sequence_position: newPosition,
        last_email_sent_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) throw error;

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error updating email sequence position:", message);
    return { success: false, error: message };
  }
}
