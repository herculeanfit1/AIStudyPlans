# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

## Conventions

- **Commit messages**: Use conventional commits format (`feat:`, `fix:`, `docs:`, `chore:`, etc.)
- **TypeScript**: Strict mode enabled
- **Styling**: Tailwind CSS with Font Awesome icons (loaded via CDN)
- **Theming**: Dark/light mode via `next-themes` with `class` attribute strategy
- **Build behavior**: TypeScript errors are ignored in production builds (`ignoreBuildErrors: true`); ESLint is ignored during builds. Run `npm run lint` and `npm run typecheck` separately.
- **npm install**: Use `--legacy-peer-deps` flag when encountering peer dependency conflicts (next-auth/next version mismatch)
