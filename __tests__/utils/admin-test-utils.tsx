import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';

// Mock types for session data
export type MockSessionConfig = {
  status: 'authenticated' | 'loading' | 'unauthenticated';
  user?: {
    name?: string;
    email?: string;
    image?: string | null;
    isAdmin?: boolean;
  };
};

// Default session config for admin tests
export const defaultAdminSession: MockSessionConfig = {
  status: 'authenticated',
  user: {
    name: 'Test Admin',
    email: 'admin@example.com',
    isAdmin: true,
  },
};

// Default unauthenticated session
export const unauthenticatedSession: MockSessionConfig = {
  status: 'unauthenticated',
};

// Default loading session
export const loadingSession: MockSessionConfig = {
  status: 'loading',
};

interface AdminProviderProps {
  children: React.ReactNode;
  sessionConfig?: MockSessionConfig;
}

/**
 * Session provider wrapper for admin component tests
 */
export const AdminProvider = ({
  children,
  sessionConfig = defaultAdminSession,
}: AdminProviderProps) => {
  const session = {
    expires: new Date(Date.now() + 3600 * 1000).toISOString(),
    user: sessionConfig.user ?? { name: null, email: null, image: null },
  };

  return (
    <SessionProvider session={sessionConfig.status === 'authenticated' ? session : null}>
      {children}
    </SessionProvider>
  );
};

/**
 * Custom render function for admin components
 */
export const renderWithAdminContext = (
  ui: ReactElement,
  sessionConfig: MockSessionConfig = defaultAdminSession,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AdminProvider sessionConfig={sessionConfig}>{children}</AdminProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

/**
 * Mock window.localStorage
 */
export const mockLocalStorage = () => {
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
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
  
  return localStorageMock;
};

/**
 * Mock document.cookie
 */
export const mockCookies = (initialCookies = '') => {
  Object.defineProperty(document, 'cookie', {
    writable: true,
    value: initialCookies,
  });
};

/**
 * Setup mocks for admin tests with localStorage and cookies
 */
export const setupAdminMocks = (
  initialLocalStorage = {},
  initialCookies = ''
) => {
  const localStorage = mockLocalStorage();
  
  // Set initial localStorage values
  Object.entries(initialLocalStorage).forEach(([key, value]) => {
    localStorage.setItem(key, value as string);
  });
  
  mockCookies(initialCookies);
  
  return localStorage;
}; 