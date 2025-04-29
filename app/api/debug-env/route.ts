import { NextRequest, NextResponse } from 'next/server';

// Instead of using force-dynamic, use the edge runtime which is compatible with static exports
export const runtime = 'edge';

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
      fromEmailValue: process.env.EMAIL_FROM ? `${process.env.EMAIL_FROM.substring(0, 3)}...` : 'not set',
      replyToConfigured: !!process.env.EMAIL_REPLY_TO,
      replyToValue: process.env.EMAIL_REPLY_TO ? `${process.env.EMAIL_REPLY_TO.substring(0, 3)}...` : 'not set',
      resendApiKeyConfigured: !!process.env.RESEND_API_KEY,
      resendApiKeyPrefix: process.env.RESEND_API_KEY ? 
        `${process.env.RESEND_API_KEY.substring(0, 3)}...${process.env.RESEND_API_KEY.substring(process.env.RESEND_API_KEY.length - 3)}` : 
        'not set'
    },
    // Safely get headers if available
    request: {
      host: request.headers?.get('host') || 'unknown',
      userAgent: request.headers?.get('user-agent') || 'unknown',
      referer: request.headers?.get('referer') || 'unknown'
    },
    serverTime: new Date().toISOString(),
    vercelEnv: process.env.VERCEL_ENV || 'not set',
    nodeVersion: typeof process.version !== 'undefined' ? process.version : 'not available'
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