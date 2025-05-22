import { NextRequest } from "next/server";

// Use standard nodejs runtime instead of edge
export const runtime = "nodejs";

// This is required for static export in Next.js when using output: 'export'
export function generateStaticParams() {
  // Return an empty array since we don't want to pre-render any API routes
  return [];
}

/**
 * A minimal API endpoint with absolutely basic response
 */
export async function GET(request: NextRequest) {
  // Simplest possible response without custom headers
  return Response.json({
    message: "Plain API working",
    timestamp: new Date().toISOString()
  });
} 