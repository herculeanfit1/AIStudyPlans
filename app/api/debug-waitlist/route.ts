import { NextRequest, NextResponse } from "next/server";

// Use edge runtime like the main waitlist API
export const runtime = "edge";

// This is required for static export in Next.js when using output: 'export'
export function generateStaticParams() {
  // Return an empty array since we don't want to pre-render any API routes
  return [];
}

/**
 * Simple debug endpoint that echoes back request data and environment
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json().catch(() => ({}));
    
    // Return a simplified response with environment info
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Debug endpoint working",
        request_received: {
          name: body.name || "not provided",
          email: body.email || "not provided"
        },
        environment: {
          node_env: process.env.NODE_ENV,
          supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "present" : "missing",
          supabase_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "present" : "missing",
          resend_key: process.env.RESEND_API_KEY ? "present" : "missing",
          email_from: process.env.EMAIL_FROM || "not set",
        }
      }),
      { 
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
        }
      }
    );
  } catch (error: any) {
    // Return error information
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error",
        error_type: error.constructor.name
      }),
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
        }
      }
    );
  }
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Max-Age": "86400"
    }
  });
} 