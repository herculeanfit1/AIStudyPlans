import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export type FeedbackResponse = {
  id: number;
  waitlist_user_id: number;
  feedback_text: string;
  rating?: number;
  created_at: string;
  email_id?: string;
  feedback_type: 'feature_request' | 'general' | 'improvement' | 'bug';
};

// Helper functions for waitlist operations
export async function addToWaitlist(name: string, email: string, source?: string): Promise<{ success: boolean; error?: string; user?: WaitlistUser }> {
  try {
    // Check if user already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('waitlist_users')
      .select('id, email')
      .eq('email', email)
      .limit(1);
    
    if (checkError) throw checkError;
    
    // If user already exists, return success but don't add again
    if (existingUsers && existingUsers.length > 0) {
      return { 
        success: true, 
        user: existingUsers[0] as WaitlistUser,
        error: 'User already on waitlist'
      };
    }
    
    // Insert new user
    const { data, error } = await supabase
      .from('waitlist_users')
      .insert([{ name, email, source, feedback_campaign_started: false }])
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, user: data as WaitlistUser };
  } catch (error: any) {
    console.error('Error adding to waitlist:', error.message);
    return { success: false, error: error.message };
  }
}

// Start feedback campaign for a user
export async function startFeedbackCampaign(userId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('waitlist_users')
      .update({ 
        feedback_campaign_started: true,
        email_sequence_position: 1,
        last_email_sent_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error starting feedback campaign:', error.message);
    return { success: false, error: error.message };
  }
}

// Store feedback from user
export async function storeFeedback(
  waitlistUserId: number, 
  feedbackText: string, 
  feedbackType: 'feature_request' | 'general' | 'improvement' | 'bug',
  rating?: number, 
  emailId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('feedback_responses')
      .insert([{ 
        waitlist_user_id: waitlistUserId,
        feedback_text: feedbackText,
        feedback_type: feedbackType,
        rating,
        email_id: emailId
      }]);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error storing feedback:', error.message);
    return { success: false, error: error.message };
  }
}

// Get all users who need the next email in their feedback campaign
export async function getUsersForNextFeedbackEmail(): Promise<{ users: WaitlistUser[]; error?: string }> {
  try {
    const now = new Date();
    // Get users who have started the campaign but haven't received all emails
    // and whose last email was sent at least 3 days ago
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('waitlist_users')
      .select('*')
      .eq('feedback_campaign_started', true)
      .lt('email_sequence_position', 4) // Assuming a 4-email sequence
      .lt('last_email_sent_at', threeDaysAgo)
      .order('last_email_sent_at', { ascending: true });
    
    if (error) throw error;
    
    return { users: (data as WaitlistUser[]) || [] };
  } catch (error: any) {
    console.error('Error getting users for feedback emails:', error.message);
    return { users: [], error: error.message };
  }
}

// Update email sequence position for a user
export async function updateEmailSequencePosition(userId: number, newPosition: number): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('waitlist_users')
      .update({ 
        email_sequence_position: newPosition,
        last_email_sent_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating email sequence position:', error.message);
    return { success: false, error: error.message };
  }
} 