import { NextRequest, NextResponse } from 'next/server';
import { storeFeedback } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';

// This is required for static export in Next.js when using output: 'export'
export function generateStaticParams() {
  // Return an empty array since we don't want to pre-render this API route
  return [];
}

export async function POST(request: NextRequest) {
  // Apply rate limiting (3 feedback submissions per hour per IP)
  const rateLimitResult = rateLimit(request, { 
    limit: 3, 
    windowMs: 60 * 60 * 1000, // 1 hour
    message: "Too many feedback submissions. Please wait before trying again.",
    standardHeaders: true
  });
  
  if (rateLimitResult) {
    return rateLimitResult;
  }

  try {
    const { userId, feedbackText, feedbackType, rating, emailId } = await request.json();
    
    // Validate required fields
    if (!userId || !feedbackText || !feedbackType) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Store the feedback
    const result = await storeFeedback(
      parseInt(userId, 10),
      feedbackText,
      feedbackType,
      rating,
      emailId
    );
    
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: result.error || 'Failed to submit feedback' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 