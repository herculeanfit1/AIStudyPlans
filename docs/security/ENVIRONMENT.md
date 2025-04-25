# Environment Variables

This document outlines all environment variables used in the SchedulEd application.

## Configuration Files

All environment variables should be stored in the following files (which are gitignored):

- `.env.local` - Local development environment variables
- `.env.production` - Production environment variables 
- `.env.test` - Test environment variables (if needed)

**IMPORTANT: Never commit these files to the repository!**

## Required Environment Variables

### Email Configuration (Resend API)

| Variable | Description | Example |
|----------|-------------|---------|
| `RESEND_API_KEY` | API key for Resend email service | `re_xxxxxxxxxxxx` |
| `EMAIL_FROM` | Sender email address | `SchedulEd <noreply@aistudyplans.com>` |
| `EMAIL_REPLY_TO` | Reply-to email address | `support@aistudyplans.com` |
| `SEND_EMAILS_IN_DEVELOPMENT` | Whether to send real emails in development | `true` or `false` |

### Application Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Base URL of the application | `https://aistudyplans.com` |
| `NODE_ENV` | Node.js environment | `development`, `production`, or `test` |
| `NEXT_TELEMETRY_DISABLED` | Disables Next.js telemetry | `1` |

### Azure Static Web Apps Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | API token for Azure Static Web Apps deployment | `xxxxxxxxxxxx` |

## Example Configuration

Create a `.env.example` file in the project root with the following content:

```
# Resend API Configuration
RESEND_API_KEY=your_resend_api_key_here

# Email Configuration
EMAIL_FROM=SchedulEd <noreply@aistudyplans.com>
EMAIL_REPLY_TO=support@aistudyplans.com
SEND_EMAILS_IN_DEVELOPMENT=false

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# Azure Configuration (only needed for deployment)
AZURE_STATIC_WEB_APPS_API_TOKEN=your_azure_token_here
```

## Security Best Practices

1. **Never hardcode secrets** in your application code
2. **Never commit sensitive environment files** to your repository
3. **Use different values** for different environments (development, test, production)
4. **Rotate secrets regularly**, especially in production
5. **Limit access** to production environment variables
6. **Validate environment variables** at application startup 