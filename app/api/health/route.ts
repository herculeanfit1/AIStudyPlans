// This enables edge runtime for better performance with static exports
export const runtime = "edge";

import { NextResponse } from "next/server";

/**
 * GET /api/health
 *
 * Health check endpoint compatible with Edge runtime.
 * Returns a 200 OK response with basic health information.
 */
export async function GET() {
  const healthData = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "0.1.0",
    edge: true,
  };

  return NextResponse.json(healthData, { status: 200 });
}
