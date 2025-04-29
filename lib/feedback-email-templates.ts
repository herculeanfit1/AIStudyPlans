import { WaitlistUser } from './supabase';

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
                    Thanks for your insights,<br />
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

Your insights will help us design solutions that address real problems. Click below to share your challenges:
${feedbackLink}

Thanks for your insights,
The SchedulEd Team

© ${year} SchedulEd. All rights reserved.
  `;

  return {
    html,
    text,
    subject: "What challenges do you face when creating study plans?",
  };
}

/**
 * Generate the third feedback email in the sequence
 * This email asks for more detailed preferences
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
      <title>Help us design the ideal SchedulEd experience</title>
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
                  <h1 style="color: #4f46e5; font-size: 24px; margin-top: 0; margin-bottom: 16px;">Help Us Design Your Ideal Study Experience</h1>
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    Hi ${user.name},
                  </p>
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    Thanks for being part of our waitlist community! We're getting closer to launching SchedulEd and want to make sure it meets your needs.
                  </p>
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    We're curious about your preferences: <strong>What would your ideal AI-powered study planning tool look and feel like?</strong>
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
                          Your design suggestions will help us create the most user-friendly experience possible. Click below to share your vision:
                        </p>
                        <table cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                            <td style="background-color: #4f46e5; border-radius: 6px;">
                              <a href="${feedbackLink}" style="color: #ffffff; font-size: 16px; font-weight: 500; text-decoration: none; display: inline-block; padding: 12px 24px;">
                                Share Your Design Ideas
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
                    Thanks for your creativity,<br />
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
Help us design the ideal SchedulEd experience

Hi ${user.name},

Thanks for being part of our waitlist community! We're getting closer to launching SchedulEd and want to make sure it meets your needs.

We're curious about your preferences: What would your ideal AI-powered study planning tool look and feel like?

Your design suggestions will help us create the most user-friendly experience possible. Click below to share your vision:
${feedbackLink}

Thanks for your creativity,
The SchedulEd Team

© ${year} SchedulEd. All rights reserved.
  `;

  return {
    html,
    text,
    subject: "Help us design the ideal SchedulEd experience",
  };
}

/**
 * Generate the fourth and final feedback email in the sequence
 * This email asks for overall satisfaction with communications
 */
export function getFeedbackEmailTemplate4({ appUrl, user, feedbackFormUrl }: FeedbackEmailProps) {
  const year = new Date().getFullYear();
  const feedbackLink = `${feedbackFormUrl}?userId=${user.id}&emailId=feedback4`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Almost there! One last quick question</title>
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
                  <h1 style="color: #4f46e5; font-size: 24px; margin-top: 0; margin-bottom: 16px;">Almost there! One last question</h1>
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    Hi ${user.name},
                  </p>
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    We're almost ready to launch SchedulEd! Your feedback has been invaluable in shaping our product.
                  </p>
                  <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                    One final question: <strong>How satisfied are you with our communications so far, and is there anything else you'd like to tell us before launch?</strong>
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
                          This is your last chance to influence SchedulEd before our launch. Click below to share your final thoughts:
                        </p>
                        <table cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                            <td style="background-color: #4f46e5; border-radius: 6px;">
                              <a href="${feedbackLink}" style="color: #ffffff; font-size: 16px; font-weight: 500; text-decoration: none; display: inline-block; padding: 12px 24px;">
                                Share Your Final Thoughts
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
                    Thanks for being on this journey with us,<br />
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
Almost there! One last quick question

Hi ${user.name},

We're almost ready to launch SchedulEd! Your feedback has been invaluable in shaping our product.

One final question: How satisfied are you with our communications so far, and is there anything else you'd like to tell us before launch?

This is your last chance to influence SchedulEd before our launch. Click below to share your final thoughts:
${feedbackLink}

Thanks for being on this journey with us,
The SchedulEd Team

© ${year} SchedulEd. All rights reserved.
  `;

  return {
    html,
    text,
    subject: "Almost there! One last quick question",
  };
}

// Helper function to get the right template based on email sequence position
export function getFeedbackEmailTemplate(
  sequencePosition: number,
  props: FeedbackEmailProps
) {
  switch(sequencePosition) {
    case 1:
      return getFeedbackEmailTemplate1(props);
    case 2:
      return getFeedbackEmailTemplate2(props);
    case 3:
      return getFeedbackEmailTemplate3(props);
    case 4:
      return getFeedbackEmailTemplate4(props);
    default:
      return getFeedbackEmailTemplate1(props);
  }
} 