'use client';

import React, { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function TestLogin() {
  const { data: session, status } = useSession();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Log session status for debugging
  useEffect(() => {
    console.log('[TestLogin] Auth Status:', status);
    console.log('[TestLogin] Session:', session);
    console.log('[TestLogin] Window location:', window.location.href);
    
    // Capture debug info
    setDebugInfo({
      status,
      session: session ? { 
        user: session.user,
        expires: session.expires
      } : null,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  }, [status, session]);
  
  const handleMicrosoftLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[TestLogin] Initiating direct Microsoft sign-in...');
      
      // Use the simplest configuration possible
      await signIn('azure-ad', { 
        callbackUrl: '/admin/test-login',
        redirect: true
      });
    } catch (error: any) {
      console.error('[TestLogin] Login error:', error);
      setError(error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Test Login</h2>
          <p className="text-gray-600 mb-4">Simplified Microsoft sign-in test</p>
          
          {status === 'authenticated' ? (
            <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
              <p className="font-medium">You are authenticated!</p>
              <p className="mt-2">Logged in as: {session?.user?.email}</p>
              <p className="mt-2">Admin status: {session?.user?.isAdmin ? 'Yes' : 'No'}</p>
            </div>
          ) : status === 'loading' ? (
            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700 rounded">
              <p>Checking authentication status...</p>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-700 rounded">
              <p>Not authenticated</p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}
          
          {/* Debug information */}
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 text-gray-700 rounded text-sm text-left">
            <details>
              <summary className="font-medium cursor-pointer">Debug Info</summary>
              <pre className="mt-2 whitespace-pre-wrap overflow-auto max-h-96 text-xs">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          </div>
        </div>
        
        <div className="mt-6">
          {status !== 'authenticated' && (
            <button
              type="button"
              onClick={handleMicrosoftLogin}
              disabled={isLoading || status === 'loading'}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in with Microsoft (Direct)'}
            </button>
          )}
          
          <div className="mt-4 text-center">
            <Link href="/admin/login" className="text-indigo-600 hover:text-indigo-500">
              Go to regular admin login
            </Link>
          </div>
          
          <div className="mt-2 text-center">
            <Link href="/" className="text-gray-600 hover:text-gray-500">
              Return to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 