import { Resend } from 'resend';
import { getWaitlistConfirmationTemplate, getPasswordResetTemplate } from './email-templates';

// Initialize Resend with API key
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.EMAIL_FROM || 'Lindsey <lindsey@aistudyplans.com>';
const replyToEmail = process.env.EMAIL_REPLY_TO || 'support@aistudyplans.com';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Check if API key is provided
if (!resendApiKey) {
  console.warn('RESEND_API_KEY is not defined. Email functionality will not work.');
}

// Initialize Resend client
const resend = resendApiKey ? new Resend(resendApiKey) : null;

/**
 * Send an email using Resend
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  if (!resend) {
    console.error('Resend client is not initialized. Cannot send email.');
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
      console.error('Error sending email via Resend:', error);
      throw new Error(error.message);
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Exception when sending email:', error);
    throw error;
  }
}

/**
 * Send a welcome email to a new waitlist signup
 */
export async function sendWaitlistConfirmationEmail(email: string) {
  const subject = 'Welcome to the SchedulEd Waitlist!';
  
  // Get the email template
  const { html, text } = getWaitlistConfirmationTemplate({ appUrl });

  return sendEmail({
    to: email,
    subject,
    html,
    text,
  });
}

/**
 * Send a password reset email
 */
export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const subject = 'Reset Your SchedulEd Password';
  
  // Get the email template
  const { html, text } = getPasswordResetTemplate({ appUrl, resetToken });

  return sendEmail({
    to: email,
    subject,
    html,
    text,
  });
} 