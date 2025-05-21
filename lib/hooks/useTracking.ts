'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/monitoring';

export function usePageTracking() {
  const pathname = usePathname();
  
  // Add try/catch to handle static export
  let searchParamsObj = null;
  try {
    // This will throw during static export - we'll handle it gracefully
    searchParamsObj = useSearchParams();
  } catch (error) {
    console.warn('SearchParams not available during static export');
  }
  
  useEffect(() => {
    if (pathname) {
      // Combine pathname and search params for full URL if available
      let url = pathname;
      
      if (searchParamsObj) {
        const query = searchParamsObj.toString();
        if (query) {
          url = `${pathname}?${query}`;
        }
      }
      
      // Track the page view
      trackPageView(pathname, {
        url,
        referrer: typeof document !== 'undefined' ? (document.referrer || '') : '',
      });
    }
  }, [pathname, searchParamsObj]);
} 