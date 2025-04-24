#!/usr/bin/env node
/**
 * SchedulEd Email CLI Utility
 * 
 * A command-line tool for testing email functionality
 * 
 * Usage:
 * node email-cli.js waitlist john.doe@example.com
 * node email-cli.js reset john.doe@example.com abc123
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

// Initialize Resend with API key
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  console.error('Error: RESEND_API_KEY is not defined in your .env.local file');
  console.error('Please set up your environment variables first. See email-setup.md for instructions.');
  process.exit(1);
}

const resend = new Resend(resendApiKey);
const fromEmail = process.env.EMAIL_FROM || 'Lindsey <lindsey@aistudyplans.com>';
const replyToEmail = process.env.EMAIL_REPLY_TO || 'support@aistudyplans.com';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];
const email = args[1];

if (!command || !email) {
  showHelp();
  process.exit(1);
}

// Process commands
async function main() {
  try {
    switch (command.toLowerCase()) {
      case 'waitlist':
        await sendWaitlistEmail(email);
        break;
      case 'reset':
        const token = args[2] || 'test-token-123456789';
        await sendPasswordResetEmail(email, token);
        break;
      case 'test':
        await sendTestEmail(email);
        break;
      default:
        console.error(`Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error('Error sending email:', error.message || error);
    process.exit(1);
  }
}

// Show help message
function showHelp() {
  console.log('SchedulEd Email CLI Utility');
  console.log('------------------------------');
  console.log('Usage:');
  console.log('  node email-cli.js <command> <email> [options]');
  console.log('\nCommands:');
  console.log('  waitlist <email>           Send a waitlist confirmation email');
  console.log('  reset <email> [token]      Send a password reset email');
  console.log('  test <email>               Send a test email');
  console.log('\nExamples:');
  console.log('  node email-cli.js waitlist john.doe@example.com');
  console.log('  node email-cli.js reset john.doe@example.com abc123');
  console.log('  node email-cli.js test john.doe@example.com');
}

// Send waitlist confirmation email
async function sendWaitlistEmail(to) {
  console.log(`Sending waitlist confirmation email to ${to}...`);
  
  // Get email templates (simplified version of what's in lib/email-templates.ts)
  const year = new Date().getFullYear();
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to the SchedulEd Waitlist!</title>
    </head>
    <body style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; color: #374151; background-color: #f9fafb;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f9fafb;">
        <tr>
          <td align="center" style="padding: 30px 0;">
            <table width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <!-- Header -->
              <tr>
                <td style="padding: 30px 30px 20px;">
                  <img src="${appUrl}/SchedulEd_new_logo.png" alt="SchedulEd Logo" style="max-width: 150px; height: auto;" />
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 0 30px;">
                  <h1 style="color: #4f46e5; font-size: 24px; margin-top: 0; margin-bottom: 16px;">Welcome to the Waitlist!</h1>
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    Thank you for joining our waitlist! We're thrilled to have you on board.
                  </p>
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    We're currently putting the finishing touches on SchedulEd, your AI-powered study plan generator. 
                    We'll notify you as soon as we launch and you'll be among the first to experience personalized learning paths.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px; border-top: 1px solid #e5e7eb; text-align: center;">
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 16px;">
                    If you have any questions, feel free to reply to this email.
                  </p>
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    Best regards,<br />
                    The SchedulEd Team
                  </p>
                  <p style="color: #9ca3af; font-size: 14px; margin-bottom: 0;">
                    © ${year} SchedulEd. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `
Welcome to the SchedulEd Waitlist!

Thank you for joining our waitlist! We're thrilled to have you on board.

We're currently putting the finishing touches on SchedulEd, your AI-powered study plan generator. 
We'll notify you as soon as we launch and you'll be among the first to experience personalized learning paths.

If you have any questions, feel free to reply to this email.

Best regards,
The SchedulEd Team

© ${year} SchedulEd. All rights reserved.
  `;

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject: 'Welcome to the SchedulEd Waitlist!',
    html,
    text,
    reply_to: replyToEmail,
  });

  if (error) {
    throw new Error(`Failed to send waitlist email: ${error.message}`);
  }

  console.log('✅ Waitlist confirmation email sent successfully!');
  console.log('Email ID:', data.id);
  return data;
}

// Send password reset email
async function sendPasswordResetEmail(to, token) {
  console.log(`Sending password reset email to ${to}...`);
  
  // Generate reset URL
  const resetUrl = `${appUrl}/reset-password?token=${token}`;
  const year = new Date().getFullYear();
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your SchedulEd Password</title>
    </head>
    <body style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; color: #374151; background-color: #f9fafb;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f9fafb;">
        <tr>
          <td align="center" style="padding: 30px 0;">
            <table width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <!-- Header -->
              <tr>
                <td style="padding: 30px 30px 20px;">
                  <img src="${appUrl}/SchedulEd_new_logo.png" alt="SchedulEd Logo" style="max-width: 150px; height: auto;" />
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 0 30px;">
                  <h1 style="color: #4f46e5; font-size: 24px; margin-top: 0; margin-bottom: 16px;">Reset Your Password</h1>
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    We received a request to reset your password. If you didn't make this request, you can safely ignore this email.
                  </p>
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    To reset your password, click the button below:
                  </p>
                </td>
              </tr>
              
              <!-- CTA -->
              <tr>
                <td style="padding: 0 30px 30px; text-align: center;">
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td style="padding: 20px 0;">
                        <table cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto;">
                          <tr>
                            <td style="background-color: #4f46e5; border-radius: 6px;">
                              <a href="${resetUrl}" target="_blank" style="color: #ffffff; font-size: 16px; font-weight: 500; text-decoration: none; display: inline-block; padding: 12px 24px;">
                                Reset Password
                              </a>
                            </td>
                          </tr>
                        </table>
                        <p style="color: #6b7280; font-size: 14px; margin-top: 16px;">
                          If the button doesn't work, copy and paste this link into your browser: 
                          <br>
                          <a href="${resetUrl}" style="color: #4f46e5; word-break: break-all;">${resetUrl}</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Security Note -->
              <tr>
                <td style="padding: 0 30px 30px;">
                  <table style="width: 100%; background-color: #f3f4f6; border-radius: 8px; padding: 20px;" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td>
                        <p style="color: #374151; font-size: 14px; margin-top: 0; margin-bottom: 0;">
                          <strong>Security Notice:</strong> This link will expire in 24 hours and can only be used once.
                          If you didn't request this password reset, please secure your account by changing your password.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px; border-top: 1px solid #e5e7eb; text-align: center;">
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 16px;">
                    If you have any questions, feel free to reply to this email.
                  </p>
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    Best regards,<br />
                    The SchedulEd Team
                  </p>
                  <p style="color: #9ca3af; font-size: 14px; margin-bottom: 0;">
                    © ${year} SchedulEd. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `
Reset Your SchedulEd Password

We received a request to reset your password. If you didn't make this request, you can safely ignore this email.

To reset your password, click the link below:
${resetUrl}

Security Notice: This link will expire in 24 hours and can only be used once. If you didn't request this password reset, please secure your account by changing your password.

If you have any questions, feel free to reply to this email.

Best regards,
The SchedulEd Team

© ${year} SchedulEd. All rights reserved.
  `;

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject: 'Reset Your SchedulEd Password',
    html,
    text,
    reply_to: replyToEmail,
  });

  if (error) {
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }

  console.log('✅ Password reset email sent successfully!');
  console.log('Email ID:', data.id);
  console.log('Reset URL:', resetUrl);
  return data;
}

// Send a simple test email
async function sendTestEmail(to) {
  console.log(`Sending test email to ${to}...`);
  
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject: 'SchedulEd Email Test',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <img src="${appUrl}/SchedulEd_new_logo.png" alt="SchedulEd Logo" style="max-width: 150px; height: auto; margin-bottom: 20px;" />
        <h1 style="color: #4f46e5;">SchedulEd Email Test</h1>
        <p>This is a test email to verify that your Resend configuration is working correctly.</p>
        <p>If you're seeing this, your email system is properly configured!</p>
        <p>Sent at: ${new Date().toLocaleString()}</p>
      </div>
    `,
    text: `SchedulEd Email Test

This is a test email to verify that your Resend configuration is working correctly.

If you're seeing this, your email system is properly configured!

Sent at: ${new Date().toLocaleString()}`,
    reply_to: replyToEmail,
  });

  if (error) {
    throw new Error(`Failed to send test email: ${error.message}`);
  }

  console.log('✅ Test email sent successfully!');
  console.log('Email ID:', data.id);
  return data;
}

// Run the main function
main(); 