#!/usr/bin/env node

/**
 * Email Test Script
 * 
 * A simple script to test email sending functionality using Resend.
 * 
 * Usage:
 *   node scripts/test-email.js [template] [recipient]
 * 
 * Templates:
 *   - simple: Basic test email
 *   - waitlist: Waitlist confirmation email
 *   - feedback: Feedback request email
 *   - all: Send all email templates
 * 
 * Examples:
 *   node scripts/test-email.js simple user@example.com
 *   node scripts/test-email.js waitlist user@example.com
 *   node scripts/test-email.js all user@example.com
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Resend } = require('resend');

// Configure email settings
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM || 'lindsey@aistudyplans.com';
const REPLY_TO = process.env.EMAIL_REPLY_TO || 'support@aistudyplans.com';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Parse command-line arguments
const template = process.argv[2] || 'simple';
const recipient = process.argv[3] || 'delivered@resend.dev';

// Define email templates
const templates = {
  simple: {
    subject: 'AIStudyPlans Test Email',
    html: `
      <h1>AIStudyPlans Email Test</h1>
      <p>This is a test email from the AIStudyPlans application.</p>
      <p>If you're seeing this, email sending is working correctly!</p>
      <p>
        <a href="${APP_URL}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Visit AIStudyPlans</a>
      </p>
    `
  },
  waitlist: {
    subject: 'Welcome to the AIStudyPlans Waitlist!',
    html: `
      <h1>You're on the Waitlist!</h1>
      <p>Thank you for joining the AIStudyPlans waitlist. We're excited to have you!</p>
      <p>We'll notify you as soon as we have a spot available for you.</p>
      <p>In the meantime, check out our resources to get started with effective study planning:</p>
      <ul>
        <li><a href="${APP_URL}/resources/effective-studying">Effective Studying Techniques</a></li>
        <li><a href="${APP_URL}/resources/time-management">Time Management for Students</a></li>
      </ul>
      <p>
        <a href="${APP_URL}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Visit AIStudyPlans</a>
      </p>
    `
  },
  feedback: {
    subject: 'We Value Your Feedback on AIStudyPlans',
    html: `
      <h1>How are we doing?</h1>
      <p>We hope you're enjoying AIStudyPlans!</p>
      <p>We'd love to hear your thoughts on your experience so far. Your feedback helps us improve.</p>
      <p>
        <a href="${APP_URL}/feedback?userId=123&emailId=test" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Share Your Feedback</a>
      </p>
      <p>Thank you for helping us build a better product!</p>
    `
  }
};

// Function to send an email
async function sendEmail(type, to) {
  const template = templates[type];
  
  if (!template) {
    console.error(`Error: Unknown template "${type}"`);
    return false;
  }
  
  try {
    console.log(`Sending ${type} email to ${to}...`);
    
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: to,
      subject: template.subject,
      html: template.html,
      reply_to: REPLY_TO
    });
    
    console.log(`Email sent successfully! ID: ${data.id}`);
    return true;
  } catch (error) {
    console.error(`Error sending ${type} email:`, error);
    return false;
  }
}

// Main function
async function main() {
  console.log('AIStudyPlans Email Test');
  console.log('-------------------------');
  console.log(`API Key: ${process.env.RESEND_API_KEY ? 'Configured' : 'Missing'}`);
  console.log(`From: ${FROM_EMAIL}`);
  console.log(`Reply-To: ${REPLY_TO}`);
  console.log(`App URL: ${APP_URL}`);
  console.log(`Template: ${template}`);
  console.log(`Recipient: ${recipient}`);
  console.log('-------------------------');
  
  if (!process.env.RESEND_API_KEY) {
    console.error('Error: RESEND_API_KEY is not configured in .env.local');
    process.exit(1);
  }
  
  if (template === 'all') {
    // Send all templates
    for (const type of ['simple', 'waitlist', 'feedback']) {
      await sendEmail(type, recipient);
    }
    console.log('All emails sent!');
  } else {
    // Send a specific template
    const success = await sendEmail(template, recipient);
    if (!success) {
      process.exit(1);
    }
  }
}

// Run the script
main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
}); 