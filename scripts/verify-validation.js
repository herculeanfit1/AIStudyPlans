#!/usr/bin/env node

/**
 * Verify Validation Script
 * Tests that our validation logic is working correctly
 * Since we can't directly import TypeScript modules, we'll implement inline tests
 */

require('dotenv').config();
const { z } = require('zod');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

console.log(`${colors.cyan}=== Validation Schema Verification ===${colors.reset}`);
console.log();

// Create a copy of the schema as defined in lib/validation.ts
const waitlistSchema = z.object({
  name: z.string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" })
    .trim(),
  email: z.string()
    .min(1, { message: "Email is required" })
    .max(255, { message: "Email must be less than 255 characters" })
    .email({ message: "Please enter a valid email address" })
    .trim()
    .toLowerCase(),
  source: z.string()
    .max(100, { message: "Source must be less than 100 characters" })
    .optional()
    .default("website")
    .transform(val => val || "website")
});

// Test cases for waitlist schema
const waitlistTests = [
  {
    name: 'Valid data',
    data: { name: 'Test User', email: 'test@example.com', source: 'script' },
    expectedResult: true
  },
  {
    name: 'Missing name',
    data: { email: 'test@example.com', source: 'script' },
    expectedResult: false
  },
  {
    name: 'Empty name',
    data: { name: '', email: 'test@example.com', source: 'script' },
    expectedResult: false
  },
  {
    name: 'Missing email',
    data: { name: 'Test User', source: 'script' },
    expectedResult: false
  },
  {
    name: 'Invalid email - no @',
    data: { name: 'Test User', email: 'testexample.com', source: 'script' },
    expectedResult: false
  },
  {
    name: 'Invalid email - no domain',
    data: { name: 'Test User', email: 'test@', source: 'script' },
    expectedResult: false
  },
  {
    name: 'Invalid email - spaces',
    data: { name: 'Test User', email: 'test @example.com', source: 'script' },
    expectedResult: false
  }
];

// Run test cases
console.log(`${colors.blue}Testing Waitlist Schema:${colors.reset}`);
console.log('──────────────────────────');

let passedTests = 0;
let failedTests = 0;

for (const test of waitlistTests) {
  try {
    const result = waitlistSchema.safeParse(test.data);
    const success = result.success;
    
    if (success === test.expectedResult) {
      console.log(`${colors.green}✓${colors.reset} ${test.name}`);
      if (success && result.data) {
        console.log(`  ${colors.cyan}Parsed:${colors.reset} ${JSON.stringify(result.data)}`);
      } else if (!success) {
        console.log(`  ${colors.yellow}Expected failure. Errors:${colors.reset}`);
        console.log(`  ${JSON.stringify(result.error.format())}`);
      }
      passedTests++;
    } else {
      console.log(`${colors.red}✗${colors.reset} ${test.name}`);
      console.log(`  ${colors.red}Expected: ${test.expectedResult}, Got: ${success}${colors.reset}`);
      if (!success) {
        console.log(`  ${colors.red}Errors:${colors.reset} ${JSON.stringify(result.error.format())}`);
      }
      failedTests++;
    }
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${test.name}`);
    console.log(`  ${colors.red}Unexpected error: ${error.message}${colors.reset}`);
    failedTests++;
  }
  console.log();
}

// Summary
console.log('──────────────────────────');
console.log(`${colors.cyan}Summary:${colors.reset}`);
console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
console.log();

// Exit with proper code
if (failedTests > 0) {
  console.log(`${colors.red}Validation verification failed. Please fix the issues.${colors.reset}`);
  process.exit(1);
} else {
  console.log(`${colors.green}All validation tests passed!${colors.reset}`);
  process.exit(0);
} 