import { NextResponse } from 'next/server';

export async function GET() {
  // Don't include actual secrets in response
  const azureAdConfig = {
    clientId: process.env.AZURE_AD_CLIENT_ID ? 'configured' : 'missing',
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET ? 'configured' : 'missing',
    tenantId: process.env.AZURE_AD_TENANT_ID ? 'configured' : 'missing'
  };
  
  const nextAuthConfig = {
    url: process.env.NEXTAUTH_URL,
    secret: process.env.NEXTAUTH_SECRET ? 'configured' : 'missing'
  };
  
  // Check if the allowed admin email is configured
  const allowedEmails = ["btaiadmin@bridgingtrustai.onmicrosoft.com"];
  
  return NextResponse.json({
    azureAd: azureAdConfig,
    nextAuth: nextAuthConfig,
    allowedEmails,
    nodeEnv: process.env.NODE_ENV,
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
    nextAuthUrlMatches: process.env.NEXTAUTH_URL === process.env.NEXT_PUBLIC_APP_URL,
    nowTimestamp: new Date().toISOString(),
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}

export function generateStaticParams() {
  return [];
} 