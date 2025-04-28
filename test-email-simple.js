/**
 * Simple Email Test Script
 * 
 * Run this script with: node test-email-simple.js
 * This bypasses Next.js and directly tests the email sending functionality
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Resend } = require('resend');

// Initialize Resend with API key
const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.error('RESEND_API_KEY is not defined in .env.local file');
  process.exit(1);
}

const resend = new Resend(resendApiKey);

// Use Resend's test address for reliable testing
const testEmail = 'delivered@resend.dev';

async function sendTestEmail() {
  console.log(`Sending test email to: ${testEmail}`);
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Lindsey <lindsey@aistudyplans.com>',
      to: testEmail,
      subject: 'Test Email from SchedulEd',
      html: `
        <h1>This is a test email</h1>
        <p>If you can see this, email sending works correctly!</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent successfully!');
      console.log('Message ID:', data.id);
    }
  } catch (error) {
    console.error('Exception while sending email:', error.message);
  }
}

// Run the test
sendTestEmail(); 