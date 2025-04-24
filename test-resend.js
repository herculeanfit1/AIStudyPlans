/**
 * Test script for Resend email service
 * 
 * Usage:
 * 1. Make sure you have a .env.local file with RESEND_API_KEY
 * 2. Run: node test-resend.js your-test-email@example.com
 */

// Import required modules
const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

// Get API key and email from env
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.EMAIL_FROM || 'lindsey@aistudyplans.com';
const toEmail = process.argv[2]; // Get email from command line argument
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

console.log('Environment variables loaded:');
console.log('- RESEND_API_KEY:', resendApiKey ? `${resendApiKey.substring(0, 5)}...${resendApiKey.substring(resendApiKey.length - 5)}` : 'Not set');
console.log('- EMAIL_FROM:', process.env.EMAIL_FROM || 'Not set (using default)');
console.log('- NEXT_PUBLIC_APP_URL:', appUrl);

if (!resendApiKey) {
  console.error('RESEND_API_KEY is not defined in your .env.local file');
  process.exit(1);
}

if (!toEmail) {
  console.error('Please provide a recipient email: node test-resend.js your-email@example.com');
  process.exit(1);
}

// Initialize Resend with your API key
const resend = new Resend(resendApiKey);

// Send a test email
async function sendTestEmail() {
  console.log('Testing Resend email service:');
  console.log(`- From Address: ${fromEmail}`);
  console.log(`- To Address: ${toEmail}`);
  
  try {
    const { data, error } = await resend.emails.send({
      from: `SchedulEd <${fromEmail}>`,
      to: toEmail,
      subject: 'SchedulEd - Resend Test',
      html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <img src="${appUrl}/SchedulEd_new_logo.png" alt="SchedulEd Logo" style="max-width: 150px; height: auto; margin-bottom: 20px;" />
        <h1 style="color: #4f46e5;">SchedulEd Email Test</h1>
        <p>This is a test email to verify that the SchedulEd email system is correctly configured with Resend.</p>
        <p>Your Resend API key is working correctly, and emails are being sent from your configured address.</p>
        <p>Sent at: ${new Date().toLocaleString()}</p>
      </div>
      `,
      text: `SchedulEd Email Test

This is a test email to verify that the SchedulEd email system is correctly configured with Resend.

Your Resend API key is working correctly, and emails are being sent from your configured address.

Sent at: ${new Date().toLocaleString()}`,
      reply_to: process.env.EMAIL_REPLY_TO || 'support@aistudyplans.com',
    });

    if (error) {
      console.error('Error sending test email:', error);
    } else {
      console.log('✅ Test email sent successfully!');
      console.log('Email ID:', data.id);
    }
  } catch (err) {
    console.error('Exception when sending test email:', err);
  }
}

// Run the test
sendTestEmail(); 