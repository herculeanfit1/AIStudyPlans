import { NextRequest, NextResponse } from 'next/server';
import { sendWaitlistConfirmationEmail } from '@/lib/email';

/**
 * API route handler for waitlist signups
 * 
 * Accepts POST requests with name and email in JSON body
 * Validates input and sends confirmation email using the templates
 */
export async function POST(request: NextRequest) {
  try {
    console.log('Waitlist API route called');
    
    const { name, email } = await request.json();
    console.log(`Received waitlist request for: ${name} (${email})`);

    // Validate the request data
    if (!name || !email) {
      console.error('Missing required fields: name or email');
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    if (!email.match(/^\S+@\S+\.\S+$/)) {
      console.error(`Invalid email format: ${email}`);
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // In a real application, you would store this in a database
    console.log(`New waitlist signup: ${name} (${email})`);

    // Send confirmation email using the template
    try {
      console.log('Sending waitlist confirmation email...');
      const result = await sendWaitlistConfirmationEmail(email);
      console.log('Email sent successfully, ID:', result?.messageId);
    } catch (emailError: any) {
      console.error('Error sending waitlist confirmation email:', emailError?.message || emailError);
      // Note: We don't fail the API call if email sending fails
      // The user is still added to the waitlist
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully joined the waitlist',
        name,
        email
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing waitlist signup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 