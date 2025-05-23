#!/usr/bin/env node

/**
 * Verify Authentication Script
 * Checks that authentication configuration is properly set up
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

console.log(`${colors.cyan}${colors.bold}=== Authentication Configuration Verification ===${colors.reset}`);
console.log();

// Required environment variables for Microsoft SSO
const requiredEnvVars = {
  'NEXTAUTH_SECRET': 'Secret key for NextAuth.js session encryption',
  'NEXTAUTH_URL': 'URL where NextAuth.js is running (e.g., https://aistudyplans.com in production)',
  'AZURE_AD_CLIENT_ID': 'Microsoft Azure AD Client ID',
  'AZURE_AD_CLIENT_SECRET': 'Microsoft Azure AD Client Secret',
  'AZURE_AD_TENANT_ID': 'Microsoft Azure AD Tenant ID'
};

// Check environment variables
let envErrors = 0;
console.log(`${colors.blue}${colors.bold}1. Checking environment variables${colors.reset}`);

for (const [key, description] of Object.entries(requiredEnvVars)) {
  if (process.env[key]) {
    console.log(`${colors.green}✓ ${key}${colors.reset}: ${description}`);
  } else {
    console.log(`${colors.red}✗ ${key}${colors.reset}: ${description} ${colors.red}(MISSING)${colors.reset}`);
    envErrors++;
  }
}

console.log('\n');

// Check NextAuth configuration
console.log(`${colors.blue}${colors.bold}2. Checking NextAuth.js configuration${colors.reset}`);

const nextAuthPath = path.join(process.cwd(), 'app/api/auth/[...nextauth]/route.ts');
let nextAuthConfigExists = false;
let nextAuthErrors = 0;

try {
  if (fs.existsSync(nextAuthPath)) {
    nextAuthConfigExists = true;
    console.log(`${colors.green}✓ NextAuth.js configuration file exists${colors.reset}`);
    
    // Read the file content
    const content = fs.readFileSync(nextAuthPath, 'utf8');
    
    // Check for key configurations
    const checks = [
      { pattern: /AzureAD\(\{/i, name: 'Azure AD provider' },
      { pattern: /strategy\s*:\s*["']jwt["']/i, name: 'JWT session strategy' },
      { pattern: /isAdmin\s*[?:=]/i, name: 'Admin privilege handling' },
      { pattern: /pages\s*:\s*\{/i, name: 'Custom page routes' }
    ];
    
    for (const check of checks) {
      if (check.pattern.test(content)) {
        console.log(`${colors.green}✓${colors.reset} ${check.name} configured`);
      } else {
        console.log(`${colors.red}✗${colors.reset} ${check.name} not found in configuration`);
        nextAuthErrors++;
      }
    }
  } else {
    console.log(`${colors.red}✗ NextAuth.js configuration file not found${colors.reset}`);
    nextAuthErrors++;
  }
} catch (error) {
  console.log(`${colors.red}✗ Error checking NextAuth.js configuration: ${error.message}${colors.reset}`);
  nextAuthErrors++;
}

console.log('\n');

// Check admin login page
console.log(`${colors.blue}${colors.bold}3. Checking admin login page${colors.reset}`);
const adminLoginPath = path.join(process.cwd(), 'app/admin/login/page.tsx');
let adminLoginErrors = 0;

try {
  if (fs.existsSync(adminLoginPath)) {
    console.log(`${colors.green}✓ Admin login page exists${colors.reset}`);
    
    // Read the file content
    const content = fs.readFileSync(adminLoginPath, 'utf8');
    
    // Check for key components
    const checks = [
      { pattern: /signIn\(/i, name: 'Sign in functionality' },
      { pattern: /useSession\(/i, name: 'Session hook' },
      { pattern: /isAdmin/i, name: 'Admin privilege check' }
    ];
    
    for (const check of checks) {
      if (check.pattern.test(content)) {
        console.log(`${colors.green}✓${colors.reset} ${check.name} present`);
      } else {
        console.log(`${colors.red}✗${colors.reset} ${check.name} not found in login page`);
        adminLoginErrors++;
      }
    }
  } else {
    console.log(`${colors.red}✗ Admin login page not found${colors.reset}`);
    adminLoginErrors++;
  }
} catch (error) {
  console.log(`${colors.red}✗ Error checking admin login page: ${error.message}${colors.reset}`);
  adminLoginErrors++;
}

console.log('\n');

// Check for any conflicting/old authentication methods
console.log(`${colors.blue}${colors.bold}4. Checking for conflicting authentication methods${colors.reset}`);
const conflictingFiles = [
  { path: 'app/admin/login.html', description: 'Static HTML login page' },
  { path: 'app/admin/login.css', description: 'Static CSS for login page' },
  { path: 'app/admin/login.js', description: 'Static JS for login page' },
  { path: 'api/login.js', description: 'Old API login endpoint' },
  { path: 'api/login.ts', description: 'Old API login endpoint' },
  { path: 'pages/api/login.js', description: 'Old API login endpoint' },
  { path: 'pages/api/login.ts', description: 'Old API login endpoint' }
];

let conflictsFound = 0;

for (const file of conflictingFiles) {
  const filePath = path.join(process.cwd(), file.path);
  if (fs.existsSync(filePath)) {
    console.log(`${colors.red}✗ Found conflicting file: ${file.path}${colors.reset} - ${file.description}`);
    conflictsFound++;
  }
}

if (conflictsFound === 0) {
  console.log(`${colors.green}✓ No conflicting authentication methods found${colors.reset}`);
}

console.log('\n');

// Recommendations
console.log(`${colors.blue}${colors.bold}5. Recommendations${colors.reset}`);
const totalErrors = envErrors + nextAuthErrors + adminLoginErrors + conflictsFound;

if (totalErrors === 0) {
  console.log(`${colors.green}Authentication configuration looks good! No issues detected.${colors.reset}`);
} else {
  console.log(`${colors.yellow}Found ${totalErrors} issues with authentication configuration:${colors.reset}`);
  
  if (envErrors > 0) {
    console.log(`${colors.yellow}• Add missing environment variables${colors.reset}`);
  }
  
  if (nextAuthErrors > 0) {
    console.log(`${colors.yellow}• Fix NextAuth.js configuration${colors.reset}`);
  }
  
  if (adminLoginErrors > 0) {
    console.log(`${colors.yellow}• Update admin login page${colors.reset}`);
  }
  
  if (conflictsFound > 0) {
    console.log(`${colors.yellow}• Remove conflicting authentication methods${colors.reset}`);
  }
}

// Exit with proper code
if (totalErrors > 0) {
  process.exit(1);
} else {
  process.exit(0);
} 