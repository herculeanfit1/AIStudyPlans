#!/usr/bin/env node

/**
 * Script to test Azure environment configuration
 * 
 * This script sends a test email using the Resend API directly,
 * which helps isolate whether issues are with the API or the environment.
 * 
 * Usage:
 *   node scripts/test-azure-env.js YOUR_RESEND_API_KEY email@example.com
 */

// Check for required arguments
if (process.argv.length < 4) {
  console.error('Usage: node scripts/test-azure-env.js YOUR_RESEND_API_KEY recipient@example.com');
  process.exit(1);
}

// Get command-line arguments
const apiKey = process.argv[2];
const toEmail = process.argv[3];

console.log('🔍 Testing direct email delivery to Azure environment');
console.log('────────────────────────────────────────────────────────');
console.log(`API Key: ${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)}`);
console.log(`To Email: ${toEmail}`);
console.log('────────────────────────────────────────────────────────');

// Direct API call to Resend without using environment variables
async function sendTestEmail() {
  console.log('📤 Sending test email via direct API call...');

  try {
    // Prepare the request
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'delivered@resend.dev',
        to: toEmail,
        subject: 'Azure Environment Test - Direct API',
        html: `
          <div style="font-family: sans-serif;">
            <h1>Azure Environment Test</h1>
            <p>This is a test email sent directly via the Resend API.</p>
            <p>If you're receiving this email, it confirms that the Resend API key is valid.</p>
            <p>Sent at: ${new Date().toISOString()}</p>
          </div>
        `,
        text: `Azure Environment Test

This is a test email sent directly via the Resend API.
If you're receiving this email, it confirms that the Resend API key is valid.

Sent at: ${new Date().toISOString()}`
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Success! Email sent directly via API');
      console.log(`📧 Email ID: ${data.id}`);
    } else {
      console.error('❌ API Error:', data.message || 'Unknown error');
      console.error('Status:', response.status);
      console.error('Details:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ Exception when sending email directly:');
    console.error(error);
  }
}

// Run the test
sendTestEmail(); 