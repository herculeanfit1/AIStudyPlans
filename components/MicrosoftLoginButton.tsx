'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';

interface MicrosoftLoginButtonProps {
  callbackUrl?: string;
}

export default function MicrosoftLoginButton({ callbackUrl = '/admin' }: MicrosoftLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleMicrosoftLogin = async () => {
    try {
      setIsLoading(true);
      console.log("Initiating Microsoft sign-in with callback URL:", callbackUrl);
      await signIn('azure-ad', { callbackUrl });
    } catch (error) {
      console.error('Microsoft login error:', error);
      // If there's an error, we still rely on NextAuth to handle it
    }
  };
  
  return (
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
  );
} 