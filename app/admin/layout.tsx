'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Debug info for development environments only
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Admin Layout - Auth Status:', status);
      console.log('Admin Layout - Session:', session);
      console.log('Admin Layout - Current Path:', pathname);
    }
  }, [status, session, pathname]);
  
  // Don't render admin UI until authenticated with NextAuth
  if (status !== 'authenticated' && pathname !== '/admin/login') {
    // Show loading/redirect state
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
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
              {/* User dropdown */}
              <div className="ml-3 relative">
                <div>
                  <div className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                      {session?.user?.image ? (
                        <img src={session.user.image} alt="User" className="h-8 w-8 rounded-full" />
                      ) : (
                        <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                        </svg>
                      )}
                    </span>
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {session?.user?.name || 'Admin User'}
                    </span>
                  </div>
                </div>
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