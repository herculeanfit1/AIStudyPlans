import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminLayout from '../../app/admin/layout';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

// Mock the next-auth/react module
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

describe('AdminLayout Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading state during authentication check', () => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    (usePathname as jest.Mock).mockReturnValue('/admin');
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading',
    });

    render(<AdminLayout>Test Content</AdminLayout>);

    expect(screen.getByText('Checking authentication...')).toBeInTheDocument();
  });

  it('should redirect to NextAuth sign-in when not authenticated', async () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
    (usePathname as jest.Mock).mockReturnValue('/admin');
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AdminLayout>Test Content</AdminLayout>);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/signin')
      );
    });
  });

  it('should render admin UI when authenticated with NextAuth', async () => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    (usePathname as jest.Mock).mockReturnValue('/admin');
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test Admin',
          isAdmin: true,
        },
      },
      status: 'authenticated',
    });

    render(<AdminLayout>Test Content</AdminLayout>);

    await waitFor(() => {
      expect(screen.getByText('Test Content')).toBeInTheDocument();
      expect(screen.getByText('Test Admin')).toBeInTheDocument();
      // Navigation items appear in both mobile and desktop sidebars
      expect(screen.getAllByText('Dashboard').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Feedback').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Settings').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('should not check authentication on login page', () => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    (usePathname as jest.Mock).mockReturnValue('/admin/login');
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AdminLayout>Login Form</AdminLayout>);

    expect(screen.getByText('Login Form')).toBeInTheDocument();
  });
});
