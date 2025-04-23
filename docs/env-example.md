# Environment Variables for SchedulEd

This document outlines the environment variables required to run the SchedulEd application.

## Setup Instructions

1. Create a `.env.local` file in the root of the project
2. Copy the variables below and set appropriate values
3. Restart the application if it's already running

```env
# SchedulEd Application - Environment Variables
# Copy these variables to your .env.local file

# ===============================================
# Resend Email API Configuration
# ===============================================
# Sign up at https://resend.com to get your API key
RESEND_API_KEY=your_resend_api_key_here

# ===============================================
# Email Configuration
# ===============================================
# The email address that will appear as the sender
EMAIL_FROM=notifications@scheduled.ai
# The email address that users can reply to
EMAIL_REPLY_TO=support@scheduled.ai
# Set to 'true' to send emails in development environment
SEND_EMAILS_IN_DEVELOPMENT=false

# ===============================================
# Application Configuration
# ===============================================
# The URL where your application is hosted
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Development, production, or test
NODE_ENV=development
```

## Obtaining Required Keys

### Resend API Key

1. Sign up for a [Resend](https://resend.com) account
2. Navigate to the API Keys section in your dashboard
3. Create a new API key
4. Copy the key into your `.env.local` file

## Development vs Production

For local development:
- Set `NEXT_PUBLIC_APP_URL` to `http://localhost:3000`
- Set `SEND_EMAILS_IN_DEVELOPMENT` to `true` if you want to test email functionality

For production:
- Set `NEXT_PUBLIC_APP_URL` to your actual domain (e.g., `https://scheduled.ai`)
- Set `NODE_ENV` to `production` 