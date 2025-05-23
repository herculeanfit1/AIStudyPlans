import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

/**
 * Debug endpoint for testing email delivery
 * This endpoint is only enabled in development or when DEBUG_EMAIL=true
 * IMPORTANT: This should be disabled or removed in production once email delivery is confirmed working
 */
export async function POST(request: NextRequest) {
  // Only allow in development or with DEBUG_EMAIL flag
  const isDebugEnabled = process.env.NODE_ENV === 'development' || process.env.DEBUG_EMAIL === 'true';
  
  // Block usage if not in debug mode
  if (!isDebugEnabled) {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode or with DEBUG_EMAIL enabled' },
      { status: 403 }
    );
  }
  
  try {
    // Get request body
    const body = await request.json();
    const { to = 'delivered@resend.dev' } = body;
    
    // Log environment information for debugging
    console.log('📧 Debug Email API called with environment:');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('RESEND_API_KEY present:', !!process.env.RESEND_API_KEY);
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
    console.log('EMAIL_REPLY_TO:', process.env.EMAIL_REPLY_TO);
    
    // Simple HTML and text content for testing
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Test Email from AIStudyPlans</h1>
        <p>This is a test email sent from the debug-email API endpoint.</p>
        <p>Environment: ${process.env.NODE_ENV}</p>
        <p>Time: ${new Date().toISOString()}</p>
      </div>
    `;
    
    const text = `
      Test Email from AIStudyPlans
      
      This is a test email sent from the debug-email API endpoint.
      Environment: ${process.env.NODE_ENV}
      Time: ${new Date().toISOString()}
    `;
    
    // Send the test email
    console.log(`📧 Sending test email to ${to}...`);
    
    const result = await sendEmail({
      to,
      subject: `Test Email from AIStudyPlans (${process.env.NODE_ENV})`,
      html,
      text
    });
    
    console.log('✅ Email sent successfully:', result);
    
    // Return success response
    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      to,
      environment: process.env.NODE_ENV
    });
    
  } catch (error: any) {
    console.error('❌ Error sending debug email:', error);
    
    // Return detailed error information for debugging
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      details: {
        name: error.name,
        code: error.code,
        statusCode: error.statusCode
      }
    }, { status: 500 });
  }
}

/**
 * Required for static export compatibility
 * This generates static paths for the API route
 */
export function generateStaticParams() {
  return [];
} 