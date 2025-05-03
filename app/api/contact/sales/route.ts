import { NextResponse } from 'next/server';
import { storeContactSubmission } from '@/lib/contact';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, phone, message, usersCount, type } = body;
    
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
      company,
      phone,
      message,
      usersCount,
      type: 'sales',
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
    console.error('Error handling sales contact form:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 