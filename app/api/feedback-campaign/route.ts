import { NextRequest, NextResponse } from 'next/server';
import { sendFeedbackCampaignEmail } from '@/lib/email';
import { getUsersForNextFeedbackEmail, updateEmailSequencePosition } from '@/lib/supabase';

export const maxDuration = 300;

/**
 * API route handler for processing feedback campaign emails.
 * Triggered by a cron job; authenticated via bearer token.
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const apiKey = process.env.FEEDBACK_CAMPAIGN_API_KEY;

    if (!apiKey) {
      console.error('FEEDBACK_CAMPAIGN_API_KEY environment variable is not set');
      return NextResponse.json(
        { success: false, message: 'Campaign API key not configured' },
        { status: 503 }
      );
    }

    if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { users, error: fetchError } = await getUsersForNextFeedbackEmail();

    if (fetchError) {
      console.error('Error fetching users for feedback emails:', fetchError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    const results = [];
    for (const user of users) {
      try {
        const emailResult = await sendFeedbackCampaignEmail(user);

        if (emailResult?.success) {
          const newPosition = (user.email_sequence_position || 1) + 1;
          const updateResult = await updateEmailSequencePosition(user.id, newPosition);

          if (!updateResult.success) {
            console.error(`Failed to update sequence position for user ${user.id}:`, updateResult.error);
          }

          results.push({
            userId: user.id,
            success: true,
            sequencePosition: user.email_sequence_position,
          });
        }
      } catch (userError: unknown) {
        const msg = userError instanceof Error ? userError.message : 'Unknown error';
        console.error(`Error processing feedback email for user ${user.id}:`, msg);
        results.push({
          userId: user.id,
          success: false,
          error: msg,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${users.length} users`,
      data: { processed: users.length, results },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing feedback campaign:', msg);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
