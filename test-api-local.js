/**
 * Test script for the Azure Functions API locally
 * 
 * Usage:
 * node test-api-local.js
 */

require('dotenv').config({ path: '.env.local' });

// Test the debug-env function
async function testDebugEnv() {
  console.log('Testing debug-env API...');
  
  try {
    // Import the function
    const debugEnvFunction = require('./api/debug-env/index.js');
    
    // Create mock request
    const req = {
      headers: {
        host: 'localhost',
        'user-agent': 'test-script',
        referer: 'test'
      }
    };
    
    // Mock context with response capture
    const mockContext = {
      log: console.log,
      res: {}
    };
    
    // Call the function
    await debugEnvFunction(mockContext, req);
    
    // Log the result
    console.log('Debug-env API response:');
    console.log(JSON.parse(mockContext.res.body));
    console.log('✅ Debug-env API test completed successfully');
  } catch (error) {
    console.error('❌ Error testing debug-env API:', error);
  }
}

// Test the waitlist function
async function testWaitlist() {
  console.log('\nTesting waitlist API...');
  
  try {
    // Import the function
    const waitlistFunction = require('./api/waitlist/index.js');
    
    // Create mock request
    const req = {
      body: {
        name: 'Test User',
        email: 'delivered@resend.dev'
      },
      headers: {
        host: 'localhost',
        'user-agent': 'test-script',
        referer: 'test'
      }
    };
    
    // Mock context with response capture
    const mockContext = {
      log: console.log,
      res: {}
    };
    
    // Call the function
    await waitlistFunction(mockContext, req);
    
    // Log the result
    console.log('Waitlist API response:');
    console.log(JSON.parse(mockContext.res.body));
    
    if (mockContext.res.status === 200) {
      console.log('✅ Waitlist API test completed successfully');
    } else {
      console.log('❌ Waitlist API test failed with status:', mockContext.res.status);
    }
  } catch (error) {
    console.error('❌ Error testing waitlist API:', error);
  }
}

// Run the tests
async function runTests() {
  await testDebugEnv();
  await testWaitlist();
}

runTests(); 