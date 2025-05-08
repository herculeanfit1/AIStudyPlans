import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminLogin from '../../app/admin/login/page';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Mock the next-auth/react module
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
}));

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
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

// Mock window.location
const originalLocation = window.location;
delete window.location;
window.location = { 
  ...originalLocation,
  href: 'http://localhost:3000/admin/login',
  search: '',
};

describe('AdminLogin Component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    localStorageMock.clear();
    document.cookie = '';
    window.location.href = 'http://localhost:3000/admin/login';
    window.location.search = '';
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  it('should show loading state during authentication check', () => {
    // Setup mocks
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
    });
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading',
    });

    render(<AdminLogin />);

    expect(screen.getByText('Checking authentication...')).toBeInTheDocument();
  });

  it('should redirect to admin page when already authenticated with NextAuth', async () => {
    // Setup mocks
    const replaceMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: replaceMock,
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

    render(<AdminLogin />);

    await waitFor(() => {
      // Should redirect to admin
      expect(replaceMock).toHaveBeenCalledWith('/admin');
    });
  });

  it('should redirect to admin page when already authenticated with localStorage', async () => {
    // Setup mocks
    const replaceMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: replaceMock,
    });
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });
    
    // Set local storage authentication
    localStorageMock.setItem('isAdmin', 'true');

    render(<AdminLogin />);

    await waitFor(() => {
      // Should redirect to admin
      expect(replaceMock).toHaveBeenCalledWith('/admin');
    });
  });

  it('should show login form when not authenticated', async () => {
    // Setup mocks
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
    });
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AdminLogin />);

    // Should show login options
    expect(screen.getByText('Admin Login')).toBeInTheDocument();
    expect(screen.getByText('Sign in with Microsoft')).toBeInTheDocument();
    expect(screen.getByText('Use development login')).toBeInTheDocument();
  });

  it('should call signIn when clicking Microsoft login', async () => {
    // Setup mocks
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
    });
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AdminLogin />);

    // Click Microsoft login button
    fireEvent.click(screen.getByText('Sign in with Microsoft'));

    await waitFor(() => {
      // Should call signIn with azure-ad provider
      expect(signIn).toHaveBeenCalledWith('azure-ad', { callbackUrl: '/admin' });
    });
  });

  it('should show development login form when clicking development login', () => {
    // Setup mocks
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
    });
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AdminLogin />);

    // Click Use development login button
    fireEvent.click(screen.getByText('Use development login'));

    // Should show login form
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('should show error with wrong development credentials', async () => {
    // Setup mocks
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
    });
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AdminLogin />);

    // Switch to development login
    fireEvent.click(screen.getByText('Use development login'));

    // Fill in wrong credentials
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      // Should show error
      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });
  });

  it('should authenticate and redirect with correct development credentials', async () => {
    // Setup mocks
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
      replace: jest.fn(),
    });
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AdminLogin />);

    // Switch to development login
    fireEvent.click(screen.getByText('Use development login'));

    // Fill in correct credentials
    fireEvent.change(screen.getByLabelText('Username'), { 
      target: { value: 'adminbridgingtrustaitk' } 
    });
    fireEvent.change(screen.getByLabelText('Password'), { 
      target: { value: 'Movingondownthelineuntil1gettotheend!' } 
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      // Should set localStorage
      expect(localStorageMock.setItem).toHaveBeenCalledWith('isAdmin', 'true');
      // Should redirect to admin
      expect(pushMock).toHaveBeenCalledWith('/admin');
    });
  });

  it('should show error message when URL has an error param', async () => {
    // Setup mocks with error in URL
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
    });
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });
    
    // Set error in URL
    window.location.href = 'http://localhost:3000/admin/login?error=AccessDenied';
    
    // URL mock for new URL() constructor
    global.URL = jest.fn(() => ({
      searchParams: {
        get: (param) => param === 'error' ? 'AccessDenied' : null
      }
    })) as any;

    render(<AdminLogin />);

    await waitFor(() => {
      // Should show access denied error
      expect(screen.getByText('You do not have permission to access the admin area')).toBeInTheDocument();
    });
  });

  it('should switch back to Microsoft login from dev login', async () => {
    // Setup mocks
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
    });
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AdminLogin />);

    // Switch to development login
    fireEvent.click(screen.getByText('Use development login'));
    
    // Should show dev login form
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    
    // Switch back to Microsoft login
    fireEvent.click(screen.getByText('Back to Microsoft login'));
    
    // Should show Microsoft login button
    expect(screen.getByText('Sign in with Microsoft')).toBeInTheDocument();
  });
}); 