import { NextRequest, NextResponse } from 'next/server';
import { sendWaitlistConfirmationEmail, sendWaitlistAdminNotification } from '@/lib/email';

// Force dynamic rendering and disable static optimization
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * API route handler for waitlist signups
 */
export async function POST(request: NextRequest) {
  try {
    console.log('Waitlist API route called');
    
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

    if (!email.match(/^\S+@\S+\.\S+$/)) {
      console.error(`Invalid email format: ${email}`);
      return new NextResponse(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`New waitlist signup: ${name} (${email})`);

    // Use a test email in development for more reliable testing
    const testEmail = 'delivered@resend.dev';
    const emailToUse = process.env.NODE_ENV === 'production' ? email : testEmail;

    try {
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
          note: 'In development mode, emails are sent to delivered@resend.dev'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (emailError: any) {
      console.error('Error sending emails:', emailError?.message || emailError);
      return new NextResponse(
        JSON.stringify({ 
          error: 'Failed to send emails', 
          message: emailError?.message || 'Unknown error',
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