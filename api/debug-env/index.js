// Azure Functions compatible API for debug-env
module.exports = async function (context, req) {
  context.log('Debug environment variables API called');

  // Create an environment status object with minimal information
  // that doesn't expose sensitive data
  const envStatus = {
    environment: process.env.NODE_ENV || 'unknown',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'not set',
    emailConfig: {
      fromEmailConfigured: !!process.env.EMAIL_FROM,
      fromEmailValue: process.env.EMAIL_FROM ? `${process.env.EMAIL_FROM.substring(0, 3)}...` : 'not set',
      replyToConfigured: !!process.env.EMAIL_REPLY_TO,
      replyToValue: process.env.EMAIL_REPLY_TO ? `${process.env.EMAIL_REPLY_TO.substring(0, 3)}...` : 'not set',
      resendApiKeyConfigured: !!process.env.RESEND_API_KEY,
      resendApiKeyPrefix: process.env.RESEND_API_KEY ? 
        `${process.env.RESEND_API_KEY.substring(0, 3)}...${process.env.RESEND_API_KEY.substring(process.env.RESEND_API_KEY.length - 3)}` : 
        'not set'
    },
    // Safely get headers if available
    request: {
      host: req.headers?.host || 'unknown',
      userAgent: req.headers?.['user-agent'] || 'unknown',
      referer: req.headers?.referer || 'unknown'
    },
    serverTime: new Date().toISOString(),
    vercelEnv: process.env.VERCEL_ENV || 'not set',
    nodeVersion: process.version
  };

  context.res = {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(envStatus, null, 2)
  };
}; 