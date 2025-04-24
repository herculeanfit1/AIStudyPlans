# AIStudyPlans Email Service Documentation

This document provides detailed information about the email service implementation in AIStudyPlans (SchedulEd) application, including configuration, templates, and utility functions.

## Overview

The AIStudyPlans application uses the [Resend](https://resend.com) service for sending transactional emails. The email functionality is implemented in the `lib/email.ts` and `lib/email-templates.ts` files, providing reusable components for sending various types of emails.

## Configuration

### Environment Variables

The email service requires the following environment variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RESEND_API_KEY` | Yes | - | API key for the Resend service |
| `EMAIL_FROM` | No | `Lindsey <lindsey@aistudyplans.com>` | From address for all emails |
| `EMAIL_REPLY_TO` | No | `support@aistudyplans.com` | Reply-to address for all emails |
| `NEXT_PUBLIC_APP_URL` | No | `http://localhost:3000` | Base URL of the application |

### Domain Verification

For proper email delivery and to avoid spam filters, you need to verify the domain with Resend:

1. Go to https://resend.com/domains
2. Add `aistudyplans.com` as the domain
3. Follow the DNS verification steps provided by Resend
4. Update the `EMAIL_FROM` environment variable after verification

## Email Service Functions

The email service (`lib/email.ts`) provides the following functions:

### sendEmail

The core function that handles sending emails via Resend.

```typescript
async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) => Promise<{ success: boolean; messageId?: string }>
```

**Parameters:**
- `to`: Recipient email address
- `subject`: Email subject line
- `html`: HTML content of the email
- `text`: Plain text version of the email (for clients that don't support HTML)

**Returns:**
- A promise that resolves to an object containing `success` (boolean) and `messageId` (string, optional)

**Throws:**
- Error if Resend client is not initialized
- Error if there's an issue with sending the email

### sendWaitlistConfirmationEmail

Sends a welcome email to users who join the waitlist.

```typescript
async function sendWaitlistConfirmationEmail(email: string) => Promise<{ success: boolean; messageId?: string }>
```

**Parameters:**
- `email`: The recipient's email address

**Returns:**
- A promise that resolves to the same object as `sendEmail`

### sendPasswordResetEmail

Sends a password reset email with a token link.

```typescript
async function sendPasswordResetEmail(email: string, resetToken: string) => Promise<{ success: boolean; messageId?: string }>
```

**Parameters:**
- `email`: The recipient's email address
- `resetToken`: The password reset token to include in the email

**Returns:**
- A promise that resolves to the same object as `sendEmail`

## Email Templates

Email templates are defined in `lib/email-templates.ts` and provide both HTML and plain text versions of each email type.

### Available Templates

#### Waitlist Confirmation Template

```typescript
function getWaitlistConfirmationTemplate({ appUrl }: EmailTemplateProps) => { html: string; text: string }
```

**HTML Features:**
- Responsive design for various email clients
- SchedulEd logo
- Welcome message with details about the waitlist
- Call-to-action button to explore the dashboard demo
- Footer with contact information and copyright

**Plain Text Features:**
- Simple text version with the same content
- URLs included in plain text format
- Proper spacing for readability

#### Password Reset Template

```typescript
function getPasswordResetTemplate({ appUrl, resetToken }: EmailTemplateProps & { resetToken: string }) => { html: string; text: string }
```

**HTML Features:**
- Responsive design for various email clients
- SchedulEd logo
- Reset password instructions
- Secure reset password button and fallback link
- Security notice with token expiration information
- Footer with contact information and copyright

**Plain Text Features:**
- Simple text version with the same content
- Reset URL included in plain text format
- Security information about token expiration

## Testing Email Functionality

### Test Scripts

The repository includes testing utilities for email functionality:

1. **test-resend.js**: Tests the basic Resend connectivity
   ```bash
   node test-resend.js your-test-email@example.com
   ```

2. **check-email-config.js**: Verifies the email configuration
   ```bash
   node check-email-config.js
   ```

3. **email-cli.js**: Command-line interface for sending test emails
   ```bash
   node email-cli.js send-test your-test-email@example.com
   ```

### Test HTML Page

The repository also includes a `test-waitlist.html` file that can be used to test the waitlist API endpoint and the associated email functionality:

1. Open `test-waitlist.html` in a browser
2. Fill in the name and email fields
3. Submit the form to test the API endpoint and email delivery

## Integration in API Routes

The email service is integrated into the API routes as follows:

### Waitlist API (`app/api/waitlist/route.ts`)

```typescript
import { sendWaitlistConfirmationEmail } from '@/lib/email';

// Within the POST handler:
try {
  console.log('Sending waitlist confirmation email...');
  const result = await sendWaitlistConfirmationEmail(email);
  console.log('Email sent successfully, ID:', result?.messageId);
} catch (emailError: any) {
  console.error('Error sending waitlist confirmation email:', emailError?.message || emailError);
  // Note: We don't fail the API call if email sending fails
  // The user is still added to the waitlist
}
```

## Best Practices

1. **Error Handling**: Always wrap email sending in try/catch blocks
2. **Fallbacks**: Provide plain text alternatives for all HTML emails
3. **Testing**: Use the provided test scripts to verify email functionality
4. **Environment Variables**: Keep the Resend API key secure and never commit it to the repository
5. **Domain Verification**: Complete the domain verification process for optimal deliverability

## Future Enhancements

1. **Email Templates**: Add more templates for future email types
2. **Template Engine**: Implement a more flexible template engine
3. **HTML to Text Conversion**: Automate the generation of text versions from HTML
4. **Tracking**: Implement email open and click tracking
5. **Attachments**: Add support for email attachments 