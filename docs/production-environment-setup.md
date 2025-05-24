# Production Environment Setup Guide

This guide covers the environment variables needed for production deployment with all security features enabled.

## Required Environment Variables

### Core Application
```bash
NEXT_PUBLIC_APP_URL=https://aistudyplans.com
NEXTAUTH_URL=https://aistudyplans.com
NEXTAUTH_SECRET=your-secure-nextauth-secret-here
```

### Azure AD Authentication
```bash
AZURE_AD_CLIENT_ID=your-azure-ad-client-id
AZURE_AD_CLIENT_SECRET=your-azure-ad-client-secret
AZURE_AD_TENANT_ID=your-azure-ad-tenant-id
```

### Email Service (Resend)
```bash
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=Lindsey <lindsey@aistudyplans.com>
EMAIL_REPLY_TO=support@aistudyplans.com
```

### Database (Supabase)
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## New Security & Cost Protection Variables

### Email Usage Limits
```bash
# Daily email sending limit (default: 100)
EMAIL_DAILY_LIMIT=100

# Monthly email sending limit (default: 1000)
EMAIL_MONTHLY_LIMIT=1000

# Hourly email sending limit (default: 10)
EMAIL_HOURLY_LIMIT=10

# Maximum consecutive failures before circuit breaker activates (default: 5)
EMAIL_MAX_FAILURES=5

# Circuit breaker timeout in milliseconds (default: 300000 = 5 minutes)
EMAIL_CIRCUIT_BREAKER_TIMEOUT=300000
```

### Optional Debug/Development Settings
```bash
# Set to true to redirect all emails to delivered@resend.dev (default: false in production)
DEBUG_EMAIL=false

# Set to true to disable rate limiting (default: false in production)
DISABLE_RATE_LIMIT=false
```

## Azure Static Web App Configuration

To set these in Azure Static Web Apps:

### Method 1: Azure Portal
1. Go to Azure Portal → Your Static Web App
2. Navigate to "Configuration" in the left menu
3. Add each environment variable in the "Application settings" section

### Method 2: Azure CLI
```bash
# Set core variables
az staticwebapp appsettings set --name your-app-name --setting-names \
  "EMAIL_DAILY_LIMIT=100" \
  "EMAIL_MONTHLY_LIMIT=1000" \
  "EMAIL_HOURLY_LIMIT=10" \
  "EMAIL_MAX_FAILURES=5" \
  "EMAIL_CIRCUIT_BREAKER_TIMEOUT=300000"
```

### Method 3: GitHub Actions (Recommended)
Add to your GitHub repository secrets and reference in your workflow:

```yaml
# In .github/workflows/azure-static-web-apps.yml
env:
  EMAIL_DAILY_LIMIT: ${{ secrets.EMAIL_DAILY_LIMIT }}
  EMAIL_MONTHLY_LIMIT: ${{ secrets.EMAIL_MONTHLY_LIMIT }}
  EMAIL_HOURLY_LIMIT: ${{ secrets.EMAIL_HOURLY_LIMIT }}
  EMAIL_MAX_FAILURES: ${{ secrets.EMAIL_MAX_FAILURES }}
  EMAIL_CIRCUIT_BREAKER_TIMEOUT: ${{ secrets.EMAIL_CIRCUIT_BREAKER_TIMEOUT }}
```

## Recommended Production Values

### Conservative Limits (Recommended for Start)
```bash
EMAIL_DAILY_LIMIT=50          # 50 emails per day
EMAIL_MONTHLY_LIMIT=500       # 500 emails per month
EMAIL_HOURLY_LIMIT=5          # 5 emails per hour
EMAIL_MAX_FAILURES=3          # Circuit breaker after 3 failures
EMAIL_CIRCUIT_BREAKER_TIMEOUT=600000  # 10 minutes timeout
```

### Standard Limits
```bash
EMAIL_DAILY_LIMIT=100         # 100 emails per day
EMAIL_MONTHLY_LIMIT=1000      # 1000 emails per month
EMAIL_HOURLY_LIMIT=10         # 10 emails per hour
EMAIL_MAX_FAILURES=5          # Circuit breaker after 5 failures
EMAIL_CIRCUIT_BREAKER_TIMEOUT=300000  # 5 minutes timeout
```

### High Volume Limits (Only if needed)
```bash
EMAIL_DAILY_LIMIT=500         # 500 emails per day
EMAIL_MONTHLY_LIMIT=5000      # 5000 emails per month
EMAIL_HOURLY_LIMIT=25         # 25 emails per hour
EMAIL_MAX_FAILURES=10         # Circuit breaker after 10 failures
EMAIL_CIRCUIT_BREAKER_TIMEOUT=180000  # 3 minutes timeout
```

## Monitoring & Alerts

### Azure Billing Alerts
✅ You already have these configured

### Application Monitoring
- Monitor email usage via `/api/admin/email-usage` endpoint
- Set up alerts when usage reaches 80% of limits
- Monitor rate limiting violations in logs

### Log Monitoring
Watch for these log messages:
- `📧 Email sent. Daily: X/Y, Monthly: X/Y` - Normal usage
- `⚠️ Email usage warnings:` - Approaching limits
- `❌ Email quota exceeded:` - Limits reached
- `🚨 Email circuit breaker activated` - Too many failures

## Security Checklist

- [ ] All environment variables set in Azure Static Web App
- [ ] Email limits configured appropriately for your usage
- [ ] Azure billing alerts configured
- [ ] Admin access tested and working
- [ ] Rate limiting tested and working
- [ ] Email monitoring dashboard accessible
- [ ] Circuit breaker tested (optional)

## Testing in Production

1. **Test Rate Limiting**: Make multiple rapid requests to API endpoints
2. **Test Email Monitoring**: Send a few emails and check usage stats
3. **Test Admin Dashboard**: Access `/api/admin/email-usage` when authenticated
4. **Monitor Logs**: Watch for security and usage log messages

## Troubleshooting

### High Email Usage
- Check `/api/admin/email-usage` for current stats
- Review recent email sending patterns
- Consider lowering limits temporarily

### Circuit Breaker Activated
- Check email service status (Resend)
- Review error logs for email failures
- Reset circuit breaker via admin endpoint if needed

### Rate Limiting Issues
- Check if `DISABLE_RATE_LIMIT=true` is set (should be false in production)
- Review rate limit settings in code
- Monitor for unusual traffic patterns 