# Scripts

This directory contains utility scripts for the AIStudyPlans project.

## Email Testing Utility

The `email-test.js` script is a consolidated utility for testing email functionality with various templates.

### Usage

```bash
# Test a simple notification email
node scripts/email-test.js simple [recipient@example.com]

# Test a waitlist confirmation email
node scripts/email-test.js waitlist [recipient@example.com]

# Test a feedback request email
node scripts/email-test.js feedback [recipient@example.com]

# Test all email templates at once
node scripts/email-test.js all [recipient@example.com]
```

If no recipient is provided, the test email will be sent to `delivered@resend.dev` (Resend's test email address).

### Requirements

- A `.env.local` file with the following variables:
  - `RESEND_API_KEY`: Your Resend API key
  - `EMAIL_FROM`: The sender email address (e.g., `AIStudyPlans <noreply@aistudyplans.com>`)
  - `EMAIL_REPLY_TO`: The reply-to email address (e.g., `support@aistudyplans.com`)

## Cleanup Script

The `cleanup-duplicates.sh` script removes duplicate configuration files after consolidation.

### Usage

```bash
# Run the cleanup script
./scripts/cleanup-duplicates.sh
```

This script removes the following duplicate files:
- `next.config.js` and `next.config.ts` (keeping `next.config.mjs`)
- `postcss.config.js` (keeping `postcss.config.mjs`)
- `tailwind.config.js` (keeping `tailwind.config.ts`)
- All duplicate email testing scripts (consolidated into `scripts/email-test.js`) 