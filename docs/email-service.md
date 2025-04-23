# Email Service Documentation

SchedulEd uses [Resend](https://resend.com) as its email delivery provider. This document outlines how to use the email service in the application.

## Setup

1. Follow the instructions in [env-example.md](./env-example.md) to set up your environment variables
2. Install the required dependencies:
   ```bash
   npm install
   ```

## Available Email Functions

The application provides several email utility functions in `lib/email.ts`:

### `sendEmail()`

A generic function to send emails with Resend.

```typescript
sendEmail({
  to: 'recipient@example.com',
  subject: 'Hello from SchedulEd',
  html: '<p>This is an HTML email</p>',
  text: 'This is a plain text email'
});
```

### `sendWaitlistConfirmationEmail()`

Sends a confirmation email when a user joins the waitlist.

```typescript
sendWaitlistConfirmationEmail('user@example.com');
```

### `sendPasswordResetEmail()`

Sends a password reset email with a reset link.

```typescript
sendPasswordResetEmail('user@example.com', 'reset-token-123');
```

## Email Templates

The application uses a templating system in `lib/email-templates.ts` to generate consistent email layouts:

### Available Templates

1. **Waitlist Confirmation** - Used when users join the waitlist
2. **Password Reset** - Used for password reset requests

## API Routes

### `/api/waitlist` (POST)

Endpoint that handles waitlist submissions and sends confirmation emails.

**Request body:**
```json
{
  "email": "user@example.com"
}
```

**Success response:**
```json
{
  "success": true,
  "message": "Successfully joined the waitlist"
}
```

## Testing Emails

To test email functionality during development:

1. Set `SEND_EMAILS_IN_DEVELOPMENT=true` in your `.env.local` file
2. Use a valid Resend API key
3. Submit a form that triggers an email (e.g., the waitlist form)
4. Check the Resend dashboard to see the delivered email

## Email Design and Branding

All emails use SchedulEd branding with consistent:
- Color scheme (indigo primary color)
- Logo placement 
- Typography
- Footer information

## Adding New Email Types

To add a new type of email:

1. Create a new template function in `lib/email-templates.ts`
2. Add a new sending function in `lib/email.ts`
3. Call the function from the appropriate location in your application 