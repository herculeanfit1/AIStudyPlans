'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

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
      
      // Simple console logging instead of tracking
      console.log(`Page view: ${url}`);
    }
  }, [pathname, searchParamsObj]);
} 