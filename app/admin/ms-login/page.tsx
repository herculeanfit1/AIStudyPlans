'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MicrosoftLoginButton from '@/components/MicrosoftLoginButton';

export default function MicrosoftOnlyLogin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Add debugging logs
  useEffect(() => {
    console.log('[MS-Login] Session status:', status);
    console.log('[MS-Login] Session data:', session);
    console.log('[MS-Login] User email:', session?.user?.email);
    console.log('[MS-Login] Is admin:', session?.user?.isAdmin);
  }, [session, status]);
  
  // If authenticated and is admin, redirect to admin dashboard
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.isAdmin) {
      console.log('[MS-Login] Redirecting authenticated admin to dashboard');
      router.push('/admin');
    } else if (status === 'authenticated' && !session?.user?.isAdmin) {
      console.log('[MS-Login] User authenticated but not admin');
      // Could redirect to an "access denied" page or show error
    }
  }, [status, session, router]);
  
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
  
  // If authenticated but not admin, show access denied
  if (status === 'authenticated' && !session?.user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">You are not authorized to access the admin panel.</p>
            <p className="text-sm text-gray-500">Signed in as: {session?.user?.email}</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Show login form for unauthenticated users
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