#!/usr/bin/env node

/**
 * Test Feedback Campaign Emails
 * 
 * This script allows you to manually trigger feedback campaign emails
 * for testing purposes. You can send a specific email in the sequence
 * to a test user.
 * 
 * Usage:
 *   node scripts/test-feedback-emails.js [email] [position]
 * 
 * Parameters:
 *   email    - Email address to send to (default: delivered@resend.dev)
 *   position - Email sequence position to send (0-4, default: 1)
 *               0: Welcome email
 *               1: First feedback email (features)
 *               2: Second feedback email (challenges)
 *               3: Third feedback email (design)
 *               4: Final feedback email (satisfaction)
 * 
 * Example:
 *   node scripts/test-feedback-emails.js test@example.com 2
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Resend } = require('resend');
const { createClient } = require('@supabase/supabase-js');
const { 
  getFeedbackEmailTemplate 
} = require('../lib/feedback-email-templates');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Get command line arguments
const testEmail = process.argv[2] || 'delivered@resend.dev';
const position = parseInt(process.argv[3] || '1', 10);

// Validate position
if (position < 0 || position > 4 || isNaN(position)) {
  console.error('❌ Invalid position. Use a number between 0-4.');
  process.exit(1);
}

// Configuration
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const feedbackFormUrl = `${appUrl}/feedback`;
const fromEmail = process.env.EMAIL_FROM || 'test@example.com';
const replyTo = process.env.EMAIL_REPLY_TO || 'support@example.com';

// Email names for better output
const emailNames = [
  "Welcome email", 
  "First feedback request (features)",
  "Second feedback request (challenges)",
  "Third feedback request (design)",
  "Final feedback request (satisfaction)"
];

// Main function
async function main() {
  console.log('SchedulEd Feedback Email Test Tool\n');
  console.log('Configuration:');
  console.log('──────────────────────────────────────────────────');
  console.log(`✓ RESEND_API_KEY: ${process.env.RESEND_API_KEY ? 'Set' : 'Not set'}`);
  console.log(`✓ SUPABASE URL: ${supabaseUrl ? 'Set' : 'Not set'}`);
  console.log(`✓ APP URL: ${appUrl}`);
  console.log(`✓ EMAIL: ${emailNames[position]} (position ${position})`);
  console.log(`✓ RECIPIENT: ${testEmail}`);
  console.log('──────────────────────────────────────────────────\n');

  // Check for required environment variables
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is not defined in your .env.local file');
    process.exit(1);
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase credentials are not properly set in your .env.local file');
    console.log('Creating a temporary test user instead of using the database...');
  }

  try {
    // Try to find or create a test user
    let userId = 1;
    let user = {
      id: userId,
      name: 'Test User',
      email: testEmail,
      email_sequence_position: position - 1,
      last_email_sent_at: new Date().toISOString()
    };

    // If Supabase is configured, try to find or create the user
    if (supabaseUrl && supabaseAnonKey) {
      console.log(`🔍 Looking for user with email: ${testEmail}`);
      
      // Check if user already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('waitlist_users')
        .select('id, name, email, email_sequence_position, last_email_sent_at')
        .eq('email', testEmail)
        .limit(1);
      
      if (checkError) {
        console.error('❌ Error checking for existing user:', checkError.message);
      } else if (existingUsers && existingUsers.length > 0) {
        user = existingUsers[0];
        userId = user.id;
        console.log(`✓ Found existing user: ID ${userId} - ${user.name} (${user.email})`);
      } else {
        // Create test user in database
        console.log('✓ No existing user found. Creating test user...');
        const { data: newUser, error: insertError } = await supabase
          .from('waitlist_users')
          .insert([{ 
            name: 'Test User', 
            email: testEmail,
            feedback_campaign_started: true,
            email_sequence_position: position - 1,
            last_email_sent_at: new Date().toISOString()
          }])
          .select()
          .single();
        
        if (insertError) {
          console.error('❌ Error creating test user:', insertError.message);
        } else if (newUser) {
          user = newUser;
          userId = user.id;
          console.log(`✓ Created test user: ID ${userId} - ${user.name} (${user.email})`);
        }
      }
    }

    // Get email template
    console.log(`📧 Generating ${emailNames[position]} template...`);
    const { html, text, subject } = getFeedbackEmailTemplate(
      position, 
      { 
        appUrl, 
        user, 
        feedbackFormUrl 
      }
    );

    console.log(`🚀 Sending ${emailNames[position]} to ${testEmail}...`);
    
    // Send the email
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      reply_to: replyTo,
      to: testEmail,
      subject,
      html,
      text,
    });

    if (error) {
      console.error('❌ Error sending email:', error);
      process.exit(1);
    }

    console.log(`✅ Success! ${emailNames[position]} sent to ${testEmail}`);
    console.log(`📧 Email ID: ${data.id}`);
    
    if (testEmail === 'delivered@resend.dev') {
      console.log('\n📝 Note: You used the Resend test email (delivered@resend.dev)');
      console.log('   This email will appear in your Resend dashboard, but will not be delivered to an actual inbox.');
      console.log('   To test delivery to a real inbox, use your own email address:');
      console.log(`   node scripts/test-feedback-emails.js your-email@example.com ${position}`);
    }
    
    // Provide information about the feedback URL
    console.log(`\n🔗 Feedback form URL in the email:`);
    console.log(`   ${feedbackFormUrl}?userId=${userId}&emailId=feedback${position}`);
    console.log('\n📋 You can use this to test the complete feedback submission flow.');
  } catch (err) {
    console.error('❌ Exception when sending email:');
    console.error(err);
    process.exit(1);
  }
}

// Run the main function
main(); 