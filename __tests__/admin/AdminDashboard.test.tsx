import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminDashboard from '../../app/admin/page';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getFeedbackStats } from '@/lib/admin-supabase';

// Mock the next-auth/react module
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}));

// Mock the next/navigation hooks
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock the admin-supabase module
vi.mock('@/lib/admin-supabase', () => ({
  getFeedbackStats: vi.fn(),
}));

// Mock window.localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
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
    vi.clearAllMocks();
    localStorageMock.clear();
    document.cookie = '';

    // Default mock implementation for getFeedbackStats
    vi.mocked(getFeedbackStats).mockResolvedValue({
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
    vi.mocked(useRouter).mockReturnValue({
      push: vi.fn(),
    } as any);
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'loading',
    } as any);

    render(<AdminDashboard />);

    expect(screen.getByText('Checking authentication...')).toBeInTheDocument();
  });

  it('should redirect to sign-in when not authenticated', async () => {
    const pushMock = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push: pushMock,
    } as any);
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    } as any);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/api/auth/signin');
    });
  });

  it('should render dashboard when authenticated with NextAuth', async () => {
    vi.mocked(useRouter).mockReturnValue({
      push: vi.fn(),
    } as any);
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: {
          name: 'Test Admin',
          isAdmin: true,
        },
      },
      status: 'authenticated',
    } as any);

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
    vi.mocked(useRouter).mockReturnValue({
      push: vi.fn(),
    } as any);
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    } as any);

    localStorageMock.setItem('isAdmin', 'true');

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });
  });

  it('should handle stats loading error gracefully', async () => {
    vi.mocked(useRouter).mockReturnValue({
      push: vi.fn(),
    } as any);
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: {
          name: 'Test Admin',
          isAdmin: true,
        },
      },
      status: 'authenticated',
    } as any);

    vi.mocked(getFeedbackStats).mockRejectedValue(new Error('Failed to load stats'));

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.getByText('N/A')).toBeInTheDocument();
      expect(screen.getByText('No feedback data available.')).toBeInTheDocument();
    });
  });

  it('should show empty feedback message when no feedback is available', async () => {
    vi.mocked(useRouter).mockReturnValue({
      push: vi.fn(),
    } as any);
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: {
          name: 'Test Admin',
          isAdmin: true,
        },
      },
      status: 'authenticated',
    } as any);

    vi.mocked(getFeedbackStats).mockResolvedValue({
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
