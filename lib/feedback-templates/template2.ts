import { FeedbackEmailProps } from './template1';

/**
 * Generate the second feedback email in the sequence
 * This email asks about potential pain points in current study planning
 */
export function getFeedbackEmailTemplate2({ appUrl, user, feedbackFormUrl }: FeedbackEmailProps) {
  const year = new Date().getFullYear();
  const feedbackLink = `${feedbackFormUrl}?userId=${user.id}&emailId=feedback2`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>What challenges do you face when creating study plans?</title>
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
                  <h1 style="color: #4f46e5; font-size: 24px; margin-top: 0; margin-bottom: 16px;">Help Us Solve Your Study Planning Challenges</h1>
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    Hi ${user.name},
                  </p>
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    We hope you're doing well! We're continuing to develop SchedulEd to make study planning easier and more effective.
                  </p>
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    We'd like to understand: <strong>What are the biggest challenges you face when creating and following study plans?</strong>
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
                          Your insights will help us design solutions that address real problems. Click below to share your challenges:
                        </p>
                        <table cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                            <td style="background-color: #4f46e5; border-radius: 6px;">
                              <a href="${feedbackLink}" style="color: #ffffff; font-size: 16px; font-weight: 500; text-decoration: none; display: inline-block; padding: 12px 24px;">
                                Share Your Challenges
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
What challenges do you face when creating study plans?

Hi ${user.name},

We hope you're doing well! We're continuing to develop SchedulEd to make study planning easier and more effective.

We'd like to understand: What are the biggest challenges you face when creating and following study plans?

Your insights will help us design solutions that address real problems. Click the link below to share your challenges:
${feedbackLink}

Thanks for your input,
The SchedulEd Team

© ${year} SchedulEd. All rights reserved.
  `;

  return {
    html,
    text,
    subject: "What challenges do you face when creating study plans?",
  };
} 