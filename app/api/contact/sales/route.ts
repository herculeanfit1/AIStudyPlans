import { NextRequest, NextResponse } from 'next/server';
import { storeContactSubmission } from '@/lib/contact';
import { salesContactSchema, validateInput } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const rateLimitResult = rateLimit(request, {
    limit: 5,
    windowMs: 60 * 60 * 1000,
    message: 'Too many contact submissions. Please try again later.',
    standardHeaders: true,
  });

  if (rateLimitResult) {
    return rateLimitResult;
  }

  try {
    const body = await request.json();

    const validation = validateInput(salesContactSchema, body);
    if (!validation.success) {
      const errorMessage = Object.values(validation.error || {}).join('. ');
      return NextResponse.json(
        { success: false, message: errorMessage || 'Invalid input data', errors: validation.error },
        { status: 422 }
      );
    }

    const { name, email, company, message } = validation.data!;

    const result = await storeContactSubmission({
      name,
      email,
      company,
      message,
      type: 'sales',
    });

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Contact form submitted successfully.' });
    }

    return NextResponse.json(
      { success: false, message: result.error || 'Failed to submit contact form' },
      { status: 500 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    console.error('Error handling sales contact form:', message);
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
