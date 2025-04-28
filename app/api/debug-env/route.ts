import { NextRequest, NextResponse } from 'next/server';

// Runtime configuration for Node.js
export const runtime = 'nodejs';

/**
 * Debug environment variables API route
 * This helps troubleshoot email configuration issues in production
 */
export async function GET(request: NextRequest) {
  // Create an environment status object with minimal information
  // that doesn't expose sensitive data
  const envStatus = {
    environment: process.env.NODE_ENV || 'unknown',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'not set',
    emailConfig: {
      fromEmailConfigured: !!process.env.EMAIL_FROM,
      replyToConfigured: !!process.env.EMAIL_REPLY_TO,
      resendApiKeyConfigured: !!process.env.RESEND_API_KEY
    },
    serverTime: new Date().toISOString()
  };

  // Return the status
  return new NextResponse(
    JSON.stringify(envStatus, null, 2),
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
} 