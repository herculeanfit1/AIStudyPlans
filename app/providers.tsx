'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import AuthProvider from '@/components/auth/Provider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
} 