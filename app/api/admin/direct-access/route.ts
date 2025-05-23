import { NextResponse } from 'next/server';

/**
 * Development-only endpoint to get direct admin access
 * This sets the isAdmin cookie and redirects to the admin panel
 */
export async function GET() {
  // Only allow in development mode
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is not available in production' },
      { status: 403 }
    );
  }
  
  // Create response with redirect
  const response = NextResponse.redirect(new URL('/admin', process.env.NEXTAUTH_URL || 'http://localhost:3000'));
  
  // Set admin cookie
  response.cookies.set('isAdmin', 'true', {
    path: '/',
    httpOnly: false,
    maxAge: 86400, // 24 hours
    sameSite: 'lax',
    secure: false,
  });
  
  return response;
}

// This is required for static export in Next.js
export function generateStaticParams() {
  return [];
} 