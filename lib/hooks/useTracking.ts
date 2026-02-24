'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    if (pathname) {
      // Combine pathname and search params for full URL if available
      let url = pathname;
      
      try {
        if (searchParams) {
          const query = searchParams.toString();
          if (query) {
            url = `${pathname}?${query}`;
          }
        }
      } catch (_error) {
        console.warn('SearchParams not available during static export');
      }
      
      // Simple console logging instead of tracking
      console.log(`Page view: ${url}`);
    }
  }, [pathname, searchParams]);
}

export function useTracking() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const source = searchParams?.get('utm_source');
    const medium = searchParams?.get('utm_medium');
    const campaign = searchParams?.get('utm_campaign');
    
    if (source || medium || campaign) {
      // Store tracking data in localStorage or send to analytics
      const trackingData = {
        source,
        medium,
        campaign,
        timestamp: new Date().toISOString()
      };
      
      try {
        localStorage.setItem('tracking_data', JSON.stringify(trackingData));
      } catch (error) {
        console.error('Failed to store tracking data:', error);
      }
    }
  }, [searchParams]);
} 