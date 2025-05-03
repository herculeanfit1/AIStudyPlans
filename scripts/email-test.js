/**
 * Consolidated Email Testing Utility
 * 
 * This script combines functionality from:
 * - test-email-simple.js
 * - test-email-specific.js
 * - test-email-local.js
 * - test-resend.js
 * 
 * Usage:
 *   node scripts/email-test.js simple [email@example.com]
 *   node scripts/email-test.js waitlist [email@example.com]
 *   node scripts/email-test.js feedback [email@example.com]
 *   node scripts/email-test.js all [email@example.com]
 */

require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

// Check for required environment variables
if (!process.env.RESEND_API_KEY) {
  console.error('Error: RESEND_API_KEY environment variable is not set');
  console.log('Set this in your .env.local file or environment variables');
  process.exit(1);
}

const resend = new Resend(process.env.RESEND_API_KEY);
const DEFAULT_TEST_EMAIL = 'delivered@resend.dev';

// Simple email template
const simpleEmailTemplate = {
  from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
  subject: 'Test Email from AIStudyPlans',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5;">Test Email</h1>
      <p>This is a test email from the AIStudyPlans application.</p>
      <p>If you received this, the email sending functionality is working correctly.</p>
      <p>Sent at: ${new Date().toISOString()}</p>
    </div>
  `,
};

// Waitlist confirmation email template
const waitlistEmailTemplate = {
  from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
  subject: 'Welcome to the AIStudyPlans Waitlist!',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5;">Welcome to AIStudyPlans!</h1>
      <p>Thank you for joining our waitlist. We're excited to have you with us!</p>
      <p>We'll keep you updated about our progress and notify you when early access becomes available.</p>
      <p>Best regards,<br/>The AIStudyPlans Team</p>
    </div>
  `,
};

// Feedback email template
const feedbackEmailTemplate = {
  from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
  subject: 'Share Your Feedback with AIStudyPlans',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5;">We Value Your Feedback</h1>
      <p>Thank you for your interest in AIStudyPlans.</p>
      <p>We'd love to hear your thoughts about our service. Please take a moment to share your feedback.</p>
      <p><a href="http://localhost:3000/feedback?userId=123&emailId=feedback1" style="background: #4F46E5; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Share Feedback</a></p>
      <p>Best regards,<br/>The AIStudyPlans Team</p>
    </div>
  `,
};

/**
 * Send a test email
 * @param {string} type - The type of email to send: simple, waitlist, feedback, or all
 * @param {string} recipient - The email recipient
 */
async function sendTestEmail(type, recipient) {
  const to = recipient || DEFAULT_TEST_EMAIL;
  console.log(`Sending ${type} test email to: ${to}`);
  
  try {
    let results = [];
    
    if (type === 'simple' || type === 'all') {
      const data = await resend.emails.send({
        ...simpleEmailTemplate,
        to,
        reply_to: process.env.EMAIL_REPLY_TO || undefined,
      });
      results.push({ type: 'simple', result: data });
    }
    
    if (type === 'waitlist' || type === 'all') {
      const data = await resend.emails.send({
        ...waitlistEmailTemplate,
        to,
        reply_to: process.env.EMAIL_REPLY_TO || undefined,
      });
      results.push({ type: 'waitlist', result: data });
    }
    
    if (type === 'feedback' || type === 'all') {
      const data = await resend.emails.send({
        ...feedbackEmailTemplate,
        to,
        reply_to: process.env.EMAIL_REPLY_TO || undefined,
      });
      results.push({ type: 'feedback', result: data });
    }
    
    results.forEach(({ type, result }) => {
      if (result.error) {
        console.error(`❌ ${type.toUpperCase()} EMAIL ERROR:`, result.error);
      } else {
        console.log(`✅ ${type.toUpperCase()} EMAIL SENT:`, result.data.id);
      }
    });
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  }
}

// Parse command line arguments
const emailType = process.argv[2] || 'simple';
const recipient = process.argv[3];

// Validate email type
const validTypes = ['simple', 'waitlist', 'feedback', 'all'];
if (!validTypes.includes(emailType)) {
  console.error(`Error: Invalid email type. Must be one of: ${validTypes.join(', ')}`);
  console.log('Usage: node scripts/email-test.js [type] [recipient@example.com]');
  process.exit(1);
}

// Run the script
sendTestEmail(emailType, recipient); 