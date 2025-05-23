'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Admin layout component - requires Microsoft SSO authentication
 * Enforces NextAuth session validation for all admin routes
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Debug info for development environments only
  useEffect(() => {
    console.log(`[AdminLayout] Auth Status: ${status}, Path: ${pathname}`);
    
    // In development, log more detailed information
    if (process.env.NODE_ENV === 'development') {
      console.log('[AdminLayout] Session:', session);
    }
  }, [status, session, pathname]);
  
  // Authentication and redirection logic
  useEffect(() => {
    // Clear any stale state after route changes
    setIsRedirecting(false);
    
    // Handle authentication redirects
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      console.log('[AdminLayout] Unauthenticated user - redirecting to login');
      setIsRedirecting(true);
      router.push('/admin/login');
      return;
    }
    
    // If authenticated, check admin privileges
    if (status === 'authenticated' && session) {
      if (!session.user?.isAdmin && pathname !== '/admin/login') {
        console.log('[AdminLayout] User is not admin - signing out and redirecting');
        setIsRedirecting(true);
        // Sign out and redirect to login with error message
        signOut({ redirect: false }).then(() => {
          router.push('/admin/login?error=AccessDenied');
        });
        return;
      }
    }
  }, [status, session, pathname, router]);
  
  // Handle sign out process
  const handleSignOut = () => {
    setIsRedirecting(true);
    signOut({ callbackUrl: '/admin/login' });
  };
  
  // If we're still loading authentication state
  if (status === 'loading' || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-4">
            {isRedirecting ? 'Redirecting...' : 'Checking authentication...'}
          </p>
        </div>
      </div>
    );
  }

  // If we're on the login page, return just the children
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  // Don't render admin UI until authenticated with NextAuth
  if (status !== 'authenticated') {
    // Show login redirect button
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Authentication required</p>
          <Link
            href="/admin/login" 
            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go to login page
          </Link>
        </div>
      </div>
    );
  }
  
  // Navigation items
  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: 'fas fa-home' },
    { label: 'Feedback', href: '/admin/feedback', icon: 'fas fa-comment-alt' },
    { label: 'Monitoring', href: '/admin/settings?tab=monitoring', icon: 'fas fa-chart-line' },
    { label: 'Settings', href: '/admin/settings', icon: 'fas fa-cog' },
  ];
  
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`md:hidden fixed inset-0 flex z-40 ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800">
          <div className="flex items-center justify-between px-4">
            <div className="flex-shrink-0 text-white text-xl font-semibold">AIStudyPlans Admin</div>
            <button 
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" 
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    pathname === item.href ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <i className={`${item.icon} mr-3 ${
                    pathname === item.href ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                  }`}></i>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-gray-800">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
              <div className="text-white text-lg font-semibold">AIStudyPlans Admin</div>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      pathname === item.href ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <i className={`${item.icon} mr-3 ${
                      pathname === item.href ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                    }`}></i>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top bar */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="md:hidden px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 px-4 flex justify-end">
            <div className="ml-4 flex items-center md:ml-6">
              {/* User dropdown and sign out button */}
              <div className="ml-3 relative flex items-center">
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100 mr-2">
                  {session?.user?.image ? (
                    <img src={session.user.image} alt="User" className="h-8 w-8 rounded-full" />
                  ) : (
                    <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                    </svg>
                  )}
                </span>
                <span className="text-sm font-medium text-gray-700 mr-4">
                  {session?.user?.name || 'Admin User'}
                </span>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 