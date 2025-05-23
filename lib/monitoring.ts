// Enhanced monitoring wrapper for Application Insights
// This version uses the Application Insights SDK properly

// Check if we're running on the client side
const isClient = typeof window !== 'undefined';

// Flag to track initialization status
let isInitialized = false;
let appInsights: any = null;

/**
 * Initialize monitoring with Application Insights
 */
export async function initializeMonitoring() {
  // Only initialize in production or if explicitly enabled and only on client side
  if (isClient && 
      (process.env.NODE_ENV === 'production' || process.env.ENABLE_MONITORING === 'true')) {
    try {
      console.log('Initializing Application Insights...');
      
      if (process.env.NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING) {
        // Dynamic import of Application Insights SDK
        const { ApplicationInsights } = await import('@microsoft/applicationinsights-web');
        
        appInsights = new ApplicationInsights({
          config: {
            connectionString: process.env.NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING,
            enableAutoRouteTracking: true,
            enableCorsCorrelation: true,
            enableRequestHeaderTracking: true,
            enableResponseHeaderTracking: true,
            autoTrackPageVisitTime: true,
            enableUnhandledPromiseRejectionTracking: true
          }
        });
        
        appInsights.loadAppInsights();
        isInitialized = true;
        console.log('Application Insights initialized successfully');
      } else {
        console.log('Application Insights connection string not found');
      }
    } catch (error) {
      console.error('Failed to initialize Application Insights:', error);
    }
  } else {
    console.log('Application Insights not initialized - not in production or client environment');
  }
}

/**
 * Track a custom event
 */
export function trackEvent(name: string, properties?: Record<string, any>) {
  if (isInitialized && appInsights) {
    appInsights.trackEvent({ name, properties });
  } else {
    console.log(`[Event] ${name}:`, properties);
  }
}

/**
 * Track an exception
 */
export function trackException(error: Error, properties?: Record<string, any>) {
  if (isInitialized && appInsights) {
    appInsights.trackException({ exception: error, properties });
  } else {
    console.error(`[Exception] ${error.name}: ${error.message}`, properties);
  }
}

/**
 * Track a custom trace/log message
 */
export function trackTrace(message: string, severityLevel?: number, properties?: Record<string, any>) {
  if (isInitialized && appInsights) {
    appInsights.trackTrace({ message, severityLevel, properties });
  } else {
    console.log(`[Trace] ${message}`, properties);
  }
}

/**
 * Set user context
 */
export function setUser(userId: string, authenticatedUserId?: string) {
  if (isInitialized && appInsights) {
    appInsights.setAuthenticatedUserContext(authenticatedUserId || userId);
  }
}

/**
 * Log NextAuth events specifically
 */
export function logAuthEvent(event: string, data: any) {
  const logData = {
    event,
    timestamp: new Date().toISOString(),
    ...data
  };
  
  if (isInitialized && appInsights) {
    appInsights.trackEvent({ name: 'NextAuth_Event', properties: logData });
  }
  
  console.log(`[NextAuth-${logData.timestamp}] ${event}:`, logData);
}

// Safe tracking functions that don't throw errors and work in both client and server environments
export function trackPageView(name: string, properties?: Record<string, any>) {
  if (!isClient) return; // Skip on server side
  
  try {
    if (isInitialized && appInsights) {
      appInsights.trackPageView({ name, properties });
    } else {
      console.log(`[Monitoring] PageView: ${name}`, properties);
    }
    
    // Send to browser console for debugging
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      // If Google Analytics is available, use it
      ((window as any).dataLayer as any).push({
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