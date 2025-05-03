#!/usr/bin/env node

/**
 * PA11Y Configuration Generator
 * 
 * This script generates a configuration file for pa11y-ci based on the
 * critical pages of the application. It ensures that accessibility testing
 * covers the most important user flows.
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Base URL for testing
const baseUrl = process.env.PA11Y_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// List of critical paths to test
const criticalPaths = [
  '/',                // Home page
  '/waitlist',        // Waitlist page
  '/feedback',        // Feedback form
  '/about',           // About page
  '/contact',         // Contact page
  '/pricing',         // Pricing page
  '/login',           // Login page
  '/signup'           // Signup page
];

// Generate a list of URLs to test
const urls = criticalPaths.map(path => `${baseUrl}${path}`);

// PA11Y configuration
const pa11yConfig = {
  defaults: {
    // Wait for all network activity to complete
    wait: 2000,
    // Use chromium
    chromeLaunchConfig: {
      executablePath: process.env.PA11Y_CHROMIUM_PATH || undefined
    },
    // Standard to test against
    standard: 'WCAG2AA',
    // Timeout in milliseconds
    timeout: 30000,
    // Use viewport size that works well for testing
    viewport: {
      width: 1280,
      height: 800
    },
    // Ignore these rules that are less critical or generate false positives
    ignore: [
      'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail' // Color contrast for text over images
    ],
    // Log to console
    log: {
      debug: process.env.DEBUG === 'true',
      error: console.error,
      info: console.log
    },
    // Take a screenshot when issues are found (for visual debugging)
    screenCapture: `${process.cwd()}/pa11y-screenshots/{url}`,
    // Set up custom actions before test
    actions: [
      // Example: dismiss cookie banner if present
      'try { if (document.querySelector(".cookie-banner")) { document.querySelector(".cookie-banner .accept-button").click(); } } catch (e) {}'
    ]
  },
  urls
};

// Write the configuration to a file
const configPath = path.resolve(process.cwd(), '.pa11yci.json');
fs.writeFileSync(configPath, JSON.stringify(pa11yConfig, null, 2));

console.log(`Generated PA11Y configuration at ${configPath}`);
console.log(`Testing ${urls.length} critical URLs:`);
urls.forEach(url => console.log(`  - ${url}`)); 