#!/usr/bin/env node

/**
 * Test Welcome Email
 * 
 * This script simulates a waitlist signup and sends the welcome email
 * for testing purposes.
 * 
 * Usage:
 *   node scripts/test-welcome-email.js [email] [name]
 * 
 * Example:
 *   node scripts/test-welcome-email.js test@example.com "John Doe"
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Resend } = require('resend');
const { sendWaitlistConfirmationEmail, sendWaitlistAdminNotification } = require('../lib/email');

// Get command line arguments
const testEmail = process.argv[2] || 'delivered@resend.dev';
const testName = process.argv[3] || 'Test User';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Configuration
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Main function
async function main() {
  console.log('SchedulEd Welcome Email Test Tool\n');
  console.log('Configuration:');
  console.log('──────────────────────────────────────────────────');
  console.log(`✓ RESEND_API_KEY: ${process.env.RESEND_API_KEY ? 'Set' : 'Not set'}`);
  console.log(`✓ APP URL: ${appUrl}`);
  console.log(`✓ RECIPIENT: ${testEmail}`);
  console.log(`✓ NAME: ${testName}`);
  console.log('──────────────────────────────────────────────────\n');

  // Check for required environment variables
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is not defined in your .env.local file');
    process.exit(1);
  }

  try {
    // Send welcome email
    console.log(`🚀 Sending welcome email to ${testEmail}...`);
    
    // Set global email for test
    global.testEmail = testEmail;
    global.testName = testName;
    
    const result = await sendWaitlistConfirmationEmail(testEmail, testName);
    
    console.log(`✅ Success! Welcome email sent to ${testEmail}`);
    console.log(`📧 Email ID: ${result?.messageId}`);
    
    // Send admin notification
    console.log(`\n🚀 Sending admin notification email...`);
    const adminResult = await sendWaitlistAdminNotification(testName, testEmail);
    console.log(`✅ Success! Admin notification email sent`);
    console.log(`📧 Email ID: ${adminResult?.messageId}`);
    
    if (testEmail === 'delivered@resend.dev') {
      console.log('\n📝 Note: You used the Resend test email (delivered@resend.dev)');
      console.log('   This email will appear in your Resend dashboard, but will not be delivered to an actual inbox.');
      console.log('   To test delivery to a real inbox, use your own email address:');
      console.log(`   node scripts/test-welcome-email.js your-email@example.com "Your Name"`);
    }
  } catch (err) {
    console.error('❌ Exception when sending email:');
    console.error(err);
    process.exit(1);
  }
}

// Run the main function
main(); 