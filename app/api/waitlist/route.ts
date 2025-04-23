import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    // Validate the request data
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    if (!email.match(/^\S+@\S+\.\S+$/)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // In a real application, you would store this in a database
    console.log(`New waitlist signup: ${name} (${email})`);

    // Send confirmation email (if Resend API key is configured)
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Lindsey <lindsey@aistudyplans.com>',
          to: email,
          subject: 'Welcome to the SchedulEd Waitlist!',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #4f46e5;">Welcome to SchedulEd!</h1>
              <p>Hello ${name},</p>
              <p>Thank you for joining the SchedulEd waitlist. We're excited to have you on board!</p>
              <p>We're working hard to build the best AI-powered study plan generator for students. You'll be among the first to know when we launch.</p>
              <p>Stay tuned,</p>
              <p>The SchedulEd Team</p>
            </div>
          `,
          reply_to: 'support@aistudyplans.com'
        });
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't return an error response here, we still want to consider the signup successful
      }
    }

    return NextResponse.json(
      { success: true, message: 'Successfully joined the waitlist' },
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