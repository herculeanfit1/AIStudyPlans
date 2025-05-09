'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isLocalAuth, setIsLocalAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Utility to check cookies for auth
  const getCookie = (name: string): string | null => {
    try {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    } catch (e) {
      return null;
    }
  };
  
  useEffect(() => {
    // Skip auth check if already on login page
    if (pathname === '/admin/login') {
      setIsLoading(false);
      return;
    }
    
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check for local auth first (faster than NextAuth check)
        let isLocallyAuthenticated = false;
        
        // Try localStorage
        try {
          isLocallyAuthenticated = localStorage.getItem('isAdmin') === 'true';
        } catch (e) {
          console.warn('LocalStorage not available:', e);
        }
        
        // If localStorage failed, try cookies
        if (!isLocallyAuthenticated) {
          isLocallyAuthenticated = getCookie('isAdmin') === 'true';
        }
        
        // If locally authenticated, set state and finish
        if (isLocallyAuthenticated) {
          setIsLocalAuth(true);
          setIsLoading(false);
          return;
        }
        
        // Then check NextAuth status as a fallback
        if (status === 'authenticated') {
          // Ensure we set the admin flag in localStorage for consistency
          try {
            localStorage.setItem('isAdmin', 'true');
          } catch (err) {
            console.warn('Could not set localStorage admin flag:', err);
          }
          
          // Set cookies as backup too
          document.cookie = `isAdmin=true; path=/; max-age=${60*60*24}; SameSite=Strict`;
          
          setIsLocalAuth(false);
          setIsLoading(false);
          return;
        }
        
        // Only proceed with redirect if not authenticated by any method
        if (status === 'unauthenticated' && !isLocallyAuthenticated) {
          // If not authenticated, redirect to login
          router.push('/admin/login');
        }
        
        // Make sure we always finish loading eventually
        setTimeout(() => {
          setIsLoading(false);
        }, 1000); // Fallback timeout
        
      } catch (err) {
        console.error('Auth check error:', err);
        setError(err instanceof Error ? err : new Error('Authentication check failed'));
        setIsLoading(false);
        
        // Only redirect if not on login page
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      }
    };
    
    checkAuth();
  }, [status, router, pathname]);
  
  // Handle local logout
  const handleLocalLogout = () => {
    try {
      // Clear all auth methods
      localStorage.removeItem('isAdmin');
      document.cookie = 'isAdmin=false; path=/; max-age=0';
      router.push('/admin/login');
    } catch (e) {
      console.error('Logout error:', e);
      router.push('/admin/login');
    }
  };
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }
  
  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Admin Panel</h1>
          <p className="text-gray-700 mb-4">{error.message}</p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Retry
            </button>
            <Link 
              href="/admin/login"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Don't render admin UI until authenticated
  if (status !== 'authenticated' && !isLocalAuth && pathname !== '/admin/login' && pathname !== '/admin/direct-login') {
    // Check if we're in development environment
    const isDevEnvironment = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    
    // Instead of returning null, we'll return a more explicit loading state
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Authentication required</p>
          {isDevEnvironment && (
            <a 
              href="/admin-login.html"
              className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 mb-4"
            >
              Emergency Login
            </a>
          )}
          <Link
            href="/admin/ms-login" 
            className="block mt-4 text-indigo-600 hover:text-indigo-800"
          >
            Go to login page
          </Link>
        </div>
      </div>
    );
  }
  
  // If we're on the login page, return just the children
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  // Navigation items
  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: 'fas fa-home' },
    { label: 'Feedback', href: '/admin/feedback', icon: 'fas fa-comment-alt' },
    { label: 'Monitoring', href: '/admin/settings?tab=monitoring', icon: 'fas fa-chart-line' },
    { label: 'Settings', href: '/admin/settings', icon: 'fas fa-cog' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Admin Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/admin" className="flex items-center text-white no-underline">
            <span className="font-bold text-xl">AI Study Plans Admin</span>
          </Link>
          
          {/* User info and signout */}
          <div className="flex items-center">
            <span className="mr-3 text-sm md:text-base">
              {isLocalAuth 
                ? 'Development Admin'
                : (session?.user?.name || 'Admin')
              }
            </span>
            <button 
              onClick={isLocalAuth ? handleLocalLogout : () => signOut({ callbackUrl: '/admin/login' })}
              className="bg-white/20 border-0 py-1 px-3 rounded text-white text-sm cursor-pointer hover:bg-white/30 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside className="w-60 bg-white shadow-sm p-6 hidden md:block">
          <nav>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Admin Panel
            </div>
            
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link 
                  key={item.label}
                  href={item.href} 
                  className="block p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors text-sm"
                >
                  <span className="mr-2">
                    <i className={item.icon} aria-hidden="true"></i>
                  </span> 
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-6">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

// Simple client-side error boundary component
class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ hasError: true, error });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-md">
          <h2 className="text-lg font-semibold text-red-600 mb-2">
            Something went wrong
          </h2>
          <p className="text-red-700 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
} 