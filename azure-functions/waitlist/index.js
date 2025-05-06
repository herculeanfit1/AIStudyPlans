const { Resend } = require('resend');
const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

// Initialize KeyVault configuration
const keyVaultName = process.env.KEY_VAULT_NAME;
const keyVaultUrl = keyVaultName ? `https://${keyVaultName}.vault.azure.net` : null;

// Initialize non-secret configuration
const fromEmail = process.env.EMAIL_FROM || 'Lindsey <lindsey@aistudyplans.com>';
const replyToEmail = process.env.EMAIL_REPLY_TO || 'support@aistudyplans.com';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const adminEmail = process.env.ADMIN_EMAIL || 'waitlist@aistudyplans.com';

// This will be initialized when needed
let resend = null;
let secretClient = null;
let resendApiKey = null;

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
    if (error && error.stack) {
      context.log.error(`Stack trace: ${error.stack}`);
    }
  } else if (typeof context.log === 'function') {
    context.log(`ERROR: ${errorMsg}`);
    if (error && error.stack) {
      context.log(`ERROR: Stack trace: ${error.stack}`);
    }
  } else {
    console.error(errorMsg);
    if (error && error.stack) {
      console.error(`Stack trace: ${error.stack}`);
    }
  }
}

// Initialize Secret Client for Key Vault
async function initializeKeyVaultClient(context) {
  if (!keyVaultName) {
    safeLogError(context, 'KEY_VAULT_NAME environment variable is not set');
    throw new Error('Key Vault configuration is missing');
  }

  try {
    safeLog(context, `Initializing Key Vault client for ${keyVaultUrl}`);
    const credential = new DefaultAzureCredential();
    secretClient = new SecretClient(keyVaultUrl, credential);
    safeLog(context, 'Key Vault client initialized successfully');
    return secretClient;
  } catch (error) {
    safeLogError(context, 'Error initializing Key Vault client', error);
    throw new Error(`Failed to initialize Key Vault client: ${error.message}`);
  }
}

// Initialize Resend client with API key from Key Vault
async function initializeResendClient(context) {
  if (!secretClient) {
    await initializeKeyVaultClient(context);
  }

  try {
    if (!resendApiKey) {
      safeLog(context, 'Retrieving Resend API key from Key Vault...');
      const secret = await secretClient.getSecret('resend-api-key');
      resendApiKey = secret.value;
      
      if (!resendApiKey) {
        throw new Error('Resend API key not found in Key Vault');
      }
    }
    
    // Initialize Resend with API key
    resend = new Resend(resendApiKey);
    safeLog(context, 'Resend client initialized successfully');
    return resend;
  } catch (error) {
    safeLogError(context, 'Error initializing Resend client', error);
    throw new Error(`Failed to initialize Resend client: ${error.message}`);
  }
}

// Azure Functions compatible API for waitlist
module.exports = async function (context, req) {
  safeLog(context, 'Waitlist API called');
  
  try {
    // Initialize clients if not already initialized
    if (!resend) {
      await initializeResendClient(context);
    }
    
    // Log configuration (without sensitive data)
    safeLog(context, `Environment config: URL=${appUrl}, FROM=${fromEmail}, REPLY_TO=${replyToEmail}`);
    
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
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true'
        },
        body: JSON.stringify({
          error: 'Name and email are required',
          success: false
        })
      };
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      safeLogError(context, `Invalid email format: ${email}`);
      context.res = {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true'
        },
        body: JSON.stringify({
          error: 'Please enter a valid email address',
          success: false
        })
      };
      return;
    }

    safeLog(context, `New waitlist signup: ${name} (${email})`);

    // For production, allow special test email for validation
    const isTestEmail = email === 'delivered@resend.dev';
    // Use test email in development for more reliable testing
    const emailToUse = process.env.NODE_ENV === 'production' && !isTestEmail ? email : 'delivered@resend.dev';
    
    safeLog(context, `Email decision: using ${emailToUse} for delivery (isTestEmail: ${isTestEmail})`);

    // Send confirmation email
    safeLog(context, `Sending waitlist confirmation email to ${emailToUse}...`);
    const confirmationResult = await sendWaitlistConfirmationEmail(emailToUse);
    safeLog(context, `Confirmation email sent successfully. ID: ${confirmationResult.messageId || 'n/a'}`);

    // Send admin notification
    safeLog(context, 'Sending admin notification email...');
    const adminNotificationResult = await sendWaitlistAdminNotification(name, emailToUse);
    safeLog(context, `Admin notification email sent successfully. ID: ${adminNotificationResult.messageId || 'n/a'}`);

    // Return success response
    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
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
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
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
    const now = new Date();
    // Get current day and time for logging optimal send times
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = now.getHours();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Check if we're sending during optimal hours (9-11 AM or 4-7 PM)
    const isOptimalTime = (hour >= 9 && hour <= 11) || (hour >= 16 && hour <= 19);
    // Check if we're sending on optimal days (Tues-Thurs)
    const isOptimalDay = dayOfWeek >= 2 && dayOfWeek <= 4;
    
    console.log(`Sending email to ${to} on ${dayNames[dayOfWeek]} at ${hour}:${now.getMinutes().toString().padStart(2, '0')} - ${isOptimalDay ? 'Optimal day' : 'Non-optimal day'}, ${isOptimalTime ? 'Optimal time' : 'Non-optimal time'}`);

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
  const year = new Date().getFullYear();
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <img src="${appUrl}/images/logo.png" alt="SchedulEd Logo" style="display: block; width: 150px; margin-bottom: 20px;">
      <h1 style="color: #4f46e5; margin-bottom: 20px;">Welcome to the SchedulEd Waitlist!</h1>
      <p>Thanks for joining our waitlist! We're excited to have you on board.</p>
      <p>We're working hard to create the best AI-powered study planning tool for students like you.</p>
      <p>We'll notify you as soon as we're ready to launch.</p>
      <div style="margin: 30px 0;">
        <a href="${appUrl}/demo" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Explore Our Dashboard Demo</a>
      </div>
      <p>If you have any questions, feel free to reply to this email.</p>
      <p>Best,<br>The SchedulEd Team</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
        <p>&copy; ${year} SchedulEd. All rights reserved.</p>
      </div>
    </div>
  `;

  const text = `
Welcome to the SchedulEd Waitlist!

Thanks for joining our waitlist! We're excited to have you on board.
We're working hard to create the best AI-powered study planning tool for students like you.
We'll notify you as soon as we're ready to launch.

Explore Our Dashboard Demo: ${appUrl}/demo

If you have any questions, feel free to reply to this email.

Best,
The SchedulEd Team

© ${year} SchedulEd. All rights reserved.
  `;

  return { html, text };
}

function getWaitlistAdminNotificationTemplate(name, email) {
  const year = new Date().getFullYear();
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h1 style="color: #4f46e5; margin-bottom: 20px;">New SchedulEd Waitlist Signup</h1>
      <p>A new user has joined the waitlist:</p>
      <ul style="background-color: #f9fafb; padding: 15px 20px; border-radius: 5px;">
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Signed Up:</strong> ${new Date().toLocaleString()}</li>
      </ul>
      <p>This is an automated notification.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
        <p>&copy; ${year} SchedulEd. All rights reserved.</p>
      </div>
    </div>
  `;

  const text = `
New SchedulEd Waitlist Signup

A new user has joined the waitlist:

Name: ${name}
Email: ${email}
Signed Up: ${new Date().toLocaleString()}

This is an automated notification.

© ${year} SchedulEd. All rights reserved.
  `;

  return { html, text };
} 