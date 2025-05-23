'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ManualLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);

  // Only allow in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      router.replace('/admin/login');
    }
  }, [router]);

  // Handle countdown for redirection
  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (success && countdown === 0) {
      router.push('/admin');
    }
  }, [success, countdown, router]);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter an email address');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the development login API
      const response = await fetch('/api/admin/dev-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to authenticate');
      }
      
      // Set a cookie manually in the browser for added reliability
      document.cookie = `isAdmin=true; path=/; max-age=86400`;
      
      setSuccess(`Successfully set admin cookie for ${email}. Redirecting in ${countdown} seconds...`);
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualRedirect = () => {
    router.push('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Developer Login</h2>
          <p className="text-gray-600 mb-4">Development environment only</p>
          
          {process.env.NODE_ENV === 'production' ? (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p>This page is not available in production.</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                  <p>{error}</p>
                </div>
              )}
              
              {success ? (
                <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                  <p>{success.replace(/\d+/, countdown.toString())}</p>
                  <button 
                    onClick={handleManualRedirect} 
                    className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Go to admin now
                  </button>
                </div>
              ) : (
                <form onSubmit={handleManualLogin} className="mt-8 space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter admin email"
                    />
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Processing...' : 'Set Admin Cookie (Dev Only)'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
          
          <div className="mt-6 text-sm">
            <Link href="/admin/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Go to standard login
            </Link>
          </div>
          
          <div className="mt-2 text-sm">
            <Link href="/admin/test-login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Go to test login
            </Link>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-md text-xs text-left">
            <details>
              <summary className="font-medium cursor-pointer">Debug Info</summary>
              <div className="mt-2 space-y-2">
                <p><strong>Cookies:</strong> {document.cookie || '(none)'}</p>
                <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
                <p><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : ''}</p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
} 