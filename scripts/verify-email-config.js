#!/usr/bin/env node

/**
 * Verify Email Configuration Script
 * Checks if all required email environment variables are set
 * and validates the Resend API key if available
 */

require('dotenv').config();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}=== AIStudyPlans Email Configuration Verification ===${colors.reset}`);
console.log();

// Check environment variables
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.EMAIL_FROM;
const replyToEmail = process.env.EMAIL_REPLY_TO;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Display configuration status
console.log(`${colors.blue}Email Configuration:${colors.reset}`);
console.log('───────────────────────────────────────────────────');

if (resendApiKey) {
  console.log(`${colors.green}✅ Resend API key is configured${colors.reset}`);
} else {
  console.log(`${colors.red}❌ Resend API key is missing${colors.reset}`);
  console.log(`   Set the RESEND_API_KEY environment variable`);
}

if (fromEmail) {
  console.log(`${colors.green}✅ FROM email configured: ${fromEmail}${colors.reset}`);
} else {
  console.log(`${colors.red}❌ FROM email is missing${colors.reset}`);
  console.log(`   Set the EMAIL_FROM environment variable`);
}

if (replyToEmail) {
  console.log(`${colors.green}✅ REPLY-TO email configured: ${replyToEmail}${colors.reset}`);
} else {
  console.log(`${colors.red}❌ REPLY-TO email is missing${colors.reset}`);
  console.log(`   Set the EMAIL_REPLY_TO environment variable`);
}

console.log(`${colors.green}✅ App URL configured: ${appUrl}${colors.reset}`);
console.log('───────────────────────────────────────────────────');
console.log();

// Validate Resend API key if available
if (resendApiKey) {
  (async () => {
    try {
      const { Resend } = require('resend');
      const resend = new Resend(resendApiKey);
      
      console.log(`${colors.blue}Validating Resend API key...${colors.reset}`);
      
      // Simple API call to check if the key is valid
      const { data, error } = await resend.apiKeys.list();
      
      if (error) {
        console.log(`${colors.red}❌ API Key validation failed: ${error.message}${colors.reset}`);
        process.exit(1);
      } else {
        console.log(`${colors.green}✅ Resend API key is valid${colors.reset}`);
        
        // Check the configured domain
        const domains = await resend.domains.list();
        if (domains.data && domains.data.length > 0) {
          console.log(`${colors.green}✅ Domains configured: ${domains.data.map(d => d.name).join(', ')}${colors.reset}`);
        } else {
          console.log(`${colors.yellow}⚠️  No domains configured with Resend${colors.reset}`);
        }
        
        console.log(`${colors.green}✅ Email configuration is complete and valid${colors.reset}`);
      }
    } catch (error) {
      console.log(`${colors.red}❌ Error validating API key: ${error.message}${colors.reset}`);
      process.exit(1);
    }
  })();
} else {
  console.log(`${colors.red}❌ Email configuration is incomplete${colors.reset}`);
  console.log(`${colors.yellow}ℹ️  Set up the required environment variables to enable email functionality${colors.reset}`);
  process.exit(1);
} 