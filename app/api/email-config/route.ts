/**
 * API endpoint to check email configuration status
 * Returns whether Resend API key and email addresses are configured
 * Does not return any sensitive values, just boolean status
 */
export async function GET() {
  try {
    // Check if key environment variables are set
    const resendApiKeyConfigured = !!process.env.RESEND_API_KEY;
    const emailFromConfigured = !!process.env.EMAIL_FROM;
    const emailReplyToConfigured = !!process.env.EMAIL_REPLY_TO;
    
    // Check all required email configuration
    const isFullyConfigured = resendApiKeyConfigured && emailFromConfigured && emailReplyToConfigured;
    
    // Include additional debugging information for troubleshooting
    const debugInfo = process.env.NODE_ENV === 'development' ? {
      environment: process.env.NODE_ENV,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      allVariablesPresent: isFullyConfigured,
      supabaseConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    } : undefined;
    
    // Create response data
    const responseData = {
      configured: isFullyConfigured,
      resendApiKey: resendApiKeyConfigured,
      emailFrom: emailFromConfigured,
      emailReplyTo: emailReplyToConfigured,
      // For client consumption
      nextPublicResendConfigured: isFullyConfigured ? "true" : "false",
      // Debugging info
      debug: debugInfo,
    };
    
    // Return properly formatted JSON response with CORS headers
    return createJsonResponse(responseData);
  } catch (error) {
    console.error("Error in email-config API:", error);
    return createJsonResponse({ 
      error: "Error checking email configuration",
      configured: false
    }, 500);
  }
}

/**
 * Required for static export compatibility
 * This generates static paths for the API route
 */
export function generateStaticParams() {
  return [];
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Max-Age": "86400",
      "Cache-Control": "no-store, max-age=0"
    }
  });
} 

/**
 * Helper function to create a JSON Response with proper headers
 * This ensures all responses are consistently formatted
 */
function createJsonResponse(data: any, status: number = 200) {
  // Make sure to wrap the response in a try-catch to ensure a proper response
  try {
    const jsonString = JSON.stringify(data);
    return new Response(jsonString, { 
      status, 
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
      } 
    });
  } catch (jsonError) {
    console.error("Error creating JSON response:", jsonError);
    // If JSON stringification fails for any reason, create a basic error response
    return new Response(JSON.stringify({ 
      error: "Error processing response",
      success: false
    }), { 
      status: 500, 
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      } 
    });
  }
} 