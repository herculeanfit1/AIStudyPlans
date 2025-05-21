// Simple monitoring wrapper for Application Insights
// This version is compatible with Next.js static builds

// Check if we're running on the client side
const isClient = typeof window !== 'undefined';

// Flag to track initialization status
let isInitialized = false;

/**
 * Initialize monitoring - in static export this is a no-op that logs success
 * In production with real Application Insights, this would initialize the real SDK
 */
export async function initializeMonitoring() {
  // Only initialize in production or if explicitly enabled and only on client side
  if (isClient && 
      (process.env.NODE_ENV === 'production' || process.env.ENABLE_MONITORING === 'true')) {
    try {
      // In a static export, this is just a placeholder
      console.log('Application Insights initialized');
      isInitialized = true;
      
      // In a real implementation with dynamic imports, we would do:
      // if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
      //   const { ApplicationInsights } = await import('applicationinsights-js');
      //   ApplicationInsights.init(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING);
      // }
    } catch (error) {
      console.error('Failed to initialize monitoring:', error);
    }
  }
}

// Safe tracking functions that don't throw errors and work in both client and server environments
export function trackPageView(name: string, properties?: Record<string, any>) {
  if (!isClient) return; // Skip on server side
  
  try {
    // In static export, just log
    console.log(`[Monitoring] PageView: ${name}`, properties);
    
    // Send to browser console for debugging
    if (typeof window !== 'undefined' && window.dataLayer) {
      // If Google Analytics is available, use it
      (window.dataLayer as any).push({
        event: 'pageview',
        page: name,
        ...properties
      });
    }
  } catch (error) {
    // Just log the error and continue - don't let this crash the app
    console.error('Error tracking page view:', error);
  }
}

export function trackEvent(name: string, properties?: Record<string, any>) {
  if (!isClient) return; // Skip on server side
  
  try {
    // In static export, just log
    console.log(`[Monitoring] Event: ${name}`, properties);
    
    // Send to browser console for debugging
    if (typeof window !== 'undefined' && window.dataLayer) {
      // If Google Analytics is available, use it
      (window.dataLayer as any).push({
        event: name,
        ...properties
      });
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

export function trackException(error: Error, properties?: Record<string, any>) {
  if (!isClient) return; // Skip on server side
  
  try {
    // In static export, just log
    console.error(`[Monitoring] Exception: ${error.name}`, error.message, error.stack, properties);
    
    // Send to browser console for debugging
    if (typeof window !== 'undefined' && window.dataLayer) {
      // If Google Analytics is available, use it
      (window.dataLayer as any).push({
        event: 'exception',
        exceptionName: error.name,
        exceptionMessage: error.message,
        exceptionStack: error.stack,
        ...properties
      });
    }
  } catch (e) {
    console.error('Error tracking exception:', e);
  }
} 