import { NextResponse } from 'next/server';

// This is a development-only endpoint for local testing
// It should never be used in production

export function generateStaticParams() {
  return [];
}

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is not available in production' },
      { status: 403 }
    );
  }
  
  const response = NextResponse.json(
    { success: true, message: 'Development admin login successful' },
    { status: 200 }
  );
  
  // Set cookie for admin authentication
  response.cookies.set('isAdmin', 'true', {
    maxAge: 86400, // 24 hours
    path: '/',
  });
  
  return response;
}

export async function POST() {
  return GET();
} 