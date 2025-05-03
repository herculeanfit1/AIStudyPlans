'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLocalAuth, setIsLocalAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [checkCount, setCheckCount] = useState(0);
  
  // Utility to check cookies for auth
  const getCookie = (name: string): string | null => {
    try {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    } catch (e) {
      console.error('Cookie parse error:', e);
      return null;
    }
  };
  
  useEffect(() => {
    // Check both authentication methods with 3 retry attempts
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // First check NextAuth status
        if (status === 'authenticated') {
          setIsLocalAuth(false);
          setIsLoading(false);
          return;
        }
        
        // Then check for local auth in different storage mechanisms
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
        
        setIsLocalAuth(isLocallyAuthenticated);
        
        // If neither authenticated and tried 3 times, redirect to login
        if (!isLocallyAuthenticated && status === 'unauthenticated' && checkCount >= 2) {
          router.push('/admin/login');
        } else if (!isLocallyAuthenticated && checkCount < 3) {
          // Try again in 500ms (up to 3 times)
          setCheckCount(prevCount => prevCount + 1);
          setTimeout(checkAuth, 500);
          return;
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Auth check error:', err);
        setIsLoading(false);
        router.push('/admin/login');
      }
    };
    
    checkAuth();
  }, [status, router, checkCount]);
  
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  // Don't render admin UI until authenticated
  if (status !== 'authenticated' && !isLocalAuth) {
    return null;
  }
  
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Admin Header */}
      <header style={{
        backgroundColor: '#4f46e5',
        color: 'white',
        padding: '16px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 16px'
        }}>
          <Link href="/admin" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none',
            color: 'white'
          }}>
            <div style={{
              fontWeight: 'bold',
              fontSize: '20px'
            }}>
              SchedulEd Admin
            </div>
          </Link>
          
          {/* User info and signout */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '12px' }}>
              {isLocalAuth 
                ? 'Development Admin'
                : (session?.user?.name || 'Admin')
              }
            </span>
            <button 
              onClick={isLocalAuth ? handleLocalLogout : () => signOut({ callbackUrl: '/admin/login' })}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div style={{ 
        display: 'flex',
        flex: 1
      }}>
        {/* Sidebar */}
        <aside style={{
          width: '240px',
          backgroundColor: 'white',
          boxShadow: '1px 0 3px rgba(0, 0, 0, 0.1)',
          padding: '24px 16px'
        }}>
          <nav>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '16px'
            }}>
              Admin Panel
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/admin" style={{
                display: 'block',
                padding: '8px 12px',
                borderRadius: '6px',
                color: '#4b5563',
                textDecoration: 'none',
                fontSize: '14px'
              }}>
                <span style={{ marginRight: '8px' }}>📊</span> Dashboard
              </Link>
              
              <Link href="/admin/feedback" style={{
                display: 'block',
                padding: '8px 12px',
                borderRadius: '6px',
                color: '#4b5563',
                textDecoration: 'none',
                fontSize: '14px'
              }}>
                <span style={{ marginRight: '8px' }}>💬</span> Feedback
              </Link>
              
              <Link href="#" style={{
                display: 'block',
                padding: '8px 12px',
                borderRadius: '6px',
                color: '#4b5563',
                textDecoration: 'none',
                fontSize: '14px'
              }}>
                <span style={{ marginRight: '8px' }}>👥</span> Users
              </Link>
              
              <Link href="/admin/settings" style={{
                display: 'block',
                padding: '8px 12px',
                borderRadius: '6px',
                color: '#4b5563',
                textDecoration: 'none',
                fontSize: '14px'
              }}>
                <span style={{ marginRight: '8px' }}>⚙️</span> Settings
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{
          flex: 1,
          padding: '24px'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
} 