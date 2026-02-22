import { NextRequest, NextResponse } from 'next/server';

// Type definitions
export interface RateLimitConfig {
  // Maximum number of requests allowed in the time window
  limit: number;
  // Time window in seconds
  windowMs: number;
  // Optional custom error message
  message?: string;
  // Whether to include remaining limits in headers
  standardHeaders?: boolean;
}

// In-memory storage for rate limiting
// Will reset on server restart - for production use Redis or similar
const ipRequestCounts: Record<string, { count: number, resetTime: number }> = {};

/**
 * Clean up expired rate limit records
 * This prevents memory leaks in our in-memory store
 */
function cleanupExpiredRecords(): void {
  const now = Date.now();
  for (const [ip, data] of Object.entries(ipRequestCounts)) {
    if (data.resetTime < now) {
      delete ipRequestCounts[ip];
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredRecords, 5 * 60 * 1000);
}

/**
 * Rate limit middleware for Next.js API routes
 * @param request The incoming request
 * @param config Rate limit configuration
 * @returns NextResponse if rate limit is exceeded, null otherwise
 */
export function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = { limit: 10, windowMs: 60000 }
): NextResponse | null {
  // Get IP address from the request
  // X-Forwarded-For header might be set by a proxy
  let ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
  
  // For privacy, hash or truncate the IP in production
  if (process.env.NODE_ENV === 'production') {
    // Just keep first part of IP to maintain privacy
    ip = ip.split('.').slice(0, 2).join('.') + '.x.x';
  }
  
  // Skip rate limiting for development if configured
  if (process.env.DISABLE_RATE_LIMIT === 'true' && process.env.NODE_ENV !== 'production') {
    return null;
  }

  const now = Date.now();
  const windowMs = config.windowMs;
  const limit = config.limit;
  
  // Initialize or update the request count for this IP
  if (!ipRequestCounts[ip]) {
    ipRequestCounts[ip] = {
      count: 0,
      resetTime: now + windowMs,
    };
  } else if (ipRequestCounts[ip].resetTime < now) {
    // Reset if the window has passed
    ipRequestCounts[ip] = {
      count: 0,
      resetTime: now + windowMs,
    };
  }
  
  // Increment the count
  ipRequestCounts[ip].count++;
  
  // Calculate remaining requests and time until reset
  const currentCount = ipRequestCounts[ip].count;
  const remainingRequests = Math.max(0, limit - currentCount);
  const timeUntilReset = Math.max(0, ipRequestCounts[ip].resetTime - now);
  
  // Return rate limit headers if enabled
  const headers: Record<string, string> = {};
  
  if (config.standardHeaders) {
    headers['X-RateLimit-Limit'] = limit.toString();
    headers['X-RateLimit-Remaining'] = remainingRequests.toString();
    headers['X-RateLimit-Reset'] = Math.ceil(timeUntilReset / 1000).toString();
  }
  
  // If rate limit is exceeded, return 429 Too Many Requests
  if (currentCount > limit) {
    // Log the rate limit event (sanitized for privacy)
    console.warn(`Rate limit exceeded for IP: ${ip.substring(0, 4)}*** - ${currentCount} requests`);
    
    headers['Retry-After'] = Math.ceil(timeUntilReset / 1000).toString();
    
    return NextResponse.json(
      {
        success: false,
        message: config.message || 'Too many requests, please try again later',
      },
      {
        status: 429,
        headers: headers,
      }
    );
  }
  
  // Rate limit not exceeded, continue to the API route
  return null;
} 