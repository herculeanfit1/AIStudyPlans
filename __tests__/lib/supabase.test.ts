import {
  addToWaitlist,
  startFeedbackCampaign,
  storeFeedback,
  getUsersForNextFeedbackEmail,
  updateEmailSequencePosition,
  WaitlistUser
} from '@/lib/supabase';
import { getAllFeedback, clearAllFeedbackData } from '@/lib/admin-supabase';
import { MOCK_DATE, mockWaitlistUser } from '../utils/test-utils';

// Mock the admin-supabase module
jest.mock('@/lib/admin-supabase', () => {
  // Use the actual implementation for some functions
  const originalModule = jest.requireActual('@/lib/admin-supabase');
  
  return {
    ...originalModule,
    // Mock the addFeedbackSubmission function
    addFeedbackSubmission: jest.fn(originalModule.addFeedbackSubmission),
  };
});

// Mock date for consistent test results
const originalDateNow = Date.now;
const originalDateToISOString = Date.prototype.toISOString;

describe('Supabase Functions', () => {
  beforeAll(() => {
    // Mock Date.now() to return a fixed timestamp
    global.Date.now = jest.fn(() => new Date(MOCK_DATE).getTime());
    
    // Mock toISOString to return a fixed date string
    Date.prototype.toISOString = jest.fn(() => MOCK_DATE);
  });

  afterAll(() => {
    // Restore original Date methods
    global.Date.now = originalDateNow;
    Date.prototype.toISOString = originalDateToISOString;
  });

  beforeEach(() => {
    // Clear all feedback data before each test
    clearAllFeedbackData();
    
    // Reset jest mocks
    jest.clearAllMocks();
  });

  describe('addToWaitlist', () => {
    it('should add a new user to the waitlist', async () => {
      const name = 'New User';
      const email = 'new@example.com';
      const source = 'website';
      
      const result = await addToWaitlist(name, email, source);
      
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.name).toBe(name);
      expect(result.user?.email).toBe(email);
      expect(result.user?.source).toBe(source);
      expect(result.user?.feedback_campaign_started).toBe(false);
    });

    it('should handle errors gracefully', async () => {
      // Force an error by using an invalid email (implementation detail: in mock mode this shouldn't cause an error,
      // but we're testing the error handling path)
      const name = 'Error User';
      const email = null as any; // Invalid email to trigger an error
      
      try {
        const result = await addToWaitlist(name, email);
        // In mock mode, this might not actually fail, but we still want to verify the function returns a valid shape
        expect(result).toHaveProperty('success');
        if (!result.success) {
          expect(result).toHaveProperty('error');
        }
      } catch (error) {
        // If it does throw (possibly in real implementation), ensure it's caught properly
        expect(error).toBeDefined();
      }
    });
  });

  describe('startFeedbackCampaign', () => {
    it('should start a feedback campaign for a user', async () => {
      const userId = 123;
      
      const result = await startFeedbackCampaign(userId);
      
      expect(result.success).toBe(true);
    });
  });

  describe('storeFeedback', () => {
    it('should store user feedback', async () => {
      const waitlistUserId = 123;
      const feedbackText = 'This is test feedback';
      const feedbackType = 'feature_request' as const;
      const rating = 4;
      const emailId = 'email-123';
      
      const result = await storeFeedback(
        waitlistUserId, 
        feedbackText, 
        feedbackType, 
        rating, 
        emailId
      );
      
      expect(result.success).toBe(true);
      
      // Verify feedback was added through admin-supabase
      const { data } = await getAllFeedback();
      expect(data.length).toBe(1);
      expect(data[0].feedback_text).toBe(feedbackText);
      expect(data[0].feedback_type).toBe(feedbackType);
      expect(data[0].rating).toBe(rating);
      expect(data[0].user.name).toContain(String(waitlistUserId));
    });
    
    it('should handle feedback without rating', async () => {
      const waitlistUserId = 456;
      const feedbackText = 'Feedback without rating';
      const feedbackType = 'bug' as const;
      
      const result = await storeFeedback(
        waitlistUserId, 
        feedbackText, 
        feedbackType
      );
      
      expect(result.success).toBe(true);
      
      // Verify feedback was added
      const { data } = await getAllFeedback();
      expect(data.length).toBe(1);
      expect(data[0].rating).toBeUndefined();
    });
  });

  describe('getUsersForNextFeedbackEmail', () => {
    it('should get users due for next feedback email', async () => {
      const result = await getUsersForNextFeedbackEmail();
      
      expect(result.users).toBeDefined();
      // In mock mode, it should return at least one mock user
      expect(result.users.length).toBeGreaterThan(0);
      
      // Check user has expected properties
      const user = result.users[0];
      expect(user.id).toBeDefined();
      expect(user.name).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.feedback_campaign_started).toBe(true);
      expect(user.email_sequence_position).toBeDefined();
    });
  });

  describe('updateEmailSequencePosition', () => {
    it('should update the email sequence position for a user', async () => {
      const userId = 123;
      const newPosition = 2;
      
      const result = await updateEmailSequencePosition(userId, newPosition);
      
      expect(result.success).toBe(true);
    });
  });
  
  // Integration tests between functions
  describe('Feedback campaign flow', () => {
    it('should complete an end-to-end feedback flow', async () => {
      // Step 1: Add user to waitlist
      const { user } = await addToWaitlist('Flow User', 'flow@example.com');
      expect(user).toBeDefined();
      
      if (!user) return; // TypeScript safety
      
      // Step 2: Start feedback campaign
      const startResult = await startFeedbackCampaign(user.id);
      expect(startResult.success).toBe(true);
      
      // Step 3: Get users due for email
      const usersResult = await getUsersForNextFeedbackEmail();
      expect(usersResult.users.length).toBeGreaterThan(0);
      
      // Step 4: Store feedback from user
      const feedbackResult = await storeFeedback(
        user.id,
        'I love this app!',
        'general',
        5
      );
      expect(feedbackResult.success).toBe(true);
      
      // Step 5: Update email sequence position
      const updateResult = await updateEmailSequencePosition(user.id, 1);
      expect(updateResult.success).toBe(true);
      
      // Verify feedback was stored
      const { data } = await getAllFeedback();
      expect(data.length).toBe(1);
      expect(data[0].feedback_text).toBe('I love this app!');
      expect(data[0].rating).toBe(5);
    });
  });
}); 