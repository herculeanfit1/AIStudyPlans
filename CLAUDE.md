# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Cross-site standards**: See `STANDARDS.md` in this repo for shared conventions
> that apply across all TK web properties. This file documents SchedulEd-specific
> details only. STANDARDS.md takes precedence on any conflicting guidance.

## Project Overview

SchedulEd (AIStudyPlans) is a Next.js 15 landing page for an AI-powered study plan generator. It's deployed on Azure Static Web Apps and uses Supabase as the backend database, Resend for email delivery, and Auth.js v5 (next-auth) for authentication.

## Commands

### Development
```bash
npm run dev          # Start dev server on localhost:3000
npm run build        # Production build
npm run start        # Serve production build
```

### Testing
```bash
npm test                                # Run Vitest unit tests
npm test -- __tests__/Header.test.tsx   # Run a single test file
npm run test:watch                      # Vitest in watch mode
npm run test:coverage                   # Vitest with v8 coverage (70% threshold)
npm run test:e2e                        # Playwright E2E tests (auto-starts dev server)
npm run test:e2e:ui                     # Playwright with interactive UI
npm run test:all                        # lint + typecheck + unit + e2e
```

### Validation (run before pushing)
```bash
npm run validate         # Full: lint + typecheck + tests + build
npm run validate:quick   # Fast: lint + typecheck + build (no tests)
```

### Linting & Type Checking
```bash
npm run lint         # ESLint 9 flat config (eslint.config.mjs)
npm run lint:fix     # ESLint with auto-fix
npm run typecheck    # tsc --noEmit
```

**Lint gotchas**: `@typescript-eslint/no-unused-vars` is `"error"` — any unused import or variable fails lint. `@typescript-eslint/no-explicit-any` is `"warn"` — `any` usage produces warnings. `no-console` is `"warn"` — use `// eslint-disable-next-line no-console` for intentional console.log. The `--max-warnings 0` flag means any warning fails CI.

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
- **`auth/[...nextauth]/`** — Auth.js v5 with Microsoft Entra ID provider
- **`csrf/`** — CSRF token generation
- **`health/`** — Health check endpoint
- **`admin/`** — Admin endpoints (email stats, CI status, dev auth)
- **`feedback-campaign/`** — Feedback collection

### Shared Libraries (`lib/`)
- **`supabase.ts`** — Public Supabase client with graceful fallback to mock client when env vars are missing (enables local dev without Supabase)
- **`admin-supabase.ts`** — Service-role client for admin operations (higher privilege)
- **`email.ts`** — Resend wrapper with quota tracking and retry logic, rate-limited
- **`email-templates.ts` / `feedback-templates/`** — HTML email templates
- **`csrf.ts`** — CSRF token generation/validation for form submissions
- **`rate-limit.ts`** — In-memory IP-based rate limiter (resets on restart; production should use Redis)
- **`validation.ts`** — Zod schemas for all API input validation
- **`types.ts`** — Shared TypeScript types

### Path Aliases
`@/*` maps to the project root (configured in `tsconfig.json` and `vitest.config.ts`). Single alias: `@` → project root.

### Testing Structure
- **`__tests__/`** — Vitest unit tests (mirrors app structure)
- **`__tests__/utils/test-utils.tsx`** — Shared test utilities (excluded from test runs)
- **`e2e/`** — Playwright E2E tests (landing, admin dashboard, visual regression)
- Vitest config: `vitest.config.ts` (happy-dom environment, globals enabled)
- Setup file: `vitest.setup.tsx` (mocks for next/navigation, next/image, next/link, next-themes)

### Authentication
Auth.js v5 (next-auth@5.0.0-beta.29) with Microsoft Entra ID (formerly Azure AD). Server-side auth uses the `auth()` function exported from `auth.ts` at project root. Client-side auth uses `useSession`/`SessionProvider` from `next-auth/react`. Admin access is controlled by `ADMIN_EMAILS` env var (comma-separated list). Admin pages live under `app/admin/`.

### Environment Variables
See `.env.example` for required variables. Key ones: `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, Azure AD credentials, `ADMIN_EMAILS`, and Supabase connection details.

**Important**: `.env.development` and `.env.production` are gitignored. Only `.env.example` is tracked.

### Docker Infrastructure
Five compose files, each serving a distinct purpose:
- **`docker-compose.yml`** — Primary. `nextjs` (prod runner, port 3000) and `web` (dev with hot-reload, port 3001)
- **`docker-compose.prod.yml`** — Production. Adds nginx reverse proxy with SSL and certbot auto-renewal. Resource limits and `no-new-privileges` security
- **`docker-compose.test.yml`** — Profile-based test runner using YAML anchors. Profiles: `unit`, `e2e`, `a11y`, `visual`, `perf`, `all`
- **`docker-compose.email-test.yml`** — Lightweight email template testing via `scripts/email-test.js`
- **`docker-compose.override.yml`** — Dev volume mounts for hot-reload

### CI/CD Model
CI in GitHub Actions is **deployment-only**. Run `npm run validate` locally before pushing to main. There is no PR validation workflow — all lint, typecheck, and test checks run on the developer's machine.

**Active workflows (`.github/workflows/`):**
- **`azure-static-web-apps.yml`** — Build + deploy to Azure SWA on push to main. PR preview URLs on pull requests. Deployment-only, no lint/test.
- **`dependency-checks.yml`** — Weekly + on-change guardrail: exact version enforcement, shrinkwrap presence, audit
- **`backup-repository.yml`** — Weekly mirror to backup repo

### Service Layer & Data Flow
Request flow: **Client → Next.js API route → lib/ utilities → Supabase/Resend**

API route pipeline (per STANDARDS.md): Zod validation → rate limiting → business logic → typed `NextResponse.json()`. Public forms use honeypot fields (`_gotcha`).

### Monitoring
Admin dashboard at `/admin/settings/monitoring` tracks API health, email delivery rates, and CI/CD status. Types defined in `app/types/monitoring.ts`. Azure Application Insights is configured for production (connection string via env var).

## SchedulEd-Specific Notes

- **Node version**: Pinned to 20.19.1 in `.nvmrc` and CI workflows. `package.json` engines requires `>=20.19.1` to allow local dev on newer Node versions. Run `nvm use` to match CI.
- **Icons**: Font Awesome loaded via CDN (in `app/layout.tsx` `<head>`)
- **Animation**: `motion` (formerly framer-motion) for animations; lightweight canvas-based particle effects (no external deps)
- **Charts**: `chart.js` + `react-chartjs-2` (admin dashboard)
- **Next.js config**: `next.config.mjs` (ESM). `reactStrictMode` is enabled in dev only.
- **Build behavior**: Both TypeScript and ESLint are enforced during builds (`ignoreBuildErrors: false`, `ignoreDuringBuilds: false`). The build will fail on any type error or lint warning. The build shows a cosmetic "Next.js plugin was not detected in ESLint configuration" warning — this is harmless because lint runs via `eslint` directly, not `next lint`.
- **npm install**: Use `--legacy-peer-deps` flag when encountering peer dependency conflicts (@types/node version mismatch with vite)
- **Testing**: Vitest 3.x with happy-dom environment and `@testing-library/react@16` (React 19 compatible). Use `vi.mock()`, `vi.fn()`, `vi.mocked()` for mocks.
- **ESLint**: Flat config in `eslint.config.mjs` (ESLint 9). NOT `.eslintrc.json`. Uses `typescript-eslint` and `@next/eslint-plugin-next` directly.
- **Tailwind CSS**: v3 with `tailwind.config.ts`. Do NOT migrate to v4 without reading BTAISite CLAUDE.md "Critical: Tailwind CSS v4 Rules" first.
- **CSS layers**: All base resets and element selectors in `globals.css` are wrapped in `@layer base` for Tailwind v4 forward-compatibility.

## Cross-Site References

| Topic | Reference |
|-------|-----------|
| Shared conventions | `STANDARDS.md` (this repo) |
| Tailwind v4 migration guide | BTAISite `CLAUDE.md` — "Critical: Tailwind CSS v4 Rules" |
| Node version standard | `.nvmrc` — pinned to 20.19.1 (aligned with BTAISite) |
| CODEOWNERS template | `.github/CODEOWNERS` (this repo) |
