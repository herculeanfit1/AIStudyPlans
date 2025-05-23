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
  
  // Return configuration status without exposing sensitive values
  return NextResponse.json({
    configured: isFullyConfigured,
    resendApiKey: resendApiKeyConfigured,
    emailFrom: emailFromConfigured,
    emailReplyTo: emailReplyToConfigured,
    // For client consumption
    nextPublicResendConfigured: isFullyConfigured ? "true" : "false",
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
} 