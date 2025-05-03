import { NextResponse } from 'next/server';
import { clearAllFeedbackData } from '@/lib/admin-supabase';

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