import { storeContactSubmission, ContactSubmission } from '@/lib/contact';
import { getAllFeedback, clearAllFeedbackData } from '@/lib/admin-supabase';
import { MOCK_DATE } from '../utils/test-utils';

// Mock the admin-supabase module
jest.mock('@/lib/admin-supabase', () => {
  // Use the actual implementation for clearAllFeedbackData
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

describe('Contact Functions', () => {
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

  describe('storeContactSubmission', () => {
    it('should successfully store a contact form submission', async () => {
      // Test data
      const contactData = {
        name: 'Test Contact',
        email: 'contact@example.com',
        message: 'This is a contact form message',
        type: 'support' as const,
      };

      // Store the submission
      const result = await storeContactSubmission(contactData);

      // Check result
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();

      // Verify the data was added to feedback
      const { data } = await getAllFeedback();
      expect(data.length).toBe(1);
      
      // Check the feedback data has correct values
      const feedback = data[0];
      expect(feedback.feedback_text).toBe(contactData.message);
      expect(feedback.feedback_type).toBe('general'); // Support type maps to general
      expect(feedback.user.name).toBe(contactData.name);
      expect(feedback.user.email).toBe(contactData.email);
    });

    it('should map sales type to feature_request', async () => {
      // Test data with sales type
      const contactData = {
        name: 'Sales Contact',
        email: 'sales@example.com',
        message: 'This is a sales inquiry',
        type: 'sales' as const,
      };

      // Store the submission
      await storeContactSubmission(contactData);

      // Verify the data was added with correct type
      const { data } = await getAllFeedback();
      expect(data.length).toBe(1);
      expect(data[0].feedback_type).toBe('feature_request'); // Sales type maps to feature_request
    });

    it('should handle additional optional fields', async () => {
      // Test data with optional fields
      const contactData = {
        name: 'Complete Contact',
        email: 'complete@example.com',
        message: 'This is a complete contact form',
        type: 'support' as const,
        company: 'Test Company',
        phone: '123-456-7890',
        subject: 'Detailed subject',
        issueType: 'login'
      };

      // Store the submission
      await storeContactSubmission(contactData);

      // Verify data was added
      const { data } = await getAllFeedback();
      expect(data.length).toBe(1);
      
      // ID should be the stringified timestamp
      expect(data[0].id).toBe(String(Date.now()));
      
      // User ID should be '0' as specified in the implementation
      expect(data[0].user_id).toBe('0');
    });

    it('should handle errors gracefully', async () => {
      // Mock implementation to throw an error
      const mockAddFeedbackSubmission = require('@/lib/admin-supabase').addFeedbackSubmission;
      mockAddFeedbackSubmission.mockImplementationOnce(() => {
        throw new Error('Test error');
      });

      // Test data
      const contactData = {
        name: 'Error Test',
        email: 'error@example.com',
        message: 'This will cause an error',
        type: 'support' as const,
      };

      // Store submission (should catch error)
      const result = await storeContactSubmission(contactData);

      // Check error handling
      expect(result.success).toBe(false);
      expect(result.error).toBe('Test error');
    });
  });
}); 