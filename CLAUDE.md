# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Cross-site standards**: See `STANDARDS.md` in this repo for shared conventions
> that apply across all TK web properties. This file documents SchedulEd-specific
> details only. STANDARDS.md takes precedence on any conflicting guidance.
>
> **Note**: This repo is currently on Next.js 14 / React 18. STANDARDS.md targets
> Next.js 15 / React 19 — those upgrades are planned separately. Until then,
> SchedulEd-specific deviations from the target stack are documented here.

## Project Overview

SchedulEd (AIStudyPlans) is a Next.js 14 landing page for an AI-powered study plan generator. It's deployed on Azure Static Web Apps and uses Supabase as the backend database, Resend for email delivery, and NextAuth for authentication.

## Commands

### Development
```bash
npm run dev          # Start dev server on localhost:3000
npm run build        # Production build
npm run start        # Serve production build
```

### Testing
```bash
npm test                    # Run Jest unit tests
npm test -- --testPathPattern="Header"  # Run a single test file
npm run test:watch          # Jest in watch mode
npm run test:coverage       # Jest with coverage (70% threshold)
npm run test:e2e            # Playwright E2E tests (auto-starts dev server)
npm run test:e2e:ui         # Playwright with interactive UI
npm run test:all            # lint + typecheck + unit + e2e
```

### Linting & Type Checking
```bash
npm run lint         # ESLint (next/core-web-vitals + next/typescript)
npm run typecheck    # tsc --noEmit
```

### Docker
```bash
./run-docker.sh start   # Start dev environment on localhost:3001
./run-docker.sh stop    # Stop dev environment
./run-docker.sh test    # Run unit tests in Docker
./run-docker.sh e2e     # Run E2E tests in Docker
```

### Dependencies
```bash
npm install package-name --save-exact   # Always use exact versions (no ^ or ~)
npm shrinkwrap                          # After adding deps, lock transitive deps
npm run validate:deps                   # Verify dependency standards
```

## Architecture

### Dual App Directory Structure
The project has **two** app entry points — this is important to understand:

- **`app/`** — Primary application directory. Contains all routes, API endpoints, and page-level components. This is where the main landing page (`app/page.tsx`) lives with Hero, Features, Pricing, FAQ, WaitlistForm, etc.
- **`src/app/`** — Secondary/legacy entry point with a separate `layout.tsx` and `page.tsx`. Contains a backup layout and minimal page.

The `app/` directory is the active one used by Next.js (it takes precedence).

### Component Organization
Components live in three locations:
- **`app/components/`** — Page-specific components used directly by routes (Header, Hero, Features, Footer, WaitlistForm, etc.)
- **`app/components/landing/`** — Alternative landing page section components (HeroSection, FeaturesSection, etc.)
- **`components/`** — Shared/reusable components (ErrorBoundary, auth Provider, admin components)

### Provider Hierarchy
`app/layout.tsx` wraps the app with: `ErrorBoundary` → `Providers` (AuthProvider + ThemeProvider) → `AnalyticsProvider`

### API Routes (`app/api/`)
- **`waitlist/`** — Waitlist signup (stores in Supabase, sends confirmation via Resend)
- **`contact/sales/` and `contact/support/`** — Contact forms
- **`auth/[...nextauth]/`** — NextAuth with Azure AD provider
- **`csrf/`** — CSRF token generation
- **`health/`** — Health check endpoint
- **`admin/`** — Admin endpoints (email stats, CI status, dev auth)
- **`feedback-campaign/`** — Feedback collection

### Shared Libraries (`lib/`)
- **`supabase.ts` / `admin-supabase.ts`** — Supabase client (public and service-role)
- **`email.ts`** — Email sending via Resend
- **`email-templates.ts` / `feedback-templates/`** — HTML email templates
- **`csrf.ts`** — CSRF protection utilities
- **`rate-limit.ts`** — API rate limiting
- **`validation.ts`** — Zod-based input validation
- **`types.ts`** — Shared TypeScript types

### Path Aliases
`@/*` maps to the project root (configured in `tsconfig.json`). In Jest, aliases are mapped explicitly:
- `@/components/*` → `app/components/*`
- `@/app/*` → `app/*`
- `@/lib/*` → `lib/*`

### Testing Structure
- **`__tests__/`** — Jest unit tests (mirrors app structure)
- **`__tests__/utils/test-utils.tsx`** — Shared test utilities (excluded from test runs)
- **`e2e/`** — Playwright E2E tests (landing, admin dashboard, visual regression)
- Jest setup file: `jest.setup.js`

### Authentication
NextAuth with Azure AD. Admin access is controlled by `ADMIN_EMAILS` env var (comma-separated list). Admin pages live under `app/admin/`.

### Environment Variables
See `.env.example` for required variables. Key ones: `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, Azure AD credentials, `ADMIN_EMAILS`, and Supabase connection details.

**Important**: `.env.development` and `.env.production` are gitignored. Only `.env.example` and `.env.local.example` are tracked.

### Docker Infrastructure
Five compose files, each serving a distinct purpose:
- **`docker-compose.yml`** — Primary. `nextjs` (prod runner, port 3000) and `web` (dev with hot-reload, port 3001)
- **`docker-compose.prod.yml`** — Production. Adds nginx reverse proxy with SSL and certbot auto-renewal. Resource limits and `no-new-privileges` security
- **`docker-compose.test.yml`** — Profile-based test runner using YAML anchors. Profiles: `unit`, `e2e`, `a11y`, `visual`, `perf`, `all`
- **`docker-compose.email-test.yml`** — Lightweight email template testing via `scripts/email-test.js`
- **`docker-compose.override.yml`** — Dev volume mounts for hot-reload

### CI/CD Workflows (`.github/workflows/`)
- **`azure-static-web-apps.yml`** — Production deployment to Azure SWA on push to main. Generates PR preview URLs. Runs `ci-build.sh`
- **`pr-validation.yml`** — PR quality gates: lint → typecheck → tests → build, then parallel security scan + deployment validation
- **`dependency-checks.yml`** — Weekly + on-change: exact version enforcement, shrinkwrap presence, audit
- **`backup-repository.yml`** — Weekly mirror to backup repo

## SchedulEd-Specific Notes

- **Icons**: Font Awesome loaded via CDN (in `app/layout.tsx` `<head>`)
- **Build behavior**: Both TypeScript and ESLint are enforced during builds (`ignoreBuildErrors: false`, `ignoreDuringBuilds: false`). The build will fail on any type error or lint warning.
- **npm install**: Use `--legacy-peer-deps` flag when encountering peer dependency conflicts (next-auth/next version mismatch)
- **Testing**: Currently on Jest (Vitest migration planned with Next.js 15 upgrade)
