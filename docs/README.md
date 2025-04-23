# SchedulEd Documentation

This directory contains documentation for the SchedulEd application.

## Table of Contents

- [Environment Variables](./env-example.md) - Configuration settings for the application
- [Email Service](./email-service.md) - Documentation for the email service using Resend

## Setup Instructions

To set up the SchedulEd application:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables from [env-example.md](./env-example.md) to a `.env.local` file
4. Start the development server:
   ```bash
   npm run dev
   ```

## Resend Email Service

SchedulEd uses Resend for sending emails. To set up:

1. Sign up for a [Resend](https://resend.com) account
2. Create an API key
3. Add the API key to your `.env.local` file
4. See [email-service.md](./email-service.md) for more details on using the email service

## Application Structure

The application uses Next.js 14 with the App Router:

- `app/` - Next.js App Router pages and API routes
- `components/` - Reusable React components
- `lib/` - Utility functions and services
- `public/` - Static assets

## Email Templates

The email templates are defined in `lib/email-templates.ts`. They include:

1. Waitlist confirmation emails
2. Password reset emails

See [email-service.md](./email-service.md) for more details. 