/**
 * Test script for the waitlist API with a specific email address
 * 
 * Usage:
 * node test-email-specific.js
 */

require('dotenv').config({ path: '.env.local' });

// Test the waitlist function with specific email
async function testWaitlist() {
  console.log('Testing waitlist API with specific email...');
  
  try {
    // Import the function
    const waitlistFunction = require('./api/waitlist/index.js');
    
    // Create mock request with the specific email
    const req = {
      body: {
        name: 'Terence K',
        email: 'terencek81@outlook.com'
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

    // Temporarily set NODE_ENV to production to force sending to the actual email
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    console.log(`Setting NODE_ENV to '${process.env.NODE_ENV}' for testing`);
    
    // Call the function
    await waitlistFunction(mockContext, req);
    
    // Restore original NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
    
    // Log the result
    console.log('Waitlist API response:');
    console.log(JSON.parse(mockContext.res.body));
    
    if (mockContext.res.status === 200) {
      console.log('✅ Waitlist API test completed successfully');
      console.log('✅ Email sent to terencek81@outlook.com');
    } else {
      console.log('❌ Waitlist API test failed with status:', mockContext.res.status);
    }
  } catch (error) {
    console.error('❌ Error testing waitlist API:', error);
  }
}

// Run the test
testWaitlist(); 