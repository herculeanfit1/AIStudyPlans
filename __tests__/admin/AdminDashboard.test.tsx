import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminDashboard from '../../app/admin/page';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getFeedbackStats } from '@/lib/admin-supabase';

// Mock the next-auth/react module
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the admin-supabase module
jest.mock('@/lib/admin-supabase', () => ({
  getFeedbackStats: jest.fn(),
}));

// Mock window.localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: '',
});

describe('AdminDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    document.cookie = '';

    // Default mock implementation for getFeedbackStats
    (getFeedbackStats as jest.Mock).mockResolvedValue({
      stats: {
        totalFeedback: 5,
        averageRating: 4.5,
        feedbackByType: { suggestion: 3, issue: 2 },
        feedbackByRating: { '4': 2, '5': 3 },
        feedbackByDay: [{ date: '2023-05-01', count: 5 }],
        recentFeedback: 5,
      },
    });
  });

  it('should show loading state during authentication check', () => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading',
    });

    render(<AdminDashboard />);

    expect(screen.getByText('Checking authentication...')).toBeInTheDocument();
  });

  it('should redirect to sign-in when not authenticated', async () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/api/auth/signin');
    });
  });

  it('should render dashboard when authenticated with NextAuth', async () => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test Admin',
          isAdmin: true,
        },
      },
      status: 'authenticated',
    });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.getByText('4.5')).toBeInTheDocument();
      expect(screen.getByText('Admin Shortcuts')).toBeInTheDocument();
      expect(screen.getByText('Admin Settings')).toBeInTheDocument();
      expect(screen.getByText('Visit Website')).toBeInTheDocument();
      expect(screen.getByText(/You have 5 total feedback entries/)).toBeInTheDocument();
    });
  });

  it('should render dashboard when authenticated with localStorage', async () => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    localStorageMock.setItem('isAdmin', 'true');

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });
  });

  it('should handle stats loading error gracefully', async () => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test Admin',
          isAdmin: true,
        },
      },
      status: 'authenticated',
    });

    (getFeedbackStats as jest.Mock).mockRejectedValue(new Error('Failed to load stats'));

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.getByText('N/A')).toBeInTheDocument();
      expect(screen.getByText('No feedback data available.')).toBeInTheDocument();
    });
  });

  it('should show empty feedback message when no feedback is available', async () => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test Admin',
          isAdmin: true,
        },
      },
      status: 'authenticated',
    });

    (getFeedbackStats as jest.Mock).mockResolvedValue({
      stats: {
        totalFeedback: 0,
        averageRating: null,
        feedbackByType: {},
        feedbackByRating: {},
        feedbackByDay: [],
        recentFeedback: 0,
      },
    });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('No feedback data available.')).toBeInTheDocument();
    });
  });
});
