'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import the monitoring component with no SSR
// This ensures it only runs on the client side
const MonitoringDashboard = dynamic(
  () => import('../admin/settings/monitoring'),
  { ssr: false }
);

export default function StandaloneMonitoring() {
  // Function to set admin authentication
  const setAdminAuth = () => {
    try {
      // Set localStorage auth
      localStorage.setItem('isAdmin', 'true');
      
      // Set cookie auth
      document.cookie = "isAdmin=true; path=/; max-age=86400";
      
      // Redirect to admin page
      window.location.href = '/admin/settings?tab=monitoring';
    } catch (err) {
      console.error('Error setting auth:', err);
      alert('Authentication failed. Please enable cookies and localStorage.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Monitoring Dashboard (Test)</h1>
        <p className="text-gray-600">
          This is a standalone version of the monitoring dashboard without authentication requirements
        </p>
        
        <div className="mt-4 flex space-x-4">
          <button
            onClick={setAdminAuth}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Access Admin Version
          </button>
          
          <Link
            href="/admin/login"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Go to Admin Login
          </Link>
        </div>
      </div>
      
      <MonitoringDashboard />
    </div>
  );
} 