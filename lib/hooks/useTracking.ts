'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/monitoring';

export function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    if (pathname) {
      // Combine pathname and search params for full URL
      const query = searchParams?.toString();
      const url = query ? `${pathname}?${query}` : pathname;
      
      // Track the page view
      trackPageView(pathname, {
        url,
        referrer: document.referrer || '',
      });
    }
  }, [pathname, searchParams]);
} 