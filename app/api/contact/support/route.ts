import { NextRequest, NextResponse } from 'next/server';
import { storeContactSubmission } from '@/lib/contact';
import { supportContactSchema, validateInput } from '@/lib/validation';
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

    const validation = validateInput(supportContactSchema, body);
    if (!validation.success) {
      const errorMessage = Object.values(validation.error || {}).join('. ');
      return NextResponse.json(
        { success: false, message: errorMessage || 'Invalid input data', errors: validation.error },
        { status: 422 }
      );
    }

    const { name, email, subject, message, issueType } = validation.data!;

    const result = await storeContactSubmission({
      name,
      email,
      subject,
      message,
      issueType,
      type: 'support',
    });

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Support request submitted successfully.' });
    }

    return NextResponse.json(
      { success: false, message: result.error || 'Failed to submit contact form' },
      { status: 500 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    console.error('Error handling support contact form:', message);
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
