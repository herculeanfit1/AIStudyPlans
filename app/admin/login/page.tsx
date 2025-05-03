'use client';

import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLogin() {
  // State variables
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showFallback, setShowFallback] = useState(false); // Show Microsoft login by default
  const [callbackUrl, setCallbackUrl] = useState('/admin');
  const [isSafari, setIsSafari] = useState(false);
  const router = useRouter();
  
  // Browser detection
  useEffect(() => {
    // Detect Safari
    const isSafariBrowser = 
      navigator.userAgent.indexOf('Safari') !== -1 && 
      navigator.userAgent.indexOf('Chrome') === -1 &&
      navigator.userAgent.indexOf('Edg') === -1;
    setIsSafari(isSafariBrowser);
  }, []);
  
  // Safe browser storage check
  const safeStorageAvailable = () => {
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  // Handle URL parameters
  useEffect(() => {
    try {
      // Parse callback URL
      const url = new URL(window.location.href);
      const callback = url.searchParams.get('callbackUrl');
      if (callback) setCallbackUrl(callback);
      
      // Check for auth errors
      const urlError = url.searchParams.get('error');
      if (urlError) {
        if (urlError === 'AccessDenied') {
          setError('You do not have permission to access the admin area');
        } else {
          setError('An error occurred during sign in');
        }
      }
    } catch (err) {
      console.error('Error parsing URL:', err);
    }
  }, []);
  
  // Set auth methods with redundancy for cross-browser compatibility
  const setSecureAuth = (isAdmin) => {
    let storageSuccess = false;
    
    try {
      // Try localStorage first
      if (safeStorageAvailable()) {
        window.localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
        storageSuccess = true;
      }
    } catch (err) {
      console.error('LocalStorage error:', err);
    }
    
    try {
      // Create cookies as backup (multiple formats for maximum compatibility)
      document.cookie = `isAdmin=${isAdmin ? 'true' : 'false'}; path=/; max-age=${60*60*24}; SameSite=Strict`;
      
      // Safari-specific cookie (less secure but more compatible)
      if (isSafari) {
        document.cookie = `isAdminSafari=${isAdmin ? 'true' : 'false'}; path=/; max-age=${60*60*24};`;
      }
      
      return true;
    } catch (err) {
      console.error('Cookie storage error:', err);
      return storageSuccess;
    }
  };
  
  // Handle fallback login
  const handleFallbackLogin = (e) => {
    e.preventDefault();
    setError('');
    
    // Security: Very basic but functional for development
    if (username === 'admin' && password === 'adminpass') {
      if (setSecureAuth(true)) {
        router.push('/admin');
      } else {
        setError('Browser storage error. Please enable cookies.');
      }
    } else {
      setError('Invalid username or password');
    }
  };
  
  // Handle Microsoft login
  const handleMicrosoftLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Set a cookie before redirecting (helps with Safari)
      if (isSafari) {
        document.cookie = `preAuthRedirect=true; path=/; max-age=300;`;
      }
      
      await signIn('azure-ad', { callbackUrl });
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again or use the fallback login.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Login</h1>
          <p className="text-gray-600">Sign in to access the admin dashboard</p>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {isSafari && (
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
            <p className="text-blue-700">Safari detected. Using compatible authentication mode.</p>
          </div>
        )}
        
        {!showFallback ? (
          <div>
            {/* Microsoft Sign In Button per branding guidelines */}
            <button
              onClick={handleMicrosoftLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md bg-[#2F2F2F] hover:bg-[#201F1F] text-white transition-colors font-segoe text-base"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
            >
              {isLoading ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 23 23" className="mr-2">
                    <rect x="1" y="1" width="10" height="10" fill="#f25022" />
                    <rect x="12" y="1" width="10" height="10" fill="#7fba00" />
                    <rect x="1" y="12" width="10" height="10" fill="#00a4ef" />
                    <rect x="12" y="12" width="10" height="10" fill="#ffb900" />
                  </svg>
                  <span>Sign in with Microsoft</span>
                </div>
              )}
            </button>
            
            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>
            
            <div className="mt-6">
              <button 
                type="button"
                onClick={() => setShowFallback(true)}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Use development login
              </button>
            </div>
          </div>
        ) : (
          <div>
            <form onSubmit={handleFallbackLogin} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign in
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  For development: username "admin" / password "adminpass"
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {!safeStorageAvailable() && "Warning: Local storage is disabled in your browser."}
                </p>
              </div>
            </form>
            
            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>
            
            <div className="mt-6">
              <button 
                type="button"
                onClick={() => setShowFallback(false)}
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md bg-[#2F2F2F] hover:bg-[#201F1F] text-white transition-colors"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 23 23" className="mr-2">
                  <rect x="1" y="1" width="10" height="10" fill="#f25022" />
                  <rect x="12" y="1" width="10" height="10" fill="#7fba00" />
                  <rect x="1" y="12" width="10" height="10" fill="#00a4ef" />
                  <rect x="12" y="12" width="10" height="10" fill="#ffb900" />
                </svg>
                <span>Use Microsoft login</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 