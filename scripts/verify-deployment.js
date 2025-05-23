#!/usr/bin/env node

/**
 * Verify Deployment Script
 * Tests that our deployed application is working correctly
 * by making HTTP requests to key endpoints
 */

require('dotenv').config();
const https = require('https');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}=== Deployment Verification ===${colors.reset}`);
console.log();

// Helper function to make HTTP requests
function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        'User-Agent': 'AIStudyPlans-Deployment-Verifier/1.0',
      }
    };

    if (data) {
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
    }

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        let parsedData;
        try {
          parsedData = responseData ? JSON.parse(responseData) : {};
        } catch (e) {
          parsedData = { rawResponse: responseData };
        }

        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsedData,
          raw: responseData
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Function to run tests
async function runTests() {
  // Get the site URL from environment or use production URL
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://aistudyplans.com';
  console.log(`${colors.blue}Testing deployed site: ${siteUrl}${colors.reset}`);
  
  let passCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  try {
    // Test 1: Check if the main page loads
    console.log(`\n${colors.blue}Test 1: Main page${colors.reset}`);
    console.log(`GET ${siteUrl}`);
    try {
      const mainPageResponse = await makeRequest(siteUrl);
      if (mainPageResponse.statusCode >= 200 && mainPageResponse.statusCode < 300) {
        console.log(`${colors.green}✓ Main page loaded successfully (${mainPageResponse.statusCode})${colors.reset}`);
        passCount++;
      } else {
        console.log(`${colors.red}✗ Main page failed with status code ${mainPageResponse.statusCode}${colors.reset}`);
        failCount++;
      }
    } catch (error) {
      console.log(`${colors.red}✗ Error accessing main page: ${error.message}${colors.reset}`);
      failCount++;
    }

    // Test 2: Check if the email config API returns
    console.log(`\n${colors.blue}Test 2: Email configuration API${colors.reset}`);
    console.log(`GET ${siteUrl}/api/email-config`);
    try {
      const emailConfigResponse = await makeRequest(`${siteUrl}/api/email-config`);
      console.log(`Status code: ${emailConfigResponse.statusCode}`);
      
      if (emailConfigResponse.statusCode >= 200 && emailConfigResponse.statusCode < 300) {
        console.log(`${colors.green}✓ Email config API responded successfully${colors.reset}`);
        console.log(`Response data: ${JSON.stringify(emailConfigResponse.data, null, 2)}`);
        passCount++;
      } else {
        console.log(`${colors.red}✗ Email config API failed with status code ${emailConfigResponse.statusCode}${colors.reset}`);
        failCount++;
      }
    } catch (error) {
      console.log(`${colors.red}✗ Error accessing email config API: ${error.message}${colors.reset}`);
      failCount++;
    }

    // Test 3: Try email validation with an invalid input
    console.log(`\n${colors.blue}Test 3: Validation with invalid input${colors.reset}`);
    const invalidData = { 
      name: 'Test User', 
      email: 'invalid-email' 
    };
    console.log(`POST ${siteUrl}/api/waitlist`);
    console.log(`Data: ${JSON.stringify(invalidData)}`);
    
    try {
      const validationResponse = await makeRequest(
        `${siteUrl}/api/waitlist`, 
        'POST', 
        invalidData
      );
      
      console.log(`Status code: ${validationResponse.statusCode}`);
      
      if (validationResponse.statusCode === 400) {
        console.log(`${colors.green}✓ Validation correctly rejected invalid email${colors.reset}`);
        console.log(`Error message: ${validationResponse.data.error || 'No specific error message'}`);
        passCount++;
      } else {
        console.log(`${colors.red}✗ Validation test failed - expected 400 status code, got ${validationResponse.statusCode}${colors.reset}`);
        failCount++;
      }
    } catch (error) {
      console.log(`${colors.red}✗ Error testing validation: ${error.message}${colors.reset}`);
      failCount++;
    }

    // Results
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log(`\n${colors.cyan}=== Test Results ===${colors.reset}`);
    console.log(`Tests run: ${passCount + failCount}`);
    console.log(`${colors.green}Passed: ${passCount}${colors.reset}`);
    console.log(`${colors.red}Failed: ${failCount}${colors.reset}`);
    console.log(`Duration: ${duration.toFixed(2)} seconds`);

    // Exit with appropriate code
    if (failCount > 0) {
      console.log(`\n${colors.red}Deployment verification failed. Please check the errors above.${colors.reset}`);
      process.exit(1);
    } else {
      console.log(`\n${colors.green}All tests passed! Deployment is working correctly.${colors.reset}`);
      process.exit(0);
    }
    
  } catch (error) {
    console.log(`\n${colors.red}Fatal error during tests: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run the tests
runTests(); 