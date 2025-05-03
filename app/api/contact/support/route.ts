import { NextResponse } from 'next/server';
import { storeContactSubmission } from '@/lib/contact';

// This is required for static export in Next.js when using output: 'export'
export function generateStaticParams() {
  // Return an empty array since we don't want to pre-render this API route
  return [];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, issueType } = body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Store the submission
    const result = await storeContactSubmission({
      name,
      email,
      subject,
      message,
      issueType,
      type: 'support',
    });
    
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: result.error || 'Failed to submit contact form' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error handling support contact form:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 