import { addFeedbackSubmission } from './admin-supabase';

export type ContactSubmission = {
  id: number;
  name: string;
  email: string;
  message: string;
  type: 'sales' | 'support';
  created_at: string;
  // Optional fields
  company?: string;
  phone?: string;
  usersCount?: string;
  subject?: string;
  issueType?: string;
};

/**
 * Store contact form submission
 */
export async function storeContactSubmission(data: Omit<ContactSubmission, 'id' | 'created_at'>): Promise<{ success: boolean; error?: string }> {
  try {
    // Create a submission with ID and timestamp
    const submission: ContactSubmission = {
      ...data,
      id: Date.now(),
      created_at: new Date().toISOString()
    };
    
    // Add to the admin dashboard data
    addFeedbackSubmission({
      id: submission.id,
      waitlist_user_id: 0, // Not associated with a waitlist user
      feedback_text: submission.message,
      feedback_type: submission.type === 'sales' ? 'feature_request' : 'general',
      email_id: `${submission.type}_contact`,
      created_at: submission.created_at
    }, submission.name, submission.email);
    
    return { success: true };
  } catch (error: any) {
    console.error('Error storing contact submission:', error.message);
    return { success: false, error: error.message };
  }
} 