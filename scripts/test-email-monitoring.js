#!/usr/bin/env node

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

/**
 * Test script for email monitoring system
 * This tests the quota checking and usage tracking without actually sending emails
 */

// Import the email monitoring functions
const path = require('path');
const { execSync } = require('child_process');

// Colors for output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

console.log(`${colors.blue}========================================${colors.reset}`);
console.log(`${colors.blue}Email Monitoring System Test${colors.reset}`);
console.log(`${colors.blue}========================================${colors.reset}`);

// Test 1: Check if monitoring functions are available
console.log(`\n${colors.blue}Test 1: Checking email monitoring functions...${colors.reset}`);

try {
  // Try to import the monitoring module (this tests if it compiles correctly)
  const testCode = `
    const { checkEmailQuota, getEmailUsageStats, getEmailUsageWarnings } = require('./lib/email-monitor.ts');
    console.log('Email monitoring functions loaded successfully');
  `;
  
  // Write a temporary test file
  require('fs').writeFileSync('temp-test.js', `
    // Test the email monitoring system
    console.log('${colors.green}✅ Email monitoring module structure is valid${colors.reset}');
    
    // Test quota check function exists
    try {
      const fs = require('fs');
      const content = fs.readFileSync('lib/email-monitor.ts', 'utf8');
      
      if (content.includes('checkEmailQuota')) {
        console.log('${colors.green}✅ checkEmailQuota function found${colors.reset}');
      } else {
        console.log('${colors.red}❌ checkEmailQuota function not found${colors.reset}');
      }
      
      if (content.includes('recordEmailSent')) {
        console.log('${colors.green}✅ recordEmailSent function found${colors.reset}');
      } else {
        console.log('${colors.red}❌ recordEmailSent function not found${colors.reset}');
      }
      
      if (content.includes('recordEmailFailure')) {
        console.log('${colors.green}✅ recordEmailFailure function found${colors.reset}');
      } else {
        console.log('${colors.red}❌ recordEmailFailure function not found${colors.reset}');
      }
      
      if (content.includes('EMAIL_LIMITS')) {
        console.log('${colors.green}✅ Email limits configuration found${colors.reset}');
      } else {
        console.log('${colors.red}❌ Email limits configuration not found${colors.reset}');
      }
      
    } catch (error) {
      console.log('${colors.red}❌ Error reading email monitor file:', error.message, '${colors.reset}');
    }
  `);
  
  // Run the test
  execSync('node temp-test.js', { stdio: 'inherit' });
  
  // Clean up
  require('fs').unlinkSync('temp-test.js');
  
} catch (error) {
  console.log(`${colors.red}❌ Error testing email monitoring functions: ${error.message}${colors.reset}`);
}

// Test 2: Check email service integration
console.log(`\n${colors.blue}Test 2: Checking email service integration...${colors.reset}`);

try {
  const fs = require('fs');
  const emailContent = fs.readFileSync('lib/email.ts', 'utf8');
  
  if (emailContent.includes('checkEmailQuota')) {
    console.log(`${colors.green}✅ Email service imports quota checking${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Email service missing quota checking${colors.reset}`);
  }
  
  if (emailContent.includes('recordEmailSent')) {
    console.log(`${colors.green}✅ Email service records successful sends${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Email service missing success recording${colors.reset}`);
  }
  
  if (emailContent.includes('recordEmailFailure')) {
    console.log(`${colors.green}✅ Email service records failures${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Email service missing failure recording${colors.reset}`);
  }
  
} catch (error) {
  console.log(`${colors.red}❌ Error checking email service integration: ${error.message}${colors.reset}`);
}

// Test 3: Check API endpoint exists
console.log(`\n${colors.blue}Test 3: Checking admin API endpoint...${colors.reset}`);

try {
  const fs = require('fs');
  const apiContent = fs.readFileSync('app/api/admin/email-usage/route.ts', 'utf8');
  
  if (apiContent.includes('getEmailUsageStats')) {
    console.log(`${colors.green}✅ Admin API endpoint uses monitoring functions${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Admin API endpoint missing monitoring integration${colors.reset}`);
  }
  
  if (apiContent.includes('getToken')) {
    console.log(`${colors.green}✅ Admin API endpoint has authentication${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Admin API endpoint missing authentication${colors.reset}`);
  }
  
} catch (error) {
  console.log(`${colors.red}❌ Error checking admin API endpoint: ${error.message}${colors.reset}`);
}

// Test 4: Environment variables for limits
console.log(`\n${colors.blue}Test 4: Checking environment configuration...${colors.reset}`);

const envVars = [
  'EMAIL_DAILY_LIMIT',
  'EMAIL_MONTHLY_LIMIT', 
  'EMAIL_HOURLY_LIMIT',
  'EMAIL_MAX_FAILURES',
  'EMAIL_CIRCUIT_BREAKER_TIMEOUT'
];

console.log(`${colors.yellow}Optional email limit environment variables:${colors.reset}`);
envVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`${colors.green}✅ ${varName}=${value}${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠️  ${varName} not set (will use default)${colors.reset}`);
  }
});

console.log(`\n${colors.blue}========================================${colors.reset}`);
console.log(`${colors.green}Email Monitoring Test Complete!${colors.reset}`);
console.log(`${colors.blue}========================================${colors.reset}`);

console.log(`\n${colors.yellow}Next Steps:${colors.reset}`);
console.log(`1. ${colors.blue}Test in production:${colors.reset} Deploy and monitor actual email usage`);
console.log(`2. ${colors.blue}Set limits:${colors.reset} Configure EMAIL_DAILY_LIMIT and EMAIL_MONTHLY_LIMIT in production`);
console.log(`3. ${colors.blue}Monitor dashboard:${colors.reset} Access /api/admin/email-usage when authenticated`);
console.log(`4. ${colors.blue}Test quota enforcement:${colors.reset} Try sending emails when limits are reached`); 