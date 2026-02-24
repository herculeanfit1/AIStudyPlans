import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FeedbackTable from '@/components/admin/FeedbackTable';
import { mockFeedbackWithUser, MOCK_DATE } from '../utils/test-utils';

describe('FeedbackTable', () => {
  const defaultProps = {
    feedback: [mockFeedbackWithUser],
    totalCount: 1,
    page: 1,
    pageSize: 10,
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn(),
    onExport: vi.fn(),
    isLoading: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the feedback table with data', () => {
    render(<FeedbackTable {...defaultProps} />);

    // Check table headers
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Feedback')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Rating')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Email ID')).toBeInTheDocument();

    // Check feedback data is displayed
    expect(screen.getByText(mockFeedbackWithUser.user.name)).toBeInTheDocument();
    expect(screen.getByText(mockFeedbackWithUser.user.email)).toBeInTheDocument();
    expect(screen.getByText(mockFeedbackWithUser.feedback_text)).toBeInTheDocument();
    expect(screen.getByText('Feature Request')).toBeInTheDocument(); // Transformed from feature_request
  });

  it('shows loading state when isLoading is true', () => {
    render(<FeedbackTable {...defaultProps} isLoading={true} />);

    expect(screen.getByText('Loading feedback data...')).toBeInTheDocument();
  });

  it('shows empty state when feedback array is empty', () => {
    render(<FeedbackTable {...defaultProps} feedback={[]} />);

    expect(screen.getByText('No feedback found.')).toBeInTheDocument();
  });

  it('calls onExport when export button is clicked', () => {
    render(<FeedbackTable {...defaultProps} />);

    const exportButton = screen.getByText('Export to CSV');
    fireEvent.click(exportButton);

    expect(defaultProps.onExport).toHaveBeenCalledTimes(1);
  });

  it('calls onPageChange when pagination buttons are clicked', () => {
    // Test Next button click (from page 1 to 2)
    render(<FeedbackTable {...defaultProps} totalCount={25} pageSize={10} page={1} />);

    // Get all buttons with "Next" text
    const nextButtons = screen.getAllByRole('button', { name: /next/i });
    // Use the mobile next button (first in the list)
    const nextButton = nextButtons[0];

    // Check that the Next button is not disabled
    expect(nextButton).not.toHaveAttribute('disabled');

    // Click the Next button
    fireEvent.click(nextButton);
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);

    // Clear mocks
    defaultProps.onPageChange.mockClear();

    // Now test the pagination number buttons separately
    render(<FeedbackTable {...defaultProps} totalCount={25} pageSize={10} page={1} />);

    // Find page 2 buttons (may be multiple) and use the first one
    const page2Buttons = screen.getAllByRole('button', { name: '2' });
    const page2Button = page2Buttons[0];

    // Click the page 2 button
    fireEvent.click(page2Button);
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('renders the correct pagination information', () => {
    render(<FeedbackTable {...defaultProps} totalCount={25} pageSize={10} page={2} />);

    // Test pagination info by testing for the individual numbers instead of the whole text
    // since the text is split across multiple elements
    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    // Also check for the word "results" which should appear in the pagination text
    expect(screen.getByText(/results/i)).toBeInTheDocument();
  });

  it('renders "N/A" when email_id is missing', () => {
    // Create feedback without email_id
    const feedbackWithoutEmailId = {
      ...mockFeedbackWithUser,
      email_id: undefined
    };

    render(<FeedbackTable {...defaultProps} feedback={[feedbackWithoutEmailId]} />);

    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('formats the date correctly', () => {
    // We can't directly check the formatted date since it depends on locale
    // but we can check that a date is rendered and the toLocaleString method was called
    const originalToLocaleString = Date.prototype.toLocaleString;
    Date.prototype.toLocaleString = vi.fn(() => 'Mocked Date') as unknown as typeof Date.prototype.toLocaleString;

    render(<FeedbackTable {...defaultProps} />);

    expect(screen.getByText('Mocked Date')).toBeInTheDocument();

    // Restore original method
    Date.prototype.toLocaleString = originalToLocaleString;
  });

  it('renders the correct rating stars', () => {
    // Create feedback with specific rating
    const feedbackWithRating = {
      ...mockFeedbackWithUser,
      rating: 3
    };

    const { container } = render(<FeedbackTable {...defaultProps} feedback={[feedbackWithRating]} />);

    // Check that we have 5 stars (3 filled, 2 empty)
    const stars = container.querySelectorAll('.fa-star');
    expect(stars.length).toBe(5);

    // Check the rating text shows 3.0
    expect(screen.getByText('3.0')).toBeInTheDocument();
  });

  it('shows "No rating" when rating is missing', () => {
    // Create feedback without rating
    const feedbackWithoutRating = {
      ...mockFeedbackWithUser,
      rating: undefined
    };

    render(<FeedbackTable {...defaultProps} feedback={[feedbackWithoutRating]} />);

    expect(screen.getByText('No rating')).toBeInTheDocument();
  });
});
