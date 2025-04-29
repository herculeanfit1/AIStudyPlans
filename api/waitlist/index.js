// Import the email functions from lib
const { Resend } = require('resend');

// Initialize email configuration
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.EMAIL_FROM || 'Lindsey <lindsey@aistudyplans.com>';
const replyToEmail = process.env.EMAIL_REPLY_TO || 'support@aistudyplans.com';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const adminEmail = 'waitlist@aistudyplans.com';

// Initialize Resend client
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Helper for logging to handle different context structures
function safeLog(context, message) {
  if (typeof context.log === 'function') {
    context.log(message);
  } else if (context.log && typeof context.log.info === 'function') {
    context.log.info(message);
  } else {
    console.log(message);
  }
}

function safeLogError(context, message, error) {
  const errorMsg = error ? `${message}: ${error.message || error}` : message;
  if (typeof context.log === 'object' && typeof context.log.error === 'function') {
    context.log.error(errorMsg);
  } else if (typeof context.log === 'function') {
    context.log(`ERROR: ${errorMsg}`);
  } else {
    console.error(errorMsg);
  }
}

// Azure Functions compatible API for waitlist
module.exports = async function (context, req) {
  safeLog(context, 'Waitlist API called');
  
  try {
    // Enhanced logging
    safeLog(context, `Environment config: URL=${process.env.NEXT_PUBLIC_APP_URL || 'not set'}`);
    safeLog(context, `Email config present: ${!!process.env.RESEND_API_KEY}, FROM=${!!process.env.EMAIL_FROM}, REPLY=${!!process.env.EMAIL_REPLY_TO}`);
    
    // Get body data
    const body = req.body || {};
    const name = body.name || '';
    const email = body.email || '';
    
    safeLog(context, `Received waitlist request for: ${name} (${email})`);

    // Validate the request data
    if (!name || !email) {
      safeLogError(context, 'Missing required fields: name or email');
      context.res = {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Name and email are required' })
      };
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      safeLogError(context, `Invalid email format: ${email}`);
      context.res = {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Please enter a valid email address' })
      };
      return;
    }

    safeLog(context, `New waitlist signup: ${name} (${email})`);

    // For production, allow special test email for validation
    const isTestEmail = email === 'delivered@resend.dev';
    // Use test email in development for more reliable testing
    const emailToUse = process.env.NODE_ENV === 'production' && !isTestEmail ? email : 'delivered@resend.dev';
    
    safeLog(context, `Email decision: using ${emailToUse} for delivery (isTestEmail: ${isTestEmail})`);

    // Check if Resend API key is configured
    if (!resend) {
      throw new Error('Resend client is not initialized (RESEND_API_KEY missing)');
    }

    // Send confirmation email
    safeLog(context, `Sending waitlist confirmation email to ${emailToUse}...`);
    const confirmationResult = await sendWaitlistConfirmationEmail(emailToUse);
    safeLog(context, 'Confirmation email sent successfully');

    // Send admin notification
    safeLog(context, 'Sending admin notification email...');
    const adminNotificationResult = await sendWaitlistAdminNotification(name, emailToUse);
    safeLog(context, 'Admin notification email sent successfully');

    // Return success response
    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Successfully joined the waitlist',
        note: process.env.NODE_ENV !== 'production' ? 'In development mode, emails are sent to delivered@resend.dev' : undefined
      })
    };
  } catch (error) {
    safeLogError(context, 'Error processing waitlist signup', error);
    
    // Return error response
    context.res = {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Failed to process waitlist signup',
        message: error.message || 'Unknown error',
        success: false
      })
    };
  }
};

// Email utility functions
async function sendEmail({
  to,
  subject,
  html,
  text,
}) {
  if (!resend) {
    throw new Error('Email service not configured');
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
      text,
      reply_to: replyToEmail,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    throw error;
  }
}

async function sendWaitlistConfirmationEmail(email) {
  const subject = 'Welcome to the SchedulEd Waitlist!';
  const { html, text } = getWaitlistConfirmationTemplate();
  return sendEmail({ to: email, subject, html, text });
}

async function sendWaitlistAdminNotification(name, email) {
  const subject = 'New SchedulEd Waitlist Signup';
  const { html, text } = getWaitlistAdminNotificationTemplate(name, email);
  
  // Use Resend's test email as fallback to avoid domain verification issues
  const adminEmailToUse = process.env.NODE_ENV === 'production' 
    ? adminEmail 
    : 'delivered@resend.dev';

  return sendEmail({ to: adminEmailToUse, subject, html, text });
}

// Email templates
function getWaitlistConfirmationTemplate() {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4f46e5;">Welcome to the SchedulEd Waitlist!</h1>
      <p>Thanks for joining our waitlist! We're excited to have you on board.</p>
      <p>We're working hard to create the best AI-powered study planning tool for students like you.</p>
      <p>We'll notify you as soon as we're ready to launch.</p>
      <p>Best,<br>The SchedulEd Team</p>
    </div>
  `;

  const text = `
Welcome to the SchedulEd Waitlist!

Thanks for joining our waitlist! We're excited to have you on board.
We're working hard to create the best AI-powered study planning tool for students like you.
We'll notify you as soon as we're ready to launch.

Best,
The SchedulEd Team
  `;

  return { html, text };
}

function getWaitlistAdminNotificationTemplate(name, email) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4f46e5;">New Waitlist Signup</h1>
      <p>A new user has joined the SchedulEd waitlist:</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
      </ul>
    </div>
  `;

  const text = `
New Waitlist Signup

A new user has joined the SchedulEd waitlist:

Name: ${name}
Email: ${email}
Time: ${new Date().toLocaleString()}
  `;

  return { html, text };
} 