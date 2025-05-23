'use client';

import React, { useEffect } from 'react';

/**
 * This page is disabled for security reasons
 * All authentication must go through proper Microsoft SSO
 */
export default function DirectLogin() {
  // Always redirect to proper login page
  useEffect(() => {
    // Force redirect to standard login
    window.location.href = '/admin/login';
  }, []);
  
  // Show loading spinner while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to authorized login page...</p>
        <p className="text-red-600 mt-4">Direct login is disabled for security reasons.</p>
        <p className="text-red-600">Please use Microsoft SSO authentication.</p>
      </div>
    </div>
  );
} 