import { FeedbackEmailProps } from './template1';

/**
 * Generate the third feedback email in the sequence
 * This email asks about current study tools and workflows
 */
export function getFeedbackEmailTemplate3({ appUrl, user, feedbackFormUrl }: FeedbackEmailProps) {
  const year = new Date().getFullYear();
  const feedbackLink = `${feedbackFormUrl}?userId=${user.id}&emailId=feedback3`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>What study tools do you currently use?</title>
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
                  <h1 style="color: #4f46e5; font-size: 24px; margin-top: 0; margin-bottom: 16px;">Tell Us About Your Current Study Tools</h1>
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    Hi ${user.name},
                  </p>
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    We're making great progress on SchedulEd and would love to learn more about your current study habits.
                  </p>
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    <strong>What study tools, apps, or methods do you currently use for planning and organizing your studies?</strong>
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
                          Understanding your current workflow will help us build integrations and improvements that matter to you:
                        </p>
                        <table cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                            <td style="background-color: #4f46e5; border-radius: 6px;">
                              <a href="${feedbackLink}" style="color: #ffffff; font-size: 16px; font-weight: 500; text-decoration: none; display: inline-block; padding: 12px 24px;">
                                Share Your Current Tools
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
                    As always, feel free to reply directly to this email with any thoughts.
                  </p>
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    Best regards,<br />
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
What study tools do you currently use?

Hi ${user.name},

We're making great progress on SchedulEd and would love to learn more about your current study habits.

What study tools, apps, or methods do you currently use for planning and organizing your studies?

Understanding your current workflow will help us build integrations and improvements that matter to you.

Share your thoughts here: ${feedbackLink}

Best regards,
The SchedulEd Team

© ${year} SchedulEd. All rights reserved.
  `;

  return {
    html,
    text,
    subject: "What study tools do you currently use?",
  };
} 