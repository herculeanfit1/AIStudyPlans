'use client';

import React, { useState } from 'react';

export default function DirectLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simple direct login with development credentials
    if (username === 'adminbridgingtrustaitk' && password === 'Movingondownthelineuntil1gettotheend!') {
      try {
        // Set auth cookie
        document.cookie = `isAdmin=true; path=/; max-age=${60*60*24}; SameSite=Strict`;
        
        // Set localStorage as backup
        try {
          localStorage.setItem('isAdmin', 'true');
        } catch (err) {
          console.warn('LocalStorage not available:', err);
        }
        
        // Redirect directly to admin panel
        window.location.href = '/admin';
      } catch (err) {
        console.error('Login error:', err);
        setError('Error during login. Please try again.');
        setIsLoading(false);
      }
    } else {
      setError('Invalid username or password');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Direct Admin Login</h1>
          <p className="text-gray-600">Emergency access to the admin dashboard</p>
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