/**
 * Local test script for Resend email service
 * 
 * Usage:
 * 1. Make sure you have a .env.local file with RESEND_API_KEY
 * 2. Run: node test-email-local.js your-test-email@example.com
 */

require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

// Get the Resend API key from environment variables
const resendApiKey = process.env.RESEND_API_KEY;
// Get the recipient email from command line args, or use the special Resend test email
const recipientEmail = process.argv[2] || 'delivered@resend.dev';
const fromEmail = process.env.EMAIL_FROM || 'lindsey@aistudyplans.com';

console.log('Email Test Configuration:');
console.log('------------------------');
console.log(`RESEND_API_KEY: ${resendApiKey ? '✅ Set' : '❌ Not Set'}`);
console.log(`EMAIL_FROM: ${fromEmail}`);
console.log(`Recipient: ${recipientEmail}`);
console.log('------------------------');

if (!resendApiKey) {
  console.error('❌ Error: RESEND_API_KEY is not defined in your .env.local file');
  process.exit(1);
}

// Initialize Resend with the API key
const resend = new Resend(resendApiKey);

// Send a test email
async function sendTestEmail() {
  console.log(`🚀 Sending test email to ${recipientEmail}...`);
  
  try {
    const { data, error } = await resend.emails.send({
      from: `SchedulEd <${fromEmail}>`,
      to: recipientEmail,
      subject: 'SchedulEd - Email Test',
      html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4f46e5;">SchedulEd Email Test</h1>
        <p>This is a test email from your SchedulEd application.</p>
        <p>If you're seeing this, your email configuration is working correctly!</p>
        <p><strong>Configuration:</strong></p>
        <ul>
          <li>API Key: ${resendApiKey ? '✅ Set (masked for security)' : '❌ Not Set'}</li>
          <li>From: ${fromEmail}</li>
          <li>To: ${recipientEmail}</li>
          <li>Sent at: ${new Date().toLocaleString()}</li>
        </ul>
      </div>
      `,
      text: `SchedulEd Email Test

This is a test email from your SchedulEd application.
If you're seeing this, your email configuration is working correctly!

Configuration:
- API Key: ${resendApiKey ? '✅ Set (masked for security)' : '❌ Not Set'}
- From: ${fromEmail}
- To: ${recipientEmail}
- Sent at: ${new Date().toLocaleString()}
`,
    });

    if (error) {
      console.error('❌ Error sending email:', error);
      return;
    }

    console.log('✅ Success! Email sent successfully');
    console.log(`📧 Email ID: ${data.id}`);
  } catch (error) {
    console.error('❌ Exception when sending email:', error);
  }
}

// Execute the test function
sendTestEmail(); 