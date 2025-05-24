// Simple console logging for debugging authentication issues

/**
 * Log authentication events for debugging
 */
export function logAuthEvent(event: string, data: any) {
  const timestamp = new Date().toISOString();
  console.log(`🔐 [AUTH-${timestamp}] ${event}:`, JSON.stringify(data, null, 2));
}

// Simple implementations for compatibility
export function trackEvent(name: string, properties?: Record<string, any>) {
  console.log(`📈 [EVENT] ${name}:`, properties);
}

export function trackException(error: Error, properties?: Record<string, any>) {
  console.error(`🚨 [ERROR] ${error.name}: ${error.message}`, properties);
}

export function trackTrace(message: string, severityLevel?: number, properties?: Record<string, any>) {
  console.log(`📝 [TRACE] ${message}`, properties);
}

export function setUser(userId: string, authenticatedUserId?: string) {
  console.log(`👤 [USER] Set user: ${userId}`, { authenticatedUserId });
}

export function trackPageView(name: string, properties?: Record<string, any>) {
  console.log(`📄 [PAGE] ${name}:`, properties);
}

export async function initializeMonitoring() {
  console.log('📊 Simple console logging initialized');
  return Promise.resolve();
} 