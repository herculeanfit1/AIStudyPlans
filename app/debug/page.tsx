import React from 'react';
import WaitlistFormDebug from '../components/WaitlistFormDebug';

export default function DebugPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">API Debugging Page</h1>
        <p className="mb-8 text-gray-600 text-center">
          This page is for testing the waitlist API endpoints directly with detailed response information.
        </p>
        
        <div className="grid grid-cols-1 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Debug Endpoint Test</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <WaitlistFormDebug />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 