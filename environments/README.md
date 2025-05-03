# Environment Configuration

This directory contains environment-specific configuration files used in the CI/CD process.

## Environment Structure

- `development/`: Configuration for the development environment
- `staging/`: Configuration for the staging environment
- `production/`: Configuration for the production environment

## Required Environment Variables

Each environment requires the following variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Email Configuration
RESEND_API_KEY=
EMAIL_FROM=

# Application Settings
NODE_ENV=
PORT=
NEXT_PUBLIC_APP_URL=

# Feature Flags
ENABLE_FEEDBACK_CAMPAIGN=
ENABLE_WAITLIST=
```

## CI/CD Integration

These environment variables are used in the GitHub Actions workflows. Each variable needs to be set as a repository secret following this naming convention:

```
VARIABLE_NAME_ENVIRONMENT
```

For example:
- `NEXT_PUBLIC_SUPABASE_URL_DEVELOPMENT`
- `NEXT_PUBLIC_SUPABASE_URL_STAGING`
- `NEXT_PUBLIC_SUPABASE_URL_PRODUCTION`

## Local Development

For local development, copy the contents of the development template to a `.env.local` file in the project root:

```bash
cp environments/development/.env.template .env.local
```

Then update the values with your actual development credentials.

## Security Notes

- Never commit actual secrets to the repository
- Use GitHub Secrets for storing sensitive information
- Consider using a secrets management solution (Vault, AWS Secrets Manager, etc.) for production environments 