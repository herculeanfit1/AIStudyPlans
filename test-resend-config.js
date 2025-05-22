/**
 * Resend API Configuration Test
 * 
 * This script tests the Resend API connection and configuration
 * to help diagnose issues with the waitlist form.
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

async function testResendConfig() {
  console.log("🔍 Testing Resend API Configuration...\n");
  
  // Check API key
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error("❌ RESEND_API_KEY is missing in your environment");
    return;
  }
  
  // Mask the API key for security
  const maskedKey = `${resendApiKey.substring(0, 3)}...${resendApiKey.substring(resendApiKey.length - 3)}`;
  console.log(`✅ RESEND_API_KEY found: ${maskedKey}`);
  
  // Check email configuration
  const emailFrom = process.env.EMAIL_FROM || "Lindsey <lindsey@aistudyplans.com>";
  const emailReplyTo = process.env.EMAIL_REPLY_TO || "support@aistudyplans.com";
  
  console.log(`📧 EMAIL_FROM: ${emailFrom}`);
  console.log(`📧 EMAIL_REPLY_TO: ${emailReplyTo}`);
  
  // Initialize Resend client
  const resend = new Resend(resendApiKey);
  
  // Verify domain status
  console.log("\n🔍 Checking domain verification status...");
  try {
    const domains = await resend.domains.list();
    console.log("✅ Domains retrieved:", JSON.stringify(domains, null, 2));
    
    // Look for the domain used in EMAIL_FROM
    const fromDomain = emailFrom.includes('<') 
      ? emailFrom.split('<')[1].split('>')[0].split('@')[1]
      : emailFrom.split('@')[1];
    
    console.log(`🔍 Looking for domain: ${fromDomain}`);
    
    // Fix the data structure access based on the actual response
    const domainsArray = domains.data?.data || [];
    const matchingDomain = domainsArray.find(domain => 
      domain.name === fromDomain
    );
    
    if (matchingDomain) {
      console.log(`✅ Domain found: ${matchingDomain.name}`);
      console.log(`   Status: ${matchingDomain.status}`);
      
      if (matchingDomain.status !== 'verified') {
        console.error(`❌ Domain is not verified. Current status: ${matchingDomain.status}`);
        console.log("   This is likely why the waitlist form shows the configuration error.");
      }
    } else {
      console.error(`❌ Domain ${fromDomain} not found in your Resend account.`);
      console.log("   This is likely why the waitlist form shows the configuration error.");
    }
  } catch (error) {
    console.error("❌ Error checking domains:", error);
  }
  
  // Test sending a simple email
  console.log("\n🔍 Testing email sending...");
  try {
    const result = await resend.emails.send({
      from: emailFrom,
      to: "delivered@resend.dev", // Resend's test email address
      subject: "Test Email from AIStudyPlans",
      html: "<p>This is a test email to verify configuration.</p>",
      text: "This is a test email to verify configuration.",
      reply_to: emailReplyTo
    });
    
    console.log("✅ Test email sent successfully:", result);
  } catch (error) {
    console.error("❌ Error sending test email:", error);
    console.log("   Full error details:", JSON.stringify(error, null, 2));
  }
}

testResendConfig().catch(console.error); 