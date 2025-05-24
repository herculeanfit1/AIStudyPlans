'use client';

import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for error in URL parameters
    const urlError = searchParams.get('error');
    if (urlError) {
      switch (urlError) {
        case 'AccessDenied':
          setError('Access denied. Please contact an administrator if you believe this is an error.');
          break;
        case 'OAuthSignin':
        case 'OAuthCallback':
        case 'OAuthCreateAccount':
        case 'EmailCreateAccount':
        case 'Callback':
          setError('There was an issue with the authentication process. Please try again.');
          break;
        case 'OAuthAccountNotLinked':
          setError('Your account is not linked. Please contact support.');
          break;
        case 'EmailSignin':
          setError('Email sign-in is not supported. Please use Microsoft authentication.');
          break;
        case 'CredentialsSignin':
          setError('Invalid credentials. Please try again.');
          break;
        case 'SessionRequired':
          setError('You must be signed in to access this page.');
          break;
        default:
          setError('An authentication error occurred. Please try again.');
      }
    }
  }, [searchParams]);

  const handleMicrosoftSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signIn('azure-ad', { 
        callbackUrl: '/admin',
        redirect: true 
      });
      
      if (result?.error) {
        setError('Authentication failed. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100">
            <i className="fas fa-lock text-indigo-600 text-xl"></i>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the SchedulEd admin dashboard
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-exclamation-circle text-red-400"></i>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Authentication Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-6">
          <div>
            {/* Microsoft Official Sign-In Button */}
            <button
              onClick={handleMicrosoftSignIn}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-white bg-[#0078d4] hover:bg-[#106ebe] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0078d4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <svg 
                    className="h-5 w-5" 
                    viewBox="0 0 23 23" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Microsoft Logo */}
                    <rect width="10" height="10" fill="#F25022"/>
                    <rect x="12" width="10" height="10" fill="#7FBA00"/>
                    <rect y="12" width="10" height="10" fill="#00A4EF"/>
                    <rect x="12" y="12" width="10" height="10" fill="#FFB900"/>
                  </svg>
                )}
              </span>
              {isLoading ? 'Signing in...' : 'Sign in with Microsoft'}
            </button>
          </div>

          {/* Additional Information */}
          <div className="text-center">
            <div className="text-sm text-gray-600">
              <p className="mb-2">Admin access is restricted to authorized personnel only.</p>
              <p className="text-xs text-gray-500">
                You must have a Microsoft account with appropriate permissions.
              </p>
            </div>
          </div>

          {/* Development Mode Notice */}
          {process.env.NODE_ENV === 'development' && (
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-exclamation-triangle text-yellow-400"></i>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Development Mode
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Running in development environment. Additional logging is enabled.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Back to Home */}
          <div className="text-center">
            <Link 
              href="/" 
              className="font-medium text-indigo-600 hover:text-indigo-500 text-sm"
            >
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 