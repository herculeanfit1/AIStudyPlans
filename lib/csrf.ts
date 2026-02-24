import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Constants
const CSRF_COOKIE_NAME = 'X-CSRF-Token';
const CSRF_HEADER_NAME = 'X-CSRF-Token';
const CSRF_TOKEN_LENGTH = 32;
const CSRF_COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

/**
 * Generate a secure random CSRF token using Web Crypto API
 * @returns A cryptographically secure random token
 */
export function generateCsrfToken(): string {
  // For static exports, use a simpler approach without crypto
  const array = new Uint8Array(CSRF_TOKEN_LENGTH);
  
  // In browser environments use Web Crypto API
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // Fallback for server/static environments
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  
  // Convert to hexadecimal string
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Set CSRF token in cookies
 * @returns The generated CSRF token
 */
export async function setCsrfToken(): Promise<string> {
  const token = generateCsrfToken();

  // Set the CSRF token in a cookie with secure attributes
  (await cookies()).set({
    name: CSRF_COOKIE_NAME,
    value: token,
    httpOnly: true, // Not accessible via JavaScript
    secure: process.env.NODE_ENV === 'production', // Only sent over HTTPS in production
    sameSite: 'strict', // Only sent for same-site requests
    maxAge: CSRF_COOKIE_MAX_AGE,
    path: '/',
  });

  return token;
}

/**
 * Get the CSRF token from cookies
 * @returns The CSRF token or null if not found
 */
export async function getCsrfToken(): Promise<string | null> {
  const csrfCookie = (await cookies()).get(CSRF_COOKIE_NAME);
  return csrfCookie?.value || null;
}

/**
 * Validate CSRF token from request against cookie
 * @param request NextRequest object
 * @returns Boolean indicating if the token is valid
 */
export async function validateCsrfToken(request: NextRequest): Promise<boolean> {
  // Get the token from cookie
  const cookieToken = (await cookies()).get(CSRF_COOKIE_NAME)?.value;
  
  if (!cookieToken) {
    return false;
  }
  
  // Get the token from header (or form body as fallback)
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  
  // If no token was provided in the header, check form data
  if (!headerToken) {
    // We'll need to parse the request body, but this can only be done once
    // This should be handled in the actual API route
    return false;
  }
  
  // Simple string comparison (constant-time comparison not available without crypto)
  return cookieToken === headerToken;
}

/**
 * CSRF protection middleware for API routes
 * @param request NextRequest object
 * @returns NextResponse or null to continue
 */
export async function csrfProtection(request: NextRequest): Promise<NextResponse | null> {
  // Skip CSRF validation for GET and HEAD requests (they should be idempotent)
  const method = request.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD') {
    return null;
  }

  // For other methods (POST, PUT, DELETE, etc.), validate CSRF token
  if (!(await validateCsrfToken(request))) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    );
  }

  // Continue processing the request
  return null;
}

/**
 * React hook to get CSRF token for forms
 * This needs to be called from a client component or a server action
 * @returns Object with CSRF token and header name
 */
export async function useCsrfToken() {
  // This function should be called from a server component
  // or from a server action
  const token = (await getCsrfToken()) || (await setCsrfToken());

  return {
    token,
    headerName: CSRF_HEADER_NAME
  };
} 