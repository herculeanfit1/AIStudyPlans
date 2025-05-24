/**
 * Types for the application
 */

// Feedback response type
export interface FeedbackResponse {
  id: string;
  created_at: string;
  feedback_type: string;
  feedback_text: string;
  rating?: number;
  user_id: string;
  waitlist_user_id?: number | string;
  email_id?: string;
  platform?: string;
  source_page?: string;
  feature_id?: string;
  custom_fields?: Record<string, any>;
}

// Feedback with user information
export interface FeedbackWithUser extends FeedbackResponse {
  user: {
    name: string;
    email: string;
    created_at: string;
  };
}

// Waitlist user type
export interface WaitlistUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
  status: string;
  notes?: string;
  last_contact?: string;
  email_sequence_position?: number;
  source?: string;
  referral_code?: string;
}

// Filters for feedback data
export interface FeedbackFilters {
  type?: string;
  minRating?: number;
  maxRating?: number;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

// Feedback summary statistics
export interface FeedbackStats {
  totalFeedback: number;
  averageRating: number | null;
  feedbackByType: {
    [key: string]: number;
  };
  feedbackByRating: {
    [key: string]: number;
  };
  feedbackByDay: {
    date: string;
    count: number;
  }[];
  recentFeedback: number;
} 