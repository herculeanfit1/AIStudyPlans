'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DirectAdminAccess() {
  const router = useRouter();
  const [status, setStatus] = useState('Setting development cookie...');
  const [error, setError] = useState<string | null>(null);
  
  // Set cookie and redirect on mount
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      setError('This page is only available in development mode');
      return;
    }
    
    try {
      // Set admin cookie directly in the browser
      document.cookie = 'isAdmin=true; path=/; max-age=86400';
      console.log('Set admin cookie directly in browser');
      
      // Short delay before redirecting
      setTimeout(() => {
        setStatus('Redirecting to admin panel...');
        router.push('/admin');
      }, 1000);
    } catch (err: any) {
      console.error('Error setting cookie:', err);
      setError(err.message || 'Failed to set admin cookie');
    }
  }, [router]);
  
  const handleManualRedirect = () => {
    router.push('/admin');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Direct Admin Access</h2>
          <p className="text-gray-600 mb-4">Development mode only</p>
          
          {error ? (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p>{error}</p>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700 rounded">
              <p>{status}</p>
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <button
              onClick={handleManualRedirect}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Admin Panel Now
            </button>
          </div>
          
          <div className="mt-6 text-sm">
            <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
              Return to Homepage
            </Link>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 text-gray-700 rounded-md text-xs text-left">
            <details>
              <summary className="font-medium cursor-pointer">Debug Info</summary>
              <div className="mt-2 space-y-2">
                <p><strong>Cookies:</strong> {typeof document !== 'undefined' ? document.cookie : '(server rendered)'}</p>
                <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
                <p><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : '(server rendered)'}</p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
} 