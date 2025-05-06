import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Define a custom render function to include providers, context, etc.
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

/**
 * Creates a mock response object for Supabase-like responses
 */
export function createMockSupabaseResponse<T>(data: T | null = null, error: any = null) {
  return { data, error };
}

/**
 * Creates a delay for async testing
 */
export function createDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock date for consistent testing
 */
export const MOCK_DATE = '2023-01-15T12:00:00Z';

/**
 * Resets all mocks before each test
 */
export function setupMockReset() {
  beforeEach(() => {
    jest.resetAllMocks();
  });
}

/**
 * Mock feedback data for testing
 */
export const mockFeedbackData = {
  id: 'feedback-123',
  created_at: MOCK_DATE,
  feedback_type: 'feature_request',
  feedback_text: 'This is a test feedback',
  rating: 4,
  user_id: 'user-123',
  platform: 'web',
  source_page: '/features',
  feature_id: 'dashboard',
};

/**
 * Mock feedback with user data for testing
 */
export const mockFeedbackWithUser = {
  ...mockFeedbackData,
  user: {
    name: 'Test User',
    email: 'test@example.com',
    created_at: MOCK_DATE,
  },
  email_id: 'email-123',
  waitlist_user_id: 'waitlist-123',
};

/**
 * Mock waitlist user data for testing
 */
export const mockWaitlistUser = {
  id: 123,
  name: 'Test User',
  email: 'test@example.com',
  created_at: MOCK_DATE,
  feedback_campaign_started: true,
  last_email_sent_at: MOCK_DATE,
  email_sequence_position: 1,
  source: 'website',
};

/**
 * Mock feedback stats for testing
 */
export const mockFeedbackStats = {
  totalFeedback: 10,
  averageRating: 4.2,
  feedbackByType: {
    feature_request: 4,
    general: 3,
    improvement: 2,
    bug: 1,
  },
  feedbackByRating: {
    '3': 2,
    '4': 5,
    '5': 3,
  },
  feedbackByDay: [
    { date: '2023-01-14', count: 3 },
    { date: '2023-01-15', count: 7 },
  ],
  recentFeedback: 10,
}; 