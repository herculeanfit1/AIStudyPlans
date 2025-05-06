// @ts-ignore
import {
  addFeedbackSubmission, 
  clearAllFeedbackData, 
  getAllFeedback,
  getFeedbackStats,
  getFeedbackTextAnalytics,
  exportFeedbackToCsv
} from '@/lib/admin-supabase';
import { FeedbackResponse, FeedbackWithUser } from '@/lib/types';
import { mockFeedbackData, MOCK_DATE, createDelay } from '../utils/test-utils';

// Mock date for consistent test results
const originalDateNow = Date.now;
const originalDateToISOString = Date.prototype.toISOString;

describe('Admin Supabase Functions', () => {
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
  });

  describe('addFeedbackSubmission', () => {
    it('should add a feedback submission with default user info', async () => {
      const feedback: FeedbackResponse = {
        ...mockFeedbackData
      };

      const result = addFeedbackSubmission(feedback);

      // Check result has user info
      expect(result.user).toBeDefined();
      expect(result.user.name).toBe('Test User');
      expect(result.user.email).toBe('test@example.com');
      
      // Check the feedback was added to the internal storage
      const { data } = await getAllFeedback();
      expect(data.length).toBe(1);
      expect(data[0].id).toBe(feedback.id);
      expect(data[0].feedback_text).toBe(feedback.feedback_text);
    });

    it('should add a feedback submission with custom user info', async () => {
      const feedback: FeedbackResponse = {
        ...mockFeedbackData
      };
      const name = 'Custom User';
      const email = 'custom@example.com';

      const result = addFeedbackSubmission(feedback, name, email);

      // Check result has custom user info
      expect(result.user).toBeDefined();
      expect(result.user.name).toBe(name);
      expect(result.user.email).toBe(email);
      
      // Check the feedback was added to the internal storage
      const { data } = await getAllFeedback();
      expect(data.length).toBe(1);
      expect(data[0].user.name).toBe(name);
      expect(data[0].user.email).toBe(email);
    });
  });

  describe('getAllFeedback', () => {
    const setupTestData = () => {
      // Add 5 feedback entries
      for (let i = 0; i < 5; i++) {
        addFeedbackSubmission({
          ...mockFeedbackData,
          id: `feedback-${i}`,
          feedback_type: i % 2 === 0 ? 'feature_request' : 'bug',
          rating: (i % 5) + 1,
          created_at: new Date(2023, 0, i + 1).toISOString()
        });
      }
    };

    it('should return empty data when no feedback exists', async () => {
      const result = await getAllFeedback();
      
      expect(result.data).toEqual([]);
      expect(result.count).toBe(0);
    });

    it('should return all feedback data with default pagination', async () => {
      setupTestData();
      
      const result = await getAllFeedback();
      
      expect(result.data.length).toBe(5);
      expect(result.count).toBe(5);
    });

    it('should apply pagination correctly', async () => {
      setupTestData();
      
      const page1 = await getAllFeedback(1, 2);
      const page2 = await getAllFeedback(2, 2);
      const page3 = await getAllFeedback(3, 2);
      
      expect(page1.data.length).toBe(2);
      expect(page1.count).toBe(5);
      expect(page2.data.length).toBe(2);
      expect(page3.data.length).toBe(1);
    });

    it('should filter by type', async () => {
      setupTestData();
      
      const result = await getAllFeedback(1, 10, { type: 'feature_request' });
      
      expect(result.data.length).toBe(3); // 3 entries have type 'feature_request'
      expect(result.count).toBe(3);
      expect(result.data.every(item => item.feedback_type === 'feature_request')).toBe(true);
    });

    it('should filter by rating range', async () => {
      setupTestData();
      
      const result = await getAllFeedback(1, 10, { minRating: 3, maxRating: 4 });
      
      expect(result.data.length).toBe(2); // 2 entries have rating 3 or 4
      expect(result.count).toBe(2);
      expect(result.data.every(item => item.rating! >= 3 && item.rating! <= 4)).toBe(true);
    });

    it('should filter by date range', async () => {
      setupTestData();
      
      // Test dates in the expected format of fixed mock data
      // In our test setup, all data has the same created_at timestamp from MOCK_DATE
      const result = await getAllFeedback(1, 10, { 
        startDate: MOCK_DATE.split('T')[0], // Use just the date part of MOCK_DATE
        endDate: MOCK_DATE.split('T')[0]    // Same day to match our fixed test data
      });
      
      // All test data should be included since it all has the same date
      expect(result.data.length).toBe(5); 
      expect(result.count).toBe(5);
    });

    it('should filter by search term', async () => {
      // Add special entries for search test
      addFeedbackSubmission({
        ...mockFeedbackData,
        id: 'search-1',
        feedback_text: 'I love the dashboard feature'
      }, 'John Smith', 'john@example.com');
      
      addFeedbackSubmission({
        ...mockFeedbackData,
        id: 'search-2',
        feedback_text: 'The app is great'
      }, 'Jane Doe', 'jane@example.com');
      
      // Search by feedback text
      let result = await getAllFeedback(1, 10, { searchTerm: 'dashboard' });
      expect(result.data.length).toBe(1);
      expect(result.data[0].id).toBe('search-1');
      
      // Search by user name
      result = await getAllFeedback(1, 10, { searchTerm: 'jane' });
      expect(result.data.length).toBe(1);
      expect(result.data[0].id).toBe('search-2');
      
      // Search by email
      result = await getAllFeedback(1, 10, { searchTerm: 'john@example' });
      expect(result.data.length).toBe(1);
      expect(result.data[0].id).toBe('search-1');
    });
  });

  describe('getFeedbackStats', () => {
    it('should return default stats when no feedback exists', async () => {
      const result = await getFeedbackStats();
      
      expect(result.stats).toBeDefined();
      expect(result.stats.totalFeedback).toBe(0);
      expect(result.stats.averageRating).toBe(null);
      expect(Object.keys(result.stats.feedbackByType).length).toBe(0);
    });

    it('should calculate statistics correctly', async () => {
      // Add 5 feedback entries with different types and ratings
      addFeedbackSubmission({
        ...mockFeedbackData,
        id: 'stats-1',
        feedback_type: 'feature_request',
        rating: 4
      });
      
      addFeedbackSubmission({
        ...mockFeedbackData,
        id: 'stats-2',
        feedback_type: 'feature_request',
        rating: 5
      });
      
      addFeedbackSubmission({
        ...mockFeedbackData,
        id: 'stats-3',
        feedback_type: 'bug',
        rating: 2
      });
      
      addFeedbackSubmission({
        ...mockFeedbackData,
        id: 'stats-4',
        feedback_type: 'general',
        rating: undefined
      });
      
      const result = await getFeedbackStats();
      
      expect(result.stats.totalFeedback).toBe(4);
      expect(result.stats.averageRating).toBeCloseTo(3.67, 2); // (4+5+2)/3 = 3.67
      
      // Check feedback by type counts
      expect(result.stats.feedbackByType.feature_request).toBe(2);
      expect(result.stats.feedbackByType.bug).toBe(1);
      expect(result.stats.feedbackByType.general).toBe(1);
      
      // Check feedback by rating
      expect(result.stats.feedbackByRating['2']).toBe(1);
      expect(result.stats.feedbackByRating['4']).toBe(1);
      expect(result.stats.feedbackByRating['5']).toBe(1);
      
      // Check recent feedback
      expect(result.stats.recentFeedback).toBe(4); // All feedback is recent
    });
  });

  describe('clearAllFeedbackData', () => {
    it('should remove all feedback data', async () => {
      // Add some feedback data
      addFeedbackSubmission({...mockFeedbackData, id: 'clear-test-1'});
      addFeedbackSubmission({...mockFeedbackData, id: 'clear-test-2'});
      
      // Verify data was added
      let result = await getAllFeedback();
      expect(result.data.length).toBe(2);
      
      // Clear all data
      clearAllFeedbackData();
      
      // Verify data was cleared
      result = await getAllFeedback();
      expect(result.data.length).toBe(0);
    });
  });

  describe('exportFeedbackToCsv', () => {
    it('should export feedback data to CSV format', async () => {
      // Add feedback for export
      addFeedbackSubmission({
        ...mockFeedbackData,
        id: 'export-1',
        feedback_type: 'feature_request',
        rating: 4,
        email_id: 'email-123',
        waitlist_user_id: 'wl-123'
      }, 'Export User', 'export@example.com');
      
      const result = await exportFeedbackToCsv();
      
      // Check CSV format
      expect(result.csv).toBeDefined();
      expect(result.csv).toContain('User ID,Name,Email,Feedback Type,Feedback Text,Rating,Email ID,Date');
      expect(result.csv).toContain('wl-123,"Export User","export@example.com",feature_request');
      expect(result.csv).toContain('email-123');
      expect(result.csv).toContain('4');  // Rating
    });

    it('should apply filters when exporting', async () => {
      // Add mixed feedback data
      addFeedbackSubmission({
        ...mockFeedbackData,
        id: 'export-1',
        feedback_type: 'feature_request',
        rating: 4
      });
      
      addFeedbackSubmission({
        ...mockFeedbackData,
        id: 'export-2',
        feedback_type: 'bug',
        rating: 2
      });
      
      // Export with filter
      const result = await exportFeedbackToCsv({ type: 'feature_request' });
      
      // Should only include the feature request
      expect(result.csv.split('\n').length).toBe(2); // Header + 1 data row
      expect(result.csv).not.toContain('bug');
    });
  });

  describe('getFeedbackTextAnalytics', () => {
    it('should return empty keywords when no feedback exists', async () => {
      const result = await getFeedbackTextAnalytics();
      
      expect(result.keywords).toEqual([]);
    });

    it('should extract and count keywords from feedback text', async () => {
      // Add feedback with specific keywords
      addFeedbackSubmission({
        ...mockFeedbackData,
        id: 'analytics-1',
        feedback_text: 'dashboard feature is amazing and helpful'
      });
      
      addFeedbackSubmission({
        ...mockFeedbackData,
        id: 'analytics-2',
        feedback_text: 'dashboard needs improvement but still helpful'
      });
      
      const result = await getFeedbackTextAnalytics();
      
      // Check keywords were extracted and counted
      expect(result.keywords.length).toBeGreaterThan(0);
      
      // Find dashboard keyword
      const dashboardKeyword = result.keywords.find(k => k.text === 'dashboard');
      expect(dashboardKeyword).toBeDefined();
      expect(dashboardKeyword?.count).toBe(2);
      
      // Find helpful keyword
      const helpfulKeyword = result.keywords.find(k => k.text === 'helpful');
      expect(helpfulKeyword).toBeDefined();
      expect(helpfulKeyword?.count).toBe(2);
    });
  });
}); 