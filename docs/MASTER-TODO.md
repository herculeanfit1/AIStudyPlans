# AIStudyPlans - Master TODO List

This document consolidates all TODO items from various files into a single master reference list. Use this document to track outstanding tasks and current progress.

## Table of Contents
- [Application Features](#application-features)
  - [Email Integration](#email-integration)
  - [Application Structure](#application-structure)
  - [User Interface](#user-interface)
  - [Deployment & Infrastructure](#deployment--infrastructure)
  - [Future Enhancements](#future-enhancements)
- [CI/CD Improvements](#cicd-improvements)
  - [Foundation Improvements](#foundation-improvements)
  - [Delivery Improvements](#delivery-improvements)
  - [Security & Monitoring](#security--monitoring)
  - [Future CI/CD Enhancements](#future-cicd-enhancements)
- [TypeScript Fixes](#typescript-fixes)
  - [Type Definition Consolidation](#type-definition-consolidation)
  - [Custom Type Declarations](#custom-type-declarations)
  - [Supabase Client Methods](#supabase-client-methods)
  - [Server Code Configuration](#server-code-configuration)
  - [Type Strictness Implementation Plan](#type-strictness-implementation-plan)
  - [Developer Experience Improvements](#developer-experience-improvements)
- [Authentication & Admin Features](#authentication--admin-features)
  - [Admin Login Improvements](#admin-login-improvements)
  - [User Management](#user-management)

## Application Features

### Email Integration

- [x] Set up Resend package
- [x] Create email service utilities
- [x] Create email templates
- [x] Set up waitlist API endpoint
- [ ] Verify domain `aistudyplans.com` with Resend
  - Go to https://resend.com/domains
  - Add aistudyplans.com as domain
  - Follow DNS verification steps:
    - Add SPF record (TXT record) to authorize Resend to send emails on your behalf
    - Add DKIM record (TXT record) to verify email authenticity
    - Add MX record for proper email feedback handling
  - Update EMAIL_FROM in .env.local after verification

### Application Structure

- [x] Clean up duplicated components
- [x] Ensure proper Next.js App Router configuration
- [x] Implement responsive header with navigation
- [x] Create modern landing page with sections for features, pricing, etc.
- [x] Set up waitlist form with email confirmation
- [x] Review directory structure (consider moving from scheduledapp/ subfolder to root)
- [x] Create comprehensive documentation for codebase
  - [x] Created CODEBASE.md for overall architecture
  - [x] Created API.md for API endpoints
  - [x] Created EMAIL.md for email service
  - [x] Created COMPONENTS.md for frontend components
  - [x] Updated README.md as documentation index
  - [x] Consolidated and removed redundant documentation
- [ ] Set up proper test environment with Jest
- [x] Implement client-side form validation for better UX

### User Interface

- [x] Create responsive Hero section
- [x] Implement Features section
- [x] Add Pricing component with monthly/annual toggle
- [x] Create Footer with links and social media
- [x] Implement mobile-responsive navigation
- [x] Add animations and transitions for better engagement
- [x] Implement dark mode support
- [ ] Add testimonials section
- [x] Create FAQ section with accordion functionality

#### UI Enhancements (In Progress)

- [x] Hero Animation Upgrade
  - [x] Add particle effects in the background using Particles.js
  - [x] Implement subtle parallax scrolling for background elements
  - [x] Implement a 3D animated study plan using Three.js
- [x] Dark Mode Toggle
  - [x] Add a theme switcher with system preference detection
  - [x] Create custom dark/light mode animations for transitions
- [x] Micro-interactions
  - [x] Add hover effects for all interactive elements
  - [x] Implement scroll-triggered animations using Framer Motion's useInView hook
  - [x] Add loading state animations for all interactive elements

### Deployment & Infrastructure

- [x] Set up Next.js development environment
- [x] Configure proper build process
- [ ] Set up Vercel or similar deployment
- [ ] Configure domain with proper DNS settings
- [ ] Set up monitoring and analytics
- [ ] Implement proper error handling and logging
- [x] Create production Docker configuration
- [x] Set up Nginx configuration for production
- [x] Configure SSL with Let's Encrypt
- [x] Create production deployment checklist
- [x] Implement comprehensive backup strategy
  - [x] Set up GitHub Actions workflow for primary to backup repository mirroring
  - [x] Configure workflow to exclude .github directory to prevent conflicts
  - [x] Configure secondary secure backup with GPG encryption
  - [x] Document complete backup architecture and recovery procedures in BACKUP-STRATEGY.md
  - [x] Implement key management and security protocols
  - [x] Add all required secrets to both repositories

#### Environment Configuration
- [ ] Create a secure `.env.production` file with the following variables:
  - `NODE_ENV=production`
  - `NEXT_TELEMETRY_DISABLED=1`
  - `RESEND_API_KEY=<production_api_key>`
  - `EMAIL_FROM=noreply@aistudyplans.com`
  - `EMAIL_REPLY_TO=support@aistudyplans.com`
  - `NEXT_PUBLIC_APP_URL=https://aistudyplans.com`
- [ ] Ensure environment variables are securely stored and not committed to the repository
- [ ] Validate environment variables during the build process

#### Domain Setup
- [ ] Configure DNS settings for `aistudyplans.com`:
  - A record pointing to the production server IP
  - CNAME for www subdomain
  - MX records for proper email delivery
  - TXT records for SPF and DKIM to improve email deliverability
- [ ] Set up DNS CAA records for enhanced SSL security

#### Azure Static Web Apps Deployment
- [x] Configure Next.js for hybrid Azure Static Web Apps deployment:
  - [x] Update `next.config.js` to include `output: "standalone"` for improved Azure compatibility
  - [x] Configure appropriate caching strategies for static and dynamic content
- [x] Set up GitHub Actions CI/CD workflow:
  - [x] Create `.github/workflows/azure-static-web-apps.yml` using the `Azure/static-web-apps-deploy@v1` action
  - [x] Implement build caching with `actions/cache` for `node_modules` and `.next` directories
  - [x] Configure workflow to support pull request preview environments
- [x] Manage environment variables:
  - [x] Set up application settings via Azure portal
  - [x] Configure API-specific environment variables using `az staticwebapp appsettings set`
  - [x] Store secrets in GitHub Actions Secrets for build-time access
  - [x] Configure GitHub Secrets for CI/CD
  - [x] Create GitHub workflow file `.github/workflows/azure-static-web-apps.yml`
  - [x] Configure Azure Static Web Apps runtime settings
  - [x] Create `staticwebapp.config.json` with proper routes and headers
  - [x] Update `next.config.js` to include `output: "standalone"`
- [ ] Configure custom domain and SSL:
  - [ ] Add custom domain in Azure Static Web Apps portal
  - [ ] Create CNAME record pointing to Azure-provided endpoint
  - [ ] Validate domain ownership and configure free SSL certificate
- [ ] Implement monitoring and analytics:
  - [ ] Set up Application Insights for frontend and API monitoring
  - [ ] Add instrumentation code for client-side performance tracking
  - [ ] Configure alerts for critical errors and performance thresholds
- [ ] Enhance security configuration:
  - [ ] Apply custom security headers via `staticwebapp.config.json`
  - [ ] Configure CORS policies for API routes
  - [ ] Set up Azure WAF or Front Door for DDoS protection (optional)
  - [ ] Implement private endpoints for backend functions if needed
- [ ] Optimize for scaling and performance:
  - [ ] Configure dedicated App Service plan for backend functions
  - [ ] Implement auto-scaling rules based on load patterns
  - [ ] Set up resource naming conventions and organize resources appropriately
- [ ] Add additional support services:
  - [ ] Configure Azure Storage for static assets (if needed)
  - [ ] Set up Azure Logging account for centralized logs
  - [ ] Implement cost management tags and budget alerts

### Future Enhancements

- [ ] Implement user authentication
- [ ] Add database integration for waitlist
- [ ] Create study plan generation functionality
- [ ] Build calendar integration
- [ ] Add progress tracking 
- [ ] Implement dashboard for registered users
- [ ] Add study plan templates
- [ ] Create resource recommendation engine
- [ ] Interactive Study Plan Demo
  - [ ] Create a simplified version of the study plan generator
  - [ ] Allow users to input a subject and get a sample plan
  - [ ] Include a "Get Full Plan" CTA
- [ ] Personalization Quiz
  - [ ] Add a short quiz to identify user learning style
  - [ ] Show personalized recommendations based on results
  - [ ] End with customized CTA
- [ ] Progress Tracker Preview
  - [ ] Add interactive visual showing how the app tracks progress
  - [ ] Include animated charts or graphs
  - [ ] Demonstrate goal completion satisfaction
- [ ] Enhanced Social Proof & Trust Signals
  - [ ] Create an animated testimonial carousel
  - [ ] Add live waitlist counter
  - [ ] Display trust badges from educational institutions
- [ ] Advanced Call-to-Action Strategy
  - [ ] Implement tiered CTA approach (primary, secondary, tertiary)
  - [ ] Add floating action button that follows scroll
  - [ ] Create early access incentives
- [ ] Next.js 15 Upgrade Plan
  - [ ] Create test branch for Next.js 15 migration
  - [ ] Use @next/codemod CLI to automate migration process
  - [ ] Update async request APIs (cookies, headers, params)
  - [ ] Adjust caching strategy for uncached-by-default behavior
  - [ ] Test with React 19
  - [ ] Implement stable Turbopack for faster development
  - [ ] Utilize TypeScript config with next.config.ts
  - [ ] Enhance form handling with new <Form> component
  - [ ] Add client instrumentation hooks for analytics
  - [ ] Leverage enhanced security for Server Actions

## CI/CD Improvements

### Foundation Improvements

#### High Priority (Next 2 Weeks)

- [x] **Artifact Management**
  - [x] Create GitHub workflow for building and storing immutable Docker images
  - [x] Set up image tagging strategy (commit hash + semantic versioning)
  - [x] Configure caching for node_modules to speed up builds

- [x] **Testing Enhancement**
  - [x] Add container structure tests to validate Docker images
  - [x] Integrate automated linting in CI pipeline
  - [x] Set up parallel test execution for faster feedback

- [x] **Documentation**
  - [x] Create comprehensive Docker usage documentation
  - [x] Document CI/CD workflow and deployment process
  - [x] Add README sections for local development and production deployment

### Delivery Improvements

#### Medium Priority (Weeks 3-5)

- [ ] **GitOps Implementation**
  - [ ] Create IaC repository structure
  - [ ] Define Kubernetes/deployment manifests
  - [ ] Set up automated deployment triggered by manifest changes

- [x] **Environment Isolation**
  - [x] Create distinct configurations for dev/staging/production
  - [x] Ensure environment parity across all stages
  - [x] Implement appropriate security boundaries

- [x] **Progressive Delivery**
  - [x] Set up canary deployment capabilities
  - [x] Implement feature flag system
  - [x] Create automated rollback mechanism

### Security & Monitoring

#### Medium-Low Priority (Weeks 6-7)

- [x] **Security Enhancement**
  - [x] Integrate SAST tools (SonarQube or similar)
  - [x] Add container vulnerability scanning (Trivy)
  - [x] Implement secrets management with external vault

- [x] **Monitoring Setup**
  - [x] Create CI/CD performance dashboard
  - [x] Set up build duration and success rate tracking
  - [x] Configure alerts for pipeline failures

### Future CI/CD Enhancements

- [ ] **Advanced Features**
  - [ ] Implement A/B testing capability
  - [ ] Set up chaos testing for resilience validation
  - [ ] Create comprehensive compliance automation

#### Next Steps for CI/CD
1. ✅ Address linting and TypeScript errors  
2. ✅ Create monitoring dashboard for system health and performance
3. [ ] Enhance admin page with additional user management features
4. [ ] Improve email tracking and delivery metrics
5. [ ] Set up chaos testing for resilience validation

## TypeScript Fixes

### Type Definition Consolidation

- [x] Update `FeedbackWithUser` interface to include missing fields (`email_id`, `waitlist_user_id`)
- [x] Consolidate `FeedbackResponse` type between `supabase.ts` and `types.ts`
- [x] Create interface extensions instead of duplicate definitions
- [ ] Research Supabase CLI for type generation

### Custom Type Declarations

- [x] Create custom type declaration to add `maxDiffPixelRatio` to `PageScreenshotOptions`
- [x] Add custom typings for any other third-party libraries with missing types

### Supabase Client Methods

- [x] Fix `.lt()` method type errors with appropriate type assertions
- [x] Add type guards for Supabase responses to handle error properties correctly
- [x] Review and fix other Supabase-related type issues

### Server Code Configuration

- [x] Create separate `tsconfig.json` for the MCP server code
- [ ] Install or update server dependencies with proper typing:
  - [ ] Evaluate OpenAI SDK v4 upgrade
  - [ ] Fix Zod import and typing issues
  - [ ] Address remaining server dependency issues

### Type Strictness Implementation Plan

- [x] Phase 1: Fix all current TypeScript errors with minimal compiler flags
- [ ] Phase 2: Enable `noImplicitAny: true` and fix resulting errors
- [ ] Phase 3: Enable `strictNullChecks: true` and fix resulting errors

### Developer Experience Improvements

- [x] Enable incremental compilation in tsconfig.json
- [ ] Create a pre-commit hook for TypeScript linting
- [ ] Document type conventions and practices for the project
- [ ] Add automated type checking to CI/CD pipeline

#### Implementation Order for TypeScript
1. ✅ Fix all type definition conflicts (Step 1) - COMPLETED
2. ✅ Add custom type declarations (Step 2) - COMPLETED
3. ✅ Address Supabase client method typing (Step 3) - COMPLETED
4. ✅ Configure server code separately (Step 4) - COMPLETED
5. ✅ Implement Phase 1 of gradual type strictness (Step 5) - COMPLETED
6. 🔄 Proceed to Phase 2: Enabling `noImplicitAny`
7. ⏳ Implement Phase 3 and Developer Experience improvements

## Authentication & Admin Features

### Admin Login Improvements
- [x] Fix admin login functionality in production
- [x] Implement Microsoft login routing
- [x] Create dedicated Microsoft-only login page
- [x] Add server-side redirects in staticwebapp.config.json
- [ ] Remove console.log statements from MicrosoftLoginButton.tsx
- [ ] Implement more robust environment detection
- [ ] Add comprehensive tests for auth flow

### User Management
- [ ] Create admin user management interface
- [ ] Implement user role management
- [ ] Add account suspension/deletion functionality 