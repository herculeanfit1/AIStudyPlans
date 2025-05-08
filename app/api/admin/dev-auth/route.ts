import { NextResponse } from 'next/server';

// This endpoint is for development purposes only
// It allows for direct API-based authentication

export function generateStaticParams() {
  return [];
}

export async function POST(request: Request) {
  // Only allow in development mode
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }
  
  try {
    // Get auth credentials from request
    const data = await request.json();
    
    // Check for dev password (simple but secure enough for dev)
    // In real production, we would never do this - use proper auth instead
    if (data.devPassword === 'developmentAccessOnly2024') {
      const response = NextResponse.json(
        { success: true, message: 'Development authentication successful' },
        { status: 200 }
      );
      
      // Set authentication cookie that lasts 24 hours
      response.cookies.set('isAdmin', 'true', {
        maxAge: 86400,
        path: '/',
        httpOnly: false, // Allow JS access for our client-side auth checks
        sameSite: 'lax',
      });
      
      return response;
    } else {
      return NextResponse.json(
        { error: 'Invalid development credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Dev auth error:', error);
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 500 }
    );
  }
} 