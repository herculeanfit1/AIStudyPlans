'use client';

import { ReactNode, useEffect } from 'react';
import { usePageTracking } from '@/lib/hooks/useTracking';
import { initializeMonitoring } from '@/lib/monitoring';

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  // Initialize monitoring
  useEffect(() => {
    initializeMonitoring().catch(err => 
      console.error('Failed to initialize monitoring:', err)
    );
  }, []);
  
  // Use the hook to track page views
  usePageTracking();
  
  return <>{children}</>;
} 