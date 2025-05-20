import { NextRequest, NextResponse } from 'next/server';
import { sendWaitlistConfirmationEmail, sendWaitlistAdminNotification } from '@/lib/email';
import { addToWaitlist, startFeedbackCampaign } from '@/lib/supabase';

// Use edge runtime instead of nodejs for static export compatibility
export const runtime = 'edge';

// This is required for static export in Next.js when using output: 'export'
export function generateStaticParams() {
  // Return an empty array since we don't want to pre-render any API routes
  return [];
}

/**
 * API route handler for waitlist signups
 */
export async function POST(request: NextRequest) {
  try {
    // Enhanced logging for production debugging
    console.log(`🚀 Waitlist API route called (${process.env.NODE_ENV} environment)`);
    console.log(`🔧 Environment config: URL=${process.env.NEXT_PUBLIC_APP_URL || 'not set'}`);
    
    // Explicitly log configuration presence for debugging
    const resendApiKeyPresent = !!process.env.RESEND_API_KEY;
    console.log(`📧 Email config: RESEND_API_KEY=${resendApiKeyPresent ? 'present' : 'MISSING'}, FROM=${!!process.env.EMAIL_FROM ? 'present' : 'MISSING'}, REPLY=${!!process.env.EMAIL_REPLY_TO ? 'present' : 'MISSING'}`);
    console.log(`📊 Database config: SUPABASE_URL=${!!process.env.NEXT_PUBLIC_SUPABASE_URL ? 'present' : 'MISSING'}, ANON_KEY=${!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'present' : 'MISSING'}`);
    
    // Get body data, using a more resilient approach
    const body = await request.json().catch(() => ({}));
    const name = body.name || '';
    const email = body.email || '';
    const source = body.source || 'website'; // Track where the signup came from
    
    console.log(`👤 Received waitlist request for: ${name} (${email})`);

    // Validate the request data
    if (!name || !email) {
      console.error('❌ Missing required fields: name or email');
      return new NextResponse(
        JSON.stringify({ error: 'Name and email are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Simplified email validation - just check for @ symbol
    // This matches the frontend validation to prevent inconsistencies
    if (!email.includes('@')) {
      console.error(`❌ Invalid email format: ${email}`);
      return new NextResponse(
        JSON.stringify({ error: 'Please enter a valid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`✅ Validated waitlist signup: ${name} (${email})`);

    try {
      // Add user to database
      console.log(`📥 Adding user to database: ${name} (${email})`);
      const dbResult = await addToWaitlist(name, email, source);
      
      if (!dbResult.success) {
        console.error('❌ Error adding user to database:', dbResult.error);
        // We'll continue even if DB insertion fails to ensure the welcome email is still sent
        console.log('⚠️ Continuing with email sending despite database error');
      } else {
        console.log(`✅ Successfully added user to database: ${dbResult.user?.id}`);
      }
      
      // Validate required environment variables are set
      if (!process.env.RESEND_API_KEY) {
        console.error('❌ RESEND_API_KEY environment variable is not set');
        return new NextResponse(
          JSON.stringify({ 
            error: 'Email service not configured', 
            success: false,
            details: 'Missing API key configuration. Please check server environment variables.'
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Send confirmation email with detailed logging
      console.log(`📧 Sending waitlist confirmation email to ${email}...`);
      try {
        const result = await sendWaitlistConfirmationEmail(email);
        console.log(`✅ Confirmation email sent successfully, ID: ${result?.messageId}`);
      } catch (confirmationError: any) {
        console.error(`❌ Error sending confirmation email: ${confirmationError?.message}`, confirmationError);
        throw confirmationError;
      }
      
      // Send admin notification
      console.log('📧 Sending admin notification email...');
      try {
        const adminResult = await sendWaitlistAdminNotification(name, email);
        console.log(`✅ Admin notification email sent successfully, ID: ${adminResult?.messageId}`);
      } catch (adminEmailError: any) {
        console.error(`⚠️ Admin notification email failed, but continuing: ${adminEmailError?.message}`);
        // Don't throw - we still want to continue if admin email fails
      }
      
      // Start feedback campaign (set up, but first email will be sent by cron job)
      if (dbResult.success && dbResult.user) {
        console.log(`📊 Starting feedback campaign for user: ${dbResult.user.id}`);
        await startFeedbackCampaign(dbResult.user.id);
      }
      
      return new NextResponse(
        JSON.stringify({ 
          success: true, 
          message: 'Successfully joined the waitlist. Please check your email for confirmation.',
          debug: process.env.NODE_ENV !== 'production' ? {
            emailConfig: {
              apiKey: resendApiKeyPresent ? 'present' : 'missing',
              from: process.env.EMAIL_FROM ? 'configured' : 'missing',
              replyTo: process.env.EMAIL_REPLY_TO ? 'configured' : 'missing'
            },
            environment: process.env.NODE_ENV
          } : undefined
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (emailError: any) {
      console.error('❌ Error processing emails:', emailError?.message || emailError);
      // Include more detailed error information
      const errorDetails = {
        message: emailError?.message || 'Unknown error',
        code: emailError?.code,
        statusCode: emailError?.statusCode,
        name: emailError?.name,
        stack: process.env.NODE_ENV === 'development' ? emailError?.stack : undefined
      };
      console.error('❌ Error details:', JSON.stringify(errorDetails));
      
      return new NextResponse(
        JSON.stringify({ 
          error: 'Failed to send emails', 
          message: emailError?.message || 'Unknown error',
          details: errorDetails,
          success: false,
          contact: "Please contact support@aistudyplans.com to ensure your spot on the waitlist."
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: any) {
    console.error('❌ Error processing waitlist signup:', error?.message || error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error?.message || 'Unknown error',
        contact: "Please contact support@aistudyplans.com to ensure your spot on the waitlist."
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 