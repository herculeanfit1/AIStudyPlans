import { NextRequest, NextResponse } from 'next/server';
import { setCsrfToken } from '@/lib/csrf';

// Use edge runtime for better performance
export const runtime = 'edge';

// This is required for static export in Next.js when using output: 'export'
export function generateStaticParams() {
  // Return an empty array since we don't want to pre-render any API routes
  return [];
}

/**
 * API route handler for generating a CSRF token
 * This endpoint creates a new CSRF token and returns it to the client
 * The token is also set as an HttpOnly cookie
 */
export async function GET(request: NextRequest) {
  try {
    // Set a CSRF token in cookie and get the token value
    const token = setCsrfToken();
    
    // Return the token in the response
    return NextResponse.json(
      { token },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    );
  } catch (error: any) {
    console.error('Error generating CSRF token:', error?.message || error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate security token',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined 
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        }
      }
    );
  }
} 