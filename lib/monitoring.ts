import { AzureMonitorOpenTelemetryProvider } from '@azure/monitor-opentelemetry';
import { trace } from '@opentelemetry/api';

// Initialize the Azure Monitor provider once at the application start
let provider: AzureMonitorOpenTelemetryProvider | null = null;

// Check if we're running on the client side
const isClient = typeof window !== 'undefined';

export async function initializeMonitoring() {
  // Only initialize in production or if explicitly enabled and only on client side
  if (isClient && 
      (process.env.NODE_ENV === 'production' || process.env.ENABLE_MONITORING === 'true')) {
    try {
      // Use the connection string from environment variables
      provider = new AzureMonitorOpenTelemetryProvider();
      await provider.start();
      console.log('Application Insights initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Application Insights:', error);
    }
  }
}

// Safe tracking functions that don't throw errors and work in both client and server environments
export function trackPageView(name: string, properties?: Record<string, any>) {
  if (!isClient) return; // Skip on server side
  
  try {
    // Get the tracer
    const tracer = trace.getTracer('aistudyplans-web');
    
    // Create a span for the page view
    const span = tracer.startSpan(`PageView:${name}`);
    
    // Add properties as attributes
    if (properties) {
      Object.entries(properties).forEach(([key, value]) => {
        span.setAttribute(key, typeof value === 'string' ? value : JSON.stringify(value));
      });
    }
    
    // End the span
    span.end();
  } catch (error) {
    // Just log the error and continue - don't let this crash the app
    console.error('Error tracking page view:', error);
  }
}

export function trackEvent(name: string, properties?: Record<string, any>) {
  if (!isClient) return; // Skip on server side
  
  try {
    const tracer = trace.getTracer('aistudyplans-web');
    const span = tracer.startSpan(`Event:${name}`);
    
    if (properties) {
      Object.entries(properties).forEach(([key, value]) => {
        span.setAttribute(key, typeof value === 'string' ? value : JSON.stringify(value));
      });
    }
    
    span.end();
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

export function trackException(error: Error, properties?: Record<string, any>) {
  if (!isClient) return; // Skip on server side
  
  try {
    const tracer = trace.getTracer('aistudyplans-web');
    const span = tracer.startSpan(`Exception:${error.name}`);
    
    span.setAttribute('message', error.message);
    span.setAttribute('stack', error.stack || '');
    
    if (properties) {
      Object.entries(properties).forEach(([key, value]) => {
        span.setAttribute(key, typeof value === 'string' ? value : JSON.stringify(value));
      });
    }
    
    span.recordException(error);
    span.end();
  } catch (e) {
    console.error('Error tracking exception:', e);
  }
} 