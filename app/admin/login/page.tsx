'use client';

import React, { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSafari, setIsSafari] = useState(false);
  
  // Get error from URL if present
  useEffect(() => {
    const errorParam = searchParams?.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'AccessDenied':
          setError('Access denied. You do not have permission to access this area.');
          break;
        case 'Verification':
          setError('Unable to verify your credentials. Please try again.');
          break;
        default:
          setError(`Authentication error: ${errorParam}`);
      }
    }
  }, [searchParams]);

  // Detect Safari browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent;
      setIsSafari(userAgent.includes('Safari') && !userAgent.includes('Chrome'));
    }
  }, []);

  // If already authenticated, redirect to admin dashboard
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.isAdmin) {
      router.replace('/admin');
    }
  }, [session, status, router]);
  
  // Configure callback URL
  const callbackUrl = '/admin';
  
  // Handle Microsoft login
  const handleMicrosoftLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Set a cookie before redirecting (helps with Safari)
      if (isSafari) {
        document.cookie = `preAuthRedirect=true; path=/; max-age=300;`;
      }
      
      console.log("Initiating Microsoft sign-in with callback URL:", callbackUrl);
      await signIn('azure-ad', { callbackUrl });
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Admin Login</h2>
          <p className="text-gray-600">Please sign in with Microsoft 365</p>
          
          {/* Error message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
              <p>{error}</p>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <button
            type="button"
            onClick={handleMicrosoftLogin}
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.5 12.5v5h-11v-5h11zm1-1h-13v7h13v-7zm-5-3.5h-8v-7h22v7h-14zm11-6h-20v5h20v-5z" />
                </svg>
                Sign in with Microsoft
              </span>
            )}
          </button>
        </div>
        
        <div className="mt-6">
          <div className="text-center text-sm text-gray-600">
            <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
              Return to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 