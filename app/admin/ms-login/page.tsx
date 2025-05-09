'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import MicrosoftLoginButton from '@/components/MicrosoftLoginButton';

export default function MicrosoftOnlyLogin() {
  const { status } = useSession();
  
  // If we're checking authentication, show loading
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // If authenticated, redirect will happen automatically
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">AIStudyPlans Admin</h1>
          <p className="text-gray-600">Sign in with your Microsoft account</p>
        </div>
        
        <MicrosoftLoginButton callbackUrl="/admin" />
      </div>
    </div>
  );
} 