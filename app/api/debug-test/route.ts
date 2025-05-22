import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * A very simple API endpoint that doesn't rely on any external services
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "API is working correctly",
    timestamp: new Date().toISOString(),
    headers: Object.fromEntries([...request.headers.entries()]),
    url: request.url,
    method: request.method,
  }, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400"
    }
  });
} 