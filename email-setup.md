# Email Setup Guide for SchedulEd

This guide will help you set up and test the email functionality for SchedulEd using the Resend service.

## 1. Setting Up Resend

1. Sign up for a [Resend](https://resend.com) account
2. Navigate to the API Keys section in your dashboard
3. Create a new API key
4. Copy the key

## 2. Configure Environment Variables

Create or edit the `.env.local` file in the project root:

```
# Resend Email API Configuration
RESEND_API_KEY=your_resend_api_key_here

# Email Configuration
EMAIL_FROM=notifications@aistudyplans.com
EMAIL_REPLY_TO=support@aistudyplans.com
SEND_EMAILS_IN_DEVELOPMENT=true  # Set to true to test emails locally

# Application Configuration 
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Testing Your Email Setup

### Option 1: Run the Test Script

Run the test script with your email address:

```bash
node test-resend.js your-email@example.com
```

If successful, you'll see:
- "Test email sent successfully!" message in the console
- A test email in your inbox

### Option 2: Test Via the Waitlist Form

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Open the test HTML page in your browser:
   ```
   open test-waitlist.html
   ```
   
   Or navigate to: http://localhost:3000 and use the waitlist form

3. Fill out the form with your name and email
4. Check the API response and your inbox for the confirmation email

## 4. Troubleshooting

If you encounter issues:

1. **No emails being sent:**
   - Check that your `RESEND_API_KEY` is correctly set in `.env.local`
   - Verify that `SEND_EMAILS_IN_DEVELOPMENT` is set to `true`
   - Check the console for error messages

2. **API Key Invalid:**
   - Generate a new API key in the Resend dashboard
   - Update your `.env.local` file with the new key

3. **Email Deliverability Issues:**
   - Check your spam folder
   - Verify that the domain (aistudyplans.com) is properly configured in Resend
   - Ensure your from email address uses a verified domain

## 5. Production Considerations

For production deployment:

1. Set up domain authentication in Resend for better deliverability
2. Ensure your API keys are securely stored as environment variables
3. Implement email tracking and analytics
4. Consider setting up event tracking for opens and clicks

## 6. Email Templates

The application includes templates for:
- Waitlist confirmation emails
- Password reset emails

These templates are defined in `lib/email-templates.ts` and can be customized as needed. 