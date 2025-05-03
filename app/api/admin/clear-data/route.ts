import { NextResponse } from 'next/server';
import { clearAllFeedbackData } from '@/lib/admin-supabase';

// This is required for static export in Next.js when using output: 'export'
export function generateStaticParams() {
  // Return an empty array since we don't want to pre-render this API route
  return [];
}

export async function POST() {
  try {
    // Clear all feedback data
    clearAllFeedbackData();
    
    return NextResponse.json({ success: true, message: 'All feedback data cleared successfully' });
  } catch (error) {
    console.error('Error clearing feedback data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to clear feedback data' },
      { status: 500 }
    );
  }
} 