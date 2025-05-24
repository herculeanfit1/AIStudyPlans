'use client';

import { ReactNode } from 'react';
import { usePageTracking } from '@/lib/hooks/useTracking';

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  // Use the hook to track page views
  usePageTracking();
  
  return <>{children}</>;
} 