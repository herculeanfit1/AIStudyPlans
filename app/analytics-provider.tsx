'use client';

import { ReactNode, Suspense } from 'react';
import { usePageTracking } from '@/lib/hooks/useTracking';

function AnalyticsTracker({ children }: { children: ReactNode }) {
  // usePageTracking calls useSearchParams, which requires a Suspense boundary
  usePageTracking();
  return <>{children}</>;
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <AnalyticsTracker>{children}</AnalyticsTracker>
    </Suspense>
  );
} 