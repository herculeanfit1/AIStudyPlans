/**
 * Email Configuration Check Utility
 *
 * This script checks your environment setup for Resend email configuration
 * and provides guidance on how to fix any issues.
 *
 * Usage:
 * node check-email-config.js
 */

// Load environment variables
require("dotenv").config({ path: ".env.local" });

// Start check
console.log("🔍 Checking SchedulEd Email Configuration...\n");

// Check for Resend API Key
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  console.error("❌ RESEND_API_KEY is missing in your .env.local file");
  console.log("   Please create or edit .env.local and add:");
  console.log("   RESEND_API_KEY=your_api_key_from_resend\n");
} else {
  // Mask the API key for security
  const maskedKey = `${resendApiKey.substring(0, 3)}...${resendApiKey.substring(resendApiKey.length - 3)}`;
  console.log(`✅ RESEND_API_KEY found: ${maskedKey}`);
}

// Check email configuration
const emailFrom = process.env.EMAIL_FROM || "Lindsey <lindsey@aistudyplans.com>";
const emailReplyTo = process.env.EMAIL_REPLY_TO || "support@aistudyplans.com";
const sendEmailsInDev = process.env.SEND_EMAILS_IN_DEVELOPMENT;

console.log(`📧 EMAIL_FROM: ${emailFrom}`);
console.log(`📧 EMAIL_REPLY_TO: ${emailReplyTo}`);

if (sendEmailsInDev === "true") {
  console.log("✅ SEND_EMAILS_IN_DEVELOPMENT is enabled");
} else {
  console.log('⚠️ SEND_EMAILS_IN_DEVELOPMENT is not set to "true"');
  console.log("   Emails will not be sent in development environment");
  console.log("   Add SEND_EMAILS_IN_DEVELOPMENT=true to your .env.local file to enable");
}

// Check for APP_URL
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
console.log(`🌐 NEXT_PUBLIC_APP_URL: ${appUrl}`);

// Summary and next steps
console.log("\n📋 Summary:");
if (!resendApiKey) {
  console.log("❌ Cannot send emails: Resend API key missing");
  console.log("\n📝 Follow these steps:");
  console.log("1. Sign up at https://resend.com");
  console.log("2. Create an API key in the Resend dashboard");
  console.log("3. Add the API key to your .env.local file");
  console.log("4. Run this script again to verify the configuration");
} else if (sendEmailsInDev !== "true") {
  console.log("⚠️ Emails configured but disabled in development");
  console.log("\n📝 Next steps:");
  console.log("1. Add SEND_EMAILS_IN_DEVELOPMENT=true to your .env.local file");
  console.log("2. Restart your application server");
  console.log("3. Test sending an email with: node test-resend.js your-email@example.com");
} else {
  console.log("✅ Email configuration looks good!");
  console.log("\n📝 Next steps:");
  console.log("1. Test sending an email with: node test-resend.js your-email@example.com");
  console.log("2. If you encounter issues, check the console for error messages");
  console.log("3. Ensure your domain is properly configured in Resend for better deliverability");
}

console.log("\n📚 For more information, see the email-setup.md guide");
