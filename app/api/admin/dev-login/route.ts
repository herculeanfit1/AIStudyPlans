import { NextRequest, NextResponse } from 'next/server';

// This is a development-only endpoint for local testing
// It should never be used in production

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

export async function POST(request: NextRequest) {
  // Ensure this only works in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Whitelist of allowed admin emails for development
    const allowedEmails = [
      'btaiadmin@bridgingtrustai.onmicrosoft.com',
      'terence@bridgingtrust.ai',
      // Add other test admin emails here
    ];

    // Validate email
    if (!allowedEmails.includes(email)) {
      return NextResponse.json(
        { error: 'Email not authorized for admin access' },
        { status: 403 }
      );
    }

    // Create a response with admin cookie
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Development admin cookie set',
        email,
        redirectTo: '/admin'
      },
      { status: 200 }
    );

    // Set cookie using Next.js cookie API
    response.cookies.set('isAdmin', 'true', {
      path: '/',
      httpOnly: false,
      maxAge: 86400, // 24 hours
      sameSite: 'lax',
      secure: false,
    });

    console.log('Dev login: Set admin cookie for', email);

    return response;
  } catch (error: unknown) {
    console.error('Dev login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 