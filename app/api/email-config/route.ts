import { NextResponse } from 'next/server';

/**
 * API endpoint to check email configuration status
 * Returns whether Resend API key and email addresses are configured
 * Does not return any sensitive values, just boolean status
 */
export async function GET() {
  // Check if key environment variables are set
  const resendApiKeyConfigured = !!process.env.RESEND_API_KEY;
  const emailFromConfigured = !!process.env.EMAIL_FROM;
  const emailReplyToConfigured = !!process.env.EMAIL_REPLY_TO;
  
  // Check all required email configuration
  const isFullyConfigured = resendApiKeyConfigured && emailFromConfigured && emailReplyToConfigured;
  
  // Include additional debugging information for troubleshooting
  const debugInfo = process.env.NODE_ENV === 'development' ? {
    environment: process.env.NODE_ENV,
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
    allVariablesPresent: isFullyConfigured,
    supabaseConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  } : undefined;
  
  // Return configuration status without exposing sensitive values
  return NextResponse.json({
    configured: isFullyConfigured,
    resendApiKey: resendApiKeyConfigured,
    emailFrom: emailFromConfigured,
    emailReplyTo: emailReplyToConfigured,
    // For client consumption
    nextPublicResendConfigured: isFullyConfigured ? "true" : "false",
    // Debugging info
    debug: debugInfo,
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

/**
 * Required for static export compatibility
 * This generates static paths for the API route
 */
export function generateStaticParams() {
  return [];
} 