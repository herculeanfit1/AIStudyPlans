import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Use nodejs runtime for Azure Static Web Apps
export const runtime = "nodejs";

// This is required for static export in Next.js when using output: 'export'
export function generateStaticParams() {
  // Return an empty array since we don't want to pre-render any API routes
  return [];
}

/**
 * GET handler for CSRF token
 */
export async function GET() {
  try {
    // Generate a random CSRF token
    const token = crypto.randomUUID();
    
    return NextResponse.json({ 
      csrfToken: token,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error generating CSRF token:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
} 