import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { rateLimit } from '@/lib/rate-limit';

// Use nodejs runtime for Azure Static Web Apps
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const rateLimitResult = rateLimit(request, {
    limit: 30,
    windowMs: 60 * 60 * 1000,
    message: 'Too many CSRF token requests. Please try again later.',
    standardHeaders: true,
  });

  if (rateLimitResult) {
    return rateLimitResult;
  }

  try {
    const token = crypto.randomUUID();

    return NextResponse.json({
      success: true,
      csrfToken: token,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate CSRF token';
    console.error('Error generating CSRF token:', message);
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
