import { NextRequest, NextResponse } from 'next/server';
import { sendWaitlistConfirmationEmail, sendWaitlistAdminNotification } from '@/lib/email';

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

// Runtime configuration for Node.js
export const runtime = 'nodejs';

/**
 * API route handler for waitlist signups
 */
export async function POST(request: NextRequest) {
  try {
    // Enhanced logging for production debugging
    console.log(`Waitlist API route called (${process.env.NODE_ENV} environment)`);
    console.log(`Environment config: URL=${process.env.NEXT_PUBLIC_APP_URL || 'not set'}`);
    console.log(`Email config present: ${!!process.env.RESEND_API_KEY}, FROM=${!!process.env.EMAIL_FROM}, REPLY=${!!process.env.EMAIL_REPLY_TO}`);
    
    // Get body data, using a more resilient approach
    const body = await request.json().catch(() => ({}));
    const name = body.name || '';
    const email = body.email || '';
    
    console.log(`Received waitlist request for: ${name} (${email})`);

    // Validate the request data
    if (!name || !email) {
      console.error('Missing required fields: name or email');
      return new NextResponse(
        JSON.stringify({ error: 'Name and email are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // More permissive email validation pattern
    // This is a better pattern that allows more valid email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      console.error(`Invalid email format: ${email}`);
      return new NextResponse(
        JSON.stringify({ error: 'Please enter a valid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`New waitlist signup: ${name} (${email})`);

    // For production, allow special test email so we can validate end-to-end functionality
    const isTestEmail = email === 'delivered@resend.dev';
    // Use a test email in development for more reliable testing
    const emailToUse = process.env.NODE_ENV === 'production' && !isTestEmail ? email : 'delivered@resend.dev';
    
    // Log the email decision
    console.log(`Email decision: using ${emailToUse} for delivery (isTestEmail: ${isTestEmail}, env: ${process.env.NODE_ENV})`);

    try {
      // Validate required environment variables are set
      if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY environment variable is not set');
      }
      
      // Send confirmation email
      console.log(`Sending waitlist confirmation email to ${emailToUse}...`);
      const result = await sendWaitlistConfirmationEmail(emailToUse);
      console.log('Email sent successfully, ID:', result?.messageId);
      
      // Send admin notification
      console.log('Sending admin notification email...');
      const adminResult = await sendWaitlistAdminNotification(name, emailToUse);
      console.log('Admin notification email sent successfully, ID:', adminResult?.messageId);
      
      return new NextResponse(
        JSON.stringify({ 
          success: true, 
          message: 'Successfully joined the waitlist',
          note: process.env.NODE_ENV !== 'production' ? 'In development mode, emails are sent to delivered@resend.dev' : undefined
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (emailError: any) {
      console.error('Error sending emails:', emailError?.message || emailError);
      // Include more detailed error information
      const errorDetails = {
        message: emailError?.message || 'Unknown error',
        code: emailError?.code,
        statusCode: emailError?.statusCode,
        name: emailError?.name,
        stack: process.env.NODE_ENV === 'development' ? emailError?.stack : undefined
      };
      console.error('Error details:', JSON.stringify(errorDetails));
      
      return new NextResponse(
        JSON.stringify({ 
          error: 'Failed to send emails', 
          message: emailError?.message || 'Unknown error',
          details: errorDetails,
          success: false
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: any) {
    console.error('Error processing waitlist signup:', error?.message || error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error', details: error?.message || 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 