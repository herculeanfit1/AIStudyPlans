'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SimpleAdminPanel() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Set admin cookie on component mount
  useEffect(() => {
    // Set the admin cookie directly
    document.cookie = "isAdmin=true; path=/; max-age=86400";
    console.log("Admin cookie set directly in browser");
    setIsLoaded(true);
  }, []);
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">AIStudyPlans Admin Panel</h1>
          <div className="text-sm text-gray-500">Development Mode</div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6 bg-white">
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
              <p className="font-medium">Simple Admin Access Mode Active</p>
              <p className="mt-1 text-sm">
                This is a direct bypass of the authentication system for development purposes only.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-indigo-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-indigo-900">
                    Waitlist Users
                  </h3>
                  <div className="mt-2 text-3xl font-semibold text-indigo-600">
                    142
                  </div>
                  <div className="mt-1 text-sm text-indigo-500">
                    Total signups
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-green-900">
                    Feedback Surveys
                  </h3>
                  <div className="mt-2 text-3xl font-semibold text-green-600">
                    38
                  </div>
                  <div className="mt-1 text-sm text-green-500">
                    Responses received
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-purple-900">
                    Email Campaigns
                  </h3>
                  <div className="mt-2 text-3xl font-semibold text-purple-600">
                    3
                  </div>
                  <div className="mt-1 text-sm text-purple-500">
                    Active campaigns
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Navigation</h2>
              <div className="space-y-2">
                <Link href="/admin" className="block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                  Go to Regular Admin Panel (if working)
                </Link>
                <Link href="/" className="block px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                  Return to Homepage
                </Link>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded text-sm">
              <h3 className="font-medium text-gray-700 mb-2">Debug Information</h3>
              <div className="space-y-1 text-xs text-gray-500">
                <p><strong>Cookies:</strong> {document.cookie || '(none)'}</p>
                <p><strong>Mode:</strong> {process.env.NODE_ENV}</p>
                <p><strong>Time:</strong> {new Date().toISOString()}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 