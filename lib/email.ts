import { Resend } from 'resend';
import { getWaitlistConfirmationTemplate, getPasswordResetTemplate, getWaitlistAdminNotificationTemplate } from './email-templates';
import { getFeedbackEmailTemplate } from './feedback-email-templates';
import { WaitlistUser } from './supabase';

// Initialize Resend with API key
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.EMAIL_FROM || 'Lindsey <lindsey@aistudyplans.com>';
const replyToEmail = process.env.EMAIL_REPLY_TO || 'support@aistudyplans.com';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const adminEmail = 'waitlist@aistudyplans.com';
const feedbackFormUrl = `${appUrl}/feedback`;

// Check if API key is provided and log environment details
if (!resendApiKey) {
  console.warn('⚠️ RESEND_API_KEY is not defined. Email functionality will not work.');
} else {
  console.log('✅ Resend API key is configured');
  console.log(`✅ FROM email configured: ${fromEmail}`);
  console.log(`✅ REPLY-TO email configured: ${replyToEmail}`);
  console.log(`✅ App URL configured: ${appUrl}`);
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
    console.error('❌ Resend client is not initialized. Cannot send email.');
    throw new Error('Email service not configured - RESEND_API_KEY is missing');
  }

  try {
    // Get current day and time for logging optimal send times
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = now.getHours();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Check if we're sending during optimal hours (9-11 AM or 4-7 PM)
    const isOptimalTime = (hour >= 9 && hour <= 11) || (hour >= 4 && hour <= 7) || (hour >= 16 && hour <= 19);
    // Check if we're sending on optimal days (Tues-Thurs)
    const isOptimalDay = dayOfWeek >= 2 && dayOfWeek <= 4;
    
    console.log(`📧 Sending email to ${to} on ${dayNames[dayOfWeek]} at ${hour}:${now.getMinutes().toString().padStart(2, '0')} - ${isOptimalDay ? 'Optimal day' : 'Non-optimal day'}, ${isOptimalTime ? 'Optimal time' : 'Non-optimal time'}`);

    // Production debugging - log partial email content for verification
    console.log(`📧 Email Subject: ${subject}`);
    console.log(`📧 Email Text Preview: ${text.substring(0, 50)}...`);
    
    // Use delivered@resend.dev for testing in development
    let emailTo = to;
    if (process.env.NODE_ENV !== 'production' || process.env.DEBUG_EMAIL === 'true') {
      console.log(`⚠️ DEV/DEBUG MODE: Redirecting email from ${to} to delivered@resend.dev`);
      emailTo = 'delivered@resend.dev';
    }

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: emailTo,
      subject,
      html,
      text,
      replyTo: replyToEmail,
    });

    if (error) {
      console.error('❌ Error sending email via Resend:', error);
      throw new Error(error.message);
    }

    console.log(`✅ Email sent successfully to ${emailTo}, ID: ${data?.id}`);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('❌ Exception when sending email:', error);
    throw error;
  }
}

/**
 * Send a welcome email to a new waitlist signup
 * Research shows welcome emails should be sent immediately (74% of users expect it)
 * and have 80%+ open rates
 */
export async function sendWaitlistConfirmationEmail(email: string) {
  const subject = 'Welcome to the SchedulEd Waitlist!';
  
  console.log('📊 Sending immediate welcome email - 74% of subscribers expect this and open rates average 80%');
  
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

/**
 * Send an admin notification when a new user joins the waitlist
 */
export async function sendWaitlistAdminNotification(name: string, email: string) {
  const subject = 'New SchedulEd Waitlist Signup';
  
  // Get the email template
  const { html, text } = getWaitlistAdminNotificationTemplate({ 
    appUrl,
    userName: name,
    userEmail: email
  });

  // Send admin notification to the admin email
  return sendEmail({
    to: adminEmail,
    subject,
    html,
    text,
  });
}

/**
 * Send a feedback campaign email to a waitlist user
 * Based on research, we use the following schedule:
 * - Position 0->1: 3-7 days after welcome (first feedback)
 * - Position 1->2: 7-14 days after first email
 * - Position 2->3: 7-14 days after second email
 * - Position 3->4: 7-14 days after third email
 */
export async function sendFeedbackCampaignEmail(user: WaitlistUser) {
  // Determine which email to send based on the user's position in the sequence
  const sequencePosition = user.email_sequence_position || 0;
  
  // Calculate the next position (for logging)
  const nextPosition = sequencePosition + 1;
  
  // Map positions to descriptive names for logging
  const emailNames = [
    "Welcome email", 
    "First feedback request (features)",
    "Second feedback request (challenges)",
    "Third feedback request (design)",
    "Final feedback request (satisfaction)"
  ];
  
  console.log(`📧 Sending ${emailNames[nextPosition]} to ${user.email} (sequence position ${sequencePosition}->${nextPosition})`);
  
  // Log time since last email
  if (user.last_email_sent_at) {
    const lastEmailDate = new Date(user.last_email_sent_at);
    const now = new Date();
    const daysSinceLastEmail = Math.round((now.getTime() - lastEmailDate.getTime()) / (1000 * 60 * 60 * 24));
    console.log(`⏱️ It has been ${daysSinceLastEmail} days since their last email (research recommends 3-7 days for first email, 7-14 days for subsequent emails)`);
  }
  
  // Get the appropriate template
  const { html, text, subject } = getFeedbackEmailTemplate(
    nextPosition, 
    { 
      appUrl, 
      user, 
      feedbackFormUrl 
    }
  );

  try {
    // Send the email
    const result = await sendEmail({
      to: user.email,
      subject,
      html,
      text,
    });
    
    console.log(`✅ Successfully sent ${emailNames[nextPosition]} to ${user.email} (ID: ${result?.messageId})`);
    
    return result;
  } catch (error) {
    console.error(`❌ Failed to send ${emailNames[nextPosition]} to ${user.email}:`, error);
    throw error;
  }
} 