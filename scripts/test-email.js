#!/usr/bin/env node

/**
 * Email Test Script for SchedulEd
 * 
 * Usage:
 *   node scripts/test-email.js [recipient-email]
 * 
 * If no recipient email is provided, it will use delivered@resend.dev
 * as the default test email.
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Resend } = require('resend');

// Get API key from environment
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.EMAIL_FROM || 'lindsey@aistudyplans.com';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Default test email
const defaultTestEmail = 'delivered@resend.dev';

// Get command line arguments
const recipientEmail = process.argv[2] || defaultTestEmail;

// Display configuration information
console.log('SchedulEd Email Test Tool\n');
console.log('Configuration:');
console.log('──────────────────────────────────────────────────');

// Check for API key
if (!resendApiKey) {
  console.error('❌ RESEND_API_KEY is not defined in your .env.local file');
  console.log('\nPlease create or update .env.local with your Resend API key:');
  console.log('RESEND_API_KEY=your_resend_api_key_here');
  console.log('\nYou can also visit http://localhost:3000/email-setup for detailed instructions.');
  process.exit(1);
}

// Display settings
console.log(`✓ RESEND_API_KEY: ${resendApiKey.substring(0, 5)}...${resendApiKey.substring(resendApiKey.length - 4)}`);
console.log(`✓ FROM ADDRESS: ${fromEmail}`);
console.log(`✓ APP URL: ${appUrl}`);
console.log(`✓ TESTING MODE: Using ${recipientEmail} as recipient`);
console.log('──────────────────────────────────────────────────\n');

// Initialize Resend
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
          <li>From: ${fromEmail}</li>
          <li>To: ${recipientEmail}</li>
          <li>App URL: ${appUrl}</li>
          <li>Sent at: ${new Date().toLocaleString()}</li>
        </ul>
        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666;">
          This is an automated test email sent from the SchedulEd application.
        </p>
      </div>
      `,
      text: `SchedulEd Email Test

This is a test email from your SchedulEd application.
If you're seeing this, your email configuration is working correctly!

Configuration:
- From: ${fromEmail}
- To: ${recipientEmail}
- App URL: ${appUrl}
- Sent at: ${new Date().toLocaleString()}

This is an automated test email sent from the SchedulEd application.
`,
    });

    if (error) {
      console.error('❌ Error sending email:', error.message);
      console.error('\nMore details:', error);
      process.exit(1);
    }

    console.log('✅ Success! Email sent successfully');
    console.log(`📧 Email ID: ${data.id}`);
    
    if (recipientEmail === defaultTestEmail) {
      console.log('\n📝 Note: You used the Resend test email (delivered@resend.dev)');
      console.log('   This email will appear in your Resend dashboard, but will not be delivered to an actual inbox.');
      console.log('   To test delivery to a real inbox, use your own email address:');
      console.log(`   node scripts/test-email.js your-email@example.com`);
    } else {
      console.log(`\n📝 Check ${recipientEmail} for the test email`);
    }
  } catch (err) {
    console.error('❌ Exception when sending email:');
    console.error(err);
    
    // Provide more context based on common errors
    if (err.message?.includes('unauthorized')) {
      console.log('\n💡 Your API key appears to be invalid or expired.');
      console.log('   Generate a new key in the Resend dashboard and update your .env.local file.');
    } else if (err.message?.includes('network')) {
      console.log('\n💡 There appears to be a network issue.');
      console.log('   Check your internet connection and try again.');
    }
    
    process.exit(1);
  }
}

// Run the test
sendTestEmail(); 