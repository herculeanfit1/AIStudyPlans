# AIStudyPlans Production Deployment Checklist

This checklist ensures all necessary steps are completed for a successful production deployment.

## Pre-Deployment Tasks

### Environment Configuration
- [ ] Verify all required secrets exist in Azure Key Vault (see key-vault-checklist.md)
- [ ] Create or update `.env.production` using the template from `env-production-template.txt`
  - You can run `./scripts/create-env-production.sh` to automate this
- [ ] Test environment variable loading with a local production build

### Database Setup
- [ ] Create and configure Supabase tables (see supabase-setup.md)
- [ ] Set up Row Level Security policies
- [ ] Run test queries to verify database access
- [ ] Back up any existing production data

### Authentication Setup
- [ ] Configure Azure AD application for authentication
- [ ] Add all admin email addresses to the `admin-emails` secret
- [ ] Test admin login locally with production configuration

### Application Build
- [ ] Run `npm run build` and resolve any build errors
- [ ] Test the production build locally with `npm run start`
- [ ] Verify all features work in the production build

## Deployment Process

### Infrastructure Setup
- [ ] Provision Azure resources (App Service, Key Vault connections)
- [ ] Configure custom domain and SSL certificate
- [ ] Set up Azure CDN for static assets (optional)

### Application Deployment
- [ ] Deploy the application code to Azure App Service
- [ ] Configure environment variables on Azure App Service
- [ ] Verify Key Vault references are working properly

### Post-Deployment Verification
- [ ] Test all user flows in the production environment
- [ ] Verify admin dashboard accessibility
- [ ] Check that emails are sending correctly
- [ ] Validate database connections and queries
- [ ] Test the waitlist and feedback forms

## Monitoring Setup
- [ ] Set up Application Insights for error logging
- [ ] Configure alerts for critical errors
- [ ] Set up performance monitoring dashboards
- [ ] Verify logs are being captured correctly

## Rollback Plan
- [ ] Document rollback procedure
- [ ] Create backup of the current production deployment
- [ ] Test rollback process in a staging environment

## Security Checks
- [ ] Run security scan on production deployment
- [ ] Verify CSP (Content Security Policy) headers
- [ ] Check for exposed secrets or sensitive information
- [ ] Test HTTPS enforcement

## Documentation
- [ ] Update deployment documentation with any changes
- [ ] Document any production-specific configurations
- [ ] Provide access instructions for the admin dashboard 