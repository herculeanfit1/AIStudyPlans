# SchedulEd Application - TODO List

## Email Integration

- [x] Set up Resend package
- [x] Create email service utilities
- [x] Create email templates
- [x] Set up waitlist API endpoint
- [ ] Verify domain `aistudyplans.com` with Resend
  - Go to https://resend.com/domains
  - Add aistudyplans.com as domain
  - Follow DNS verification steps
  - Update EMAIL_FROM in .env.local after verification

## Application Structure

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

## User Interface

- [x] Create responsive Hero section
- [x] Implement Features section
- [x] Add Pricing component with monthly/annual toggle
- [x] Create Footer with links and social media
- [x] Implement mobile-responsive navigation
- [x] Add animations and transitions for better engagement
- [x] Implement dark mode support
- [x] Create FAQ section with accordion functionality

## UI Enhancements (In Progress)

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

## Deployment & Infrastructure

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
- [ ] Implement the following deployment steps:

### 1. Environment Configuration

- [ ] Create a secure `.env.production` file with the following variables:
  - `NODE_ENV=production`
  - `NEXT_TELEMETRY_DISABLED=1`
  - `RESEND_API_KEY=<production_api_key>`
  - `EMAIL_FROM=noreply@aistudyplans.com`
  - `EMAIL_REPLY_TO=support@aistudyplans.com`
  - `NEXT_PUBLIC_APP_URL=https://aistudyplans.com`
- [ ] Ensure environment variables are securely stored and not committed to the repository
- [ ] Validate environment variables during the build process

### 2. Domain Setup

- [ ] Configure DNS settings for `aistudyplans.com`:
  - A record pointing to the production server IP
  - CNAME for www subdomain
  - MX records for proper email delivery
  - TXT records for SPF and DKIM to improve email deliverability
- [ ] Set up DNS CAA records for enhanced SSL security

### 3. Server Setup

- [ ] Provision a production server with adequate resources:
  - Minimum 2GB RAM, 2 vCPUs for initial deployment
  - 20GB SSD storage
  - Ubuntu 22.04 LTS or similar stable OS
- [ ] Configure server security:
  - Set up SSH key-based authentication
  - Configure firewall (UFW) to allow only necessary ports (80, 443, 22)
  - Install fail2ban for brute force protection
  - Set up automatic security updates
- [ ] Install Docker and Docker Compose:
  - Follow official installation guides
  - Configure Docker daemon with appropriate limits
  - Set up Docker to start on boot

### 4. SSL Certificate Setup

- [ ] Create directories for Let's Encrypt certificates

### 5. Azure Static Web Apps Deployment

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
  - [x] Configure GitHub Secrets for CI/CD:
    - [x] Add `AZURE_STATIC_WEB_APPS_API_TOKEN` (from Azure)
    - [x] Add `RESEND_API_KEY` for email service
    - [x] Add `EMAIL_FROM` with verified domain
    - [x] Add `EMAIL_REPLY_TO` for support emails
    - [x] Add `NEXT_PUBLIC_APP_URL` for site URL
  - [x] Create GitHub workflow file `.github/workflows/azure-static-web-apps.yml`:
    - [x] Set up Node.js environment with appropriate version
    - [x] Configure caching for dependencies and build outputs
    - [x] Use `Azure/static-web-apps-deploy@v1` action
    - [x] Pass environment variables from secrets to the build process
  - [x] Configure Azure Static Web Apps runtime settings:
    - [x] Set environment variables in Azure Portal Configuration section
    - [x] Alternatively use Azure CLI command: `az staticwebapp appsettings set`
    - [x] Ensure all variables are properly set for both build-time and runtime
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

## Future Enhancements

- [ ] Implement user authentication
- [ ] Add database integration for waitlist
- [ ] Create study plan generation functionality
- [ ] Build calendar integration
- [ ] Add progress tracking
- [ ] Implement dashboard for registered users
- [ ] Add study plan templates
- [ ] Create resource recommendation engine
- [x] Interactive Study Plan Demo
  - [x] Create a simplified version of the study plan generator
  - [x] Allow users to input a subject and get a sample plan
  - [x] Include a "Get Full Plan" CTA
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
