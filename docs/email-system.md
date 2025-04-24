# SchedulEd Email System Documentation

This document provides an overview of the email system in SchedulEd, explaining its architecture, available templates, testing procedures, and production considerations.

## Table of Contents

1. [Architecture](#architecture)
2. [Email Templates](#email-templates)
3. [Environment Configuration](#environment-configuration)
4. [Testing the Email System](#testing-the-email-system)
5. [API Integration](#api-integration)
6. [Troubleshooting](#troubleshooting)
7. [Production Considerations](#production-considerations)

## Architecture

The email system uses [Resend](https://resend.com) as the email service provider. The architecture consists of:

- **Email Service**: Core email sending functionality in `lib/email.ts`
- **Email Templates**: HTML/text templates in `lib/email-templates.ts`
- **API Integration**: Integration with application features in various API routes
- **Testing Utilities**: Tools to verify the email system is working properly

### Key Files

- `lib/email.ts` - Core email sending functions
- `lib/email-templates.ts` - Email template definitions
- `app/api/waitlist/route.ts` - Waitlist API with email integration
- `test-resend.js` - Simple test script for the Resend API
- `email-cli.js` - Command-line utility for testing emails
- `check-email-config.js` - Configuration verification tool

## Email Templates

The system currently includes the following email templates:

1. **Waitlist Confirmation** - Sent when a user signs up for the waitlist
   - Function: `sendWaitlistConfirmationEmail(email)`
   - Template: `getWaitlistConfirmationTemplate()`

2. **Password Reset** - Sent when a user requests a password reset
   - Function: `sendPasswordResetEmail(email, resetToken)`
   - Template: `getPasswordResetTemplate()`

### Implementing New Templates

To add a new email template:

1. Create a new template function in `lib/email-templates.ts`
2. Add a sending function in `lib/email.ts`
3. Integrate the sending function with the appropriate API route or feature

Example template pattern:

```typescript
export function getNewTemplateFunction({ appUrl }: EmailTemplateProps) {
  const html = `<!-- HTML email template -->`;
  const text = `Plain text version`;
  
  return { html, text };
}
```

## Environment Configuration

The email system requires the following environment variables:

```
# Resend API Key (required)
RESEND_API_KEY=re_123456789

# Email configuration (optional, defaults provided)
EMAIL_FROM=notifications@aistudyplans.com
EMAIL_REPLY_TO=support@aistudyplans.com
SEND_EMAILS_IN_DEVELOPMENT=true

# Application URL (used in email links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Setting Up the Environment

1. Create a `.env.local` file in the project root
2. Add the required environment variables
3. Restart the application if it's already running

## Testing the Email System

### Option 1: Configuration Check

Run the configuration check utility:

```bash
node check-email-config.js
```

This will verify your environment setup and provide guidance on resolving any issues.

### Option 2: Command-Line Testing

Use the email CLI to send test emails:

```bash
# Send a test email
./email-cli.js test your-email@example.com

# Send a waitlist confirmation
./email-cli.js waitlist your-email@example.com

# Send a password reset email
./email-cli.js reset your-email@example.com some-token
```

### Option 3: API Testing

Use the test HTML page to test the waitlist API:

1. Start your Next.js server: `npm run dev`
2. Open `test-waitlist.html` in your browser
3. Fill out the form to test the API endpoint

### Option 4: Basic Resend Test

Run the basic Resend test script:

```bash
node test-resend.js your-email@example.com
```

## API Integration

### Waitlist API

The waitlist API (`app/api/waitlist/route.ts`) integrates with the email system to send confirmation emails when users join the waitlist.

Integration flow:
1. User submits their name and email
2. API validates the input
3. Email confirmation is sent if configured
4. Success response is returned

```typescript
// Example usage in an API route
import { sendWaitlistConfirmationEmail } from '@/lib/email';

// Inside API handler
await sendWaitlistConfirmationEmail(email);
```

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check that `RESEND_API_KEY` is set correctly
   - Verify that `SEND_EMAILS_IN_DEVELOPMENT` is set to `true` for local testing
   - Check console for error messages

2. **Invalid API Key**
   - Generate a new API key in the Resend dashboard
   - Update your `.env.local` file

3. **Email Deliverability**
   - Check spam folders
   - Verify domain configuration in Resend
   - Ensure your `fromEmail` uses a verified domain

### Debugging

For detailed debugging, use the `email-cli.js` utility with explicit error reporting:

```bash
./email-cli.js test your-email@example.com
```

## Production Considerations

For production deployment:

1. **Domain Authentication**
   - Set up domain authentication in Resend for better deliverability
   - Verify your sending domain

2. **Environment Variables**
   - Ensure API keys are securely stored
   - Set `NODE_ENV=production`
   - Set `NEXT_PUBLIC_APP_URL` to your actual domain

3. **Monitoring**
   - Implement logging for email sending events
   - Set up alerts for email failures

4. **Analytics**
   - Consider implementing email open and click tracking
   - Monitor delivery rates and bounces

---

For additional help, contact the development team or refer to the [Resend documentation](https://resend.com/docs). 