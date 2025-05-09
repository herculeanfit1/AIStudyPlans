'use client';

import React, { useState, useEffect } from 'react';

export default function DirectLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProduction, setIsProduction] = useState(false);
  
  // Environment detection
  useEffect(() => {
    // Check if we're in production
    const isProductionEnv = process.env.NODE_ENV === 'production';
    setIsProduction(isProductionEnv);
  }, []);
  
  const handleLogin = (event) => {
    event.preventDefault();
    
    try {
      // Use environment variables for admin credentials in development
      const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'aistudyplans_admin';
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'AdminDev!2024';
      
      if (username === adminUsername && password === adminPassword) {
        setError('');
        setIsLoading(true);
        
        // Set a cookie before redirecting
        document.cookie = `isAdmin=true; path=/; max-age=${60*60*24}; SameSite=Lax`;
        
        // Redirect to admin dashboard after successful login
        setTimeout(() => {
          window.location.href = '/admin';
        }, 500);
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    }
  };
  
  // If in production mode, redirect to standard login page
  if (isProduction) {
    useEffect(() => {
      window.location.href = '/admin/login';
    }, []);
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to authorized login page...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Direct Admin Login</h1>
          <p className="text-gray-600">Emergency access to the admin dashboard</p>
          <div className="mt-2 text-sm bg-yellow-50 p-2 rounded-md text-yellow-600">
            Development environment only
          </div>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
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
              disabled={isLoading}
              className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Use your development credentials to access the admin dashboard.
          </p>
        </form>
      </div>
    </div>
  );
} 