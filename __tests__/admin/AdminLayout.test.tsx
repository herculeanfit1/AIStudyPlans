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

// Mock window.localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
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

// Mock ErrorBoundary component
class MockErrorBoundary extends React.Component {
  render() {
    return <>{this.props.children}</>;
  }
}

// Override the ErrorBoundary in AdminLayout
jest.mock('../../app/admin/layout', () => {
  const Original = jest.requireActual('../../app/admin/layout').default;
  return (props) => {
    const OriginalWithMockErrorBoundary = (innerProps) => {
      const result = Original(innerProps);
      // Replace the ErrorBoundary with our mock
      if (result && result.props && result.props.children) {
        const mainContent = result.props.children[1]; // Main content with sidebar
        if (mainContent && mainContent.props && mainContent.props.children) {
          const main = mainContent.props.children[1]; // Main area
          if (main && main.props && main.props.children) {
            return {
              ...result,
              props: {
                ...result.props,
                children: [
                  result.props.children[0],
                  {
                    ...mainContent,
                    props: {
                      ...mainContent.props,
                      children: [
                        mainContent.props.children[0],
                        {
                          ...main,
                          props: {
                            ...main.props,
                            children: <MockErrorBoundary>{main.props.children}</MockErrorBoundary>,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            };
          }
        }
      }
      return result;
    };
    return OriginalWithMockErrorBoundary(props);
  };
});

describe('AdminLayout Component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    localStorageMock.clear();
    document.cookie = '';
  });

  it('should redirect to login page when not authenticated', async () => {
    // Setup mocks
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
      // Should redirect to login
      expect(pushMock).toHaveBeenCalledWith('/admin/login');
    });
  });

  it('should show loading state during authentication check', () => {
    // Setup mocks
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    (usePathname as jest.Mock).mockReturnValue('/admin');
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading',
    });

    render(<AdminLayout>Test Content</AdminLayout>);

    expect(screen.getByText('Loading admin panel...')).toBeInTheDocument();
  });

  it('should render admin UI when authenticated with NextAuth', async () => {
    // Setup mocks
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
      expect(screen.getByText('AI Study Plans Admin')).toBeInTheDocument();
      expect(screen.getByText('Test Admin')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Feedback')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  it('should render admin UI when authenticated with local storage', async () => {
    // Setup mocks
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    (usePathname as jest.Mock).mockReturnValue('/admin');
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    // Set local storage authentication
    localStorageMock.setItem('isAdmin', 'true');

    render(<AdminLayout>Test Content</AdminLayout>);

    await waitFor(() => {
      expect(screen.getByText('AI Study Plans Admin')).toBeInTheDocument();
      expect(screen.getByText('Development Admin')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  it('should not check authentication on login page', () => {
    // Setup mocks
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    (usePathname as jest.Mock).mockReturnValue('/admin/login');
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AdminLayout>Login Form</AdminLayout>);

    // Should just render the children without admin UI
    expect(screen.getByText('Login Form')).toBeInTheDocument();
    expect(screen.queryByText('AI Study Plans Admin')).not.toBeInTheDocument();
  });
}); 