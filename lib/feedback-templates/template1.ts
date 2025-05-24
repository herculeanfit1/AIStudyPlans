import { WaitlistUser } from '../supabase';

export type FeedbackEmailProps = {
  appUrl: string;
  user: WaitlistUser;
  feedbackFormUrl: string;
};

/**
 * Generate the first feedback email in the sequence
 * This email asks for general feedback about what they'd like to see in the product
 */
export function getFeedbackEmailTemplate1({ appUrl, user, feedbackFormUrl }: FeedbackEmailProps) {
  const year = new Date().getFullYear();
  const feedbackLink = `${feedbackFormUrl}?userId=${user.id}&emailId=feedback1`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>What features would you like to see in SchedulEd?</title>
    </head>
    <body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; color: #374151; background-color: #f9fafb;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f9fafb;">
        <tr>
          <td align="center" style="padding: 30px 0;">
            <table width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <!-- Header -->
              <tr>
                <td style="padding: 30px 30px 20px;">
                  <img src="${appUrl}/SchedulEd_new_logo.png" alt="SchedulEd Logo" style="max-width: 150px; height: auto;" />
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 0 30px;">
                  <h1 style="color: #4f46e5; font-size: 24px; margin-top: 0; margin-bottom: 16px;">Help Shape SchedulEd</h1>
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    Hi ${user.name},
                  </p>
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    Thank you for joining our waitlist for SchedulEd, your AI-powered study plan generator. 
                    We're working hard on creating the perfect tool to help students like you succeed.
                  </p>
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    As we develop SchedulEd, we'd love to know: <strong>What features would you like to see in our app?</strong>
                  </p>
                </td>
              </tr>
              
              <!-- CTA -->
              <tr>
                <td style="padding: 0 30px 30px;">
                  <table style="width: 100%; background-color: #f3f4f6; border-radius: 8px; padding: 20px;" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td>
                        <p style="color: #374151; font-size: 16px; margin-top: 0; margin-bottom: 16px;">
                          Your input will directly influence the features we build. Click the button below to share your thoughts:
                        </p>
                        <table cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                            <td style="background-color: #4f46e5; border-radius: 6px;">
                              <a href="${feedbackLink}" style="color: #ffffff; font-size: 16px; font-weight: 500; text-decoration: none; display: inline-block; padding: 12px 24px;">
                                Share Your Feature Ideas
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px; border-top: 1px solid #e5e7eb; text-align: center;">
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 16px;">
                    If you have any questions, feel free to reply to this email.
                  </p>
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    Thanks for your input,<br />
                    The SchedulEd Team
                  </p>
                  <p style="color: #9ca3af; font-size: 14px; margin-bottom: 0;">
                    © ${year} SchedulEd. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `
What features would you like to see in SchedulEd?

Hi ${user.name},

Thank you for joining our waitlist for SchedulEd, your AI-powered study plan generator. 
We're working hard on creating the perfect tool to help students like you succeed.

As we develop SchedulEd, we'd love to know: What features would you like to see in our app?

Your input will directly influence the features we build. Click the link below to share your thoughts:
${feedbackLink}

Thanks for your input,
The SchedulEd Team

© ${year} SchedulEd. All rights reserved.
  `;

  return {
    html,
    text,
    subject: "What features would you like to see in SchedulEd?",
  };
} 