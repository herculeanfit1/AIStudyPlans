import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminLayout from '../../app/admin/layout';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

// Mock the next-auth/react module
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

// Mock the next/navigation hooks
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

describe('AdminLayout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state during authentication check', () => {
    vi.mocked(useRouter).mockReturnValue({
      push: vi.fn(),
    } as any);
    vi.mocked(usePathname).mockReturnValue('/admin');
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'loading',
    } as any);

    render(<AdminLayout>Test Content</AdminLayout>);

    expect(screen.getByText('Checking authentication...')).toBeInTheDocument();
  });

  it('should redirect to NextAuth sign-in when not authenticated', async () => {
    const pushMock = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push: pushMock,
    } as any);
    vi.mocked(usePathname).mockReturnValue('/admin');
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    } as any);

    render(<AdminLayout>Test Content</AdminLayout>);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/signin')
      );
    });
  });

  it('should render admin UI when authenticated with NextAuth', async () => {
    vi.mocked(useRouter).mockReturnValue({
      push: vi.fn(),
    } as any);
    vi.mocked(usePathname).mockReturnValue('/admin');
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: {
          name: 'Test Admin',
          isAdmin: true,
        },
      },
      status: 'authenticated',
    } as any);

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
    vi.mocked(useRouter).mockReturnValue({
      push: vi.fn(),
    } as any);
    vi.mocked(usePathname).mockReturnValue('/admin/login');
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    } as any);

    render(<AdminLayout>Login Form</AdminLayout>);

    expect(screen.getByText('Login Form')).toBeInTheDocument();
  });
});
