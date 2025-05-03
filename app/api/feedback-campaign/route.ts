import { NextRequest, NextResponse } from 'next/server';
import { sendFeedbackCampaignEmail } from '@/lib/email';
import { getUsersForNextFeedbackEmail, updateEmailSequencePosition } from '@/lib/supabase';

// Set max runtime for this endpoint - feedback emails may take time to send
export const maxDuration = 300; // 5 minutes in seconds

// This is required for static export in Next.js when using output: 'export'
export function generateStaticParams() {
  // Return an empty array since we don't want to pre-render this API route
  return [];
}

/**
 * API route handler for processing feedback campaign emails
 * This should be triggered by a cron job (e.g., GitHub Actions, Azure Functions timer)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authorized request using a simple API key check
    const authHeader = request.headers.get('authorization');
    const apiKey = process.env.FEEDBACK_CAMPAIGN_API_KEY;
    
    if (!apiKey) {
      console.error('FEEDBACK_CAMPAIGN_API_KEY environment variable is not set');
      return new NextResponse(
        JSON.stringify({ error: 'Campaign API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
      console.error('Unauthorized attempt to access feedback campaign API');
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get users who need to receive the next email in their feedback campaign
    const { users, error: fetchError } = await getUsersForNextFeedbackEmail();
    
    if (fetchError) {
      console.error('Error fetching users for feedback emails:', fetchError);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to fetch users' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Found ${users.length} users who need feedback campaign emails`);
    
    // Process each user
    const results = [];
    for (const user of users) {
      try {
        // Send the appropriate email for this user's sequence position
        const emailResult = await sendFeedbackCampaignEmail(user);
        
        // If email sent successfully, update the user's sequence position
        if (emailResult?.success) {
          const newPosition = (user.email_sequence_position || 1) + 1;
          const updateResult = await updateEmailSequencePosition(user.id, newPosition);
          
          if (!updateResult.success) {
            console.error(`Failed to update sequence position for user ${user.id}:`, updateResult.error);
          }
          
          results.push({
            userId: user.id,
            email: user.email,
            success: true,
            sequencePosition: user.email_sequence_position,
            messageId: emailResult.messageId
          });
        }
      } catch (userError: any) {
        console.error(`Error processing feedback email for user ${user.id}:`, userError);
        results.push({
          userId: user.id,
          email: user.email,
          success: false,
          error: userError.message || 'Unknown error'
        });
      }
    }
    
    // Return summary of operations
    return new NextResponse(
      JSON.stringify({ 
        success: true, 
        processed: users.length,
        results 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error processing feedback campaign:', error?.message || error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error?.message || 'Unknown error' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 