# Next.js 15 Upgrade Log

## Overview

| Field | Value |
|-------|-------|
| **Date started** | 2026-02-23 |
| **Branch** | `next15-upgrade` |
| **Starting versions** | Next 14.2.31, React 18.3.1, next-auth 4.24.12 |
| **Target versions** | Next 15.x, React 19.x, next-auth 5.x (Auth.js) |
| **Baseline commit** | b4f4fc09 (`main`) |

## Baseline State

- Lint: PASS
- Typecheck: PASS
- Unit tests: 54/54 PASS
- E2E tests: 1/17 pass (pre-existing environmental failures — see `phase0-baseline.md`)

## Phase Tracking

- [x] **Phase 0** — Create upgrade branch and establish baseline
- [x] **Phase 1** — Upgrade Next.js 14→15, React 18→19, fix breaking changes
- [x] **Phase 2** — Migrate NextAuth v4 → Auth.js v5
- [x] **Phase 3** — Replace heavy 3D/particle deps with lightweight alternatives
- [x] **Phase 4** — ESLint 8→9 flat config migration
- [ ] **Phase 5** — Clean up deprecated patterns and update configs
- [ ] **Phase 6** — Final validation, docs update, merge to main

## Phase Notes

### Phase 0 — Baseline (2026-02-23)

- Branch created from `main` at b4f4fc09
- Full baseline documented in `phase0-baseline.md`
- Dependency snapshot saved to `deps-before.txt`
- All code-level checks pass; E2E failures are environmental (missing auth env vars, visual snapshot diffs)

### Phase 1 — Core Framework Upgrade (2026-02-23)

- Upgraded: next 14.2.31→15.4.6, react/react-dom 18.3.1→19.1.0, @types/react 18.3.18→19.1.8, @types/react-dom 18.3.5→19.1.6
- eslint-config-next kept at 14.2.31 (ESLint 8 incompatible with v15)
- Fixed async cookies() in lib/csrf.ts (setCsrfToken, getCsrfToken, validateCsrfToken, csrfProtection, useCsrfToken)
- Removed swcMinify and experimental.missingSuspenseWithCSRBailout from next.config.mjs
- Updated tsconfig.json target es5→es2017
- Removed generateStaticParams from 13 API route files
- Updated staticwebapp.config.json apiRuntime node:18→node:20
- Fixed request.ip→headers in lib/rate-limit.ts
- Added @ts-nocheck to StudyPlan3D.tsx for R3F React 19 JSX incompatibility
- Wrapped usePageTracking in Suspense boundary (analytics-provider.tsx)
- Deleted auto-generated eslint.config.mjs conflicting with .eslintrc.json
- Gate checks: lint PASS, typecheck PASS, build PASS (37 static pages), tests 54/54 PASS

### Phase 2 — Auth.js v5 Migration (2026-02-23)

- Upgraded: next-auth 4.24.12→5.0.0-beta.29
- Removed direct @auth/core and cookie dependencies (next-auth v5 bundles @auth/core@0.40.0)
- Removed @auth/core override from package.json (kept cookie override for security)
- Created centralized auth.ts with NextAuth() exporting {handlers, auth, signIn, signOut}
- Migrated AzureAD provider → MicrosoftEntraID (tenantId → issuer URL pattern)
- Simplified route handler: app/api/auth/[...nextauth]/route.ts now re-exports handlers from auth.ts
- Middleware: replaced getToken() from next-auth/jwt with auth() wrapper pattern using request.auth
- API route auth: replaced getToken() with auth() in email-usage route
- SessionProvider, useSession, signOut imports unchanged (still from next-auth/react in v5)
- Module augmentation: JWT type now declared in @auth/core/jwt instead of next-auth
- Deleted unused out.ts artifact
- Gate checks: lint PASS, typecheck PASS, build PASS (37 static pages), tests 54/54 PASS

### Phase 3 — Replace Heavy 3D/Particle Deps (2026-02-23)

- **Removed packages**: @react-three/fiber, @react-three/drei, three, @types/three, react-tsparticles, tsparticles-slim, tsparticles-engine (114 packages total)
- **Replaced framer-motion with motion@12.9.1** (same version, new package name with motion/react entry point)
- **ParticlesBackground.tsx**: Rewrote from react-tsparticles to lightweight canvas-based implementation (~95 lines, no external deps). Same visual: floating dots with connecting lines, dark mode aware, requestAnimationFrame loop.
- **StudyPlan3D.tsx**: Deleted (exported but never imported/rendered on any page). Removed @ts-nocheck added in Phase 1.
- **ParticleBackground.tsx**: Deleted (duplicate component, never imported)
- **types/react-three-fiber-shim.d.ts**: Deleted (R3F compatibility shim no longer needed)
- Updated all framer-motion imports (5 files) from `"framer-motion"` → `"motion/react"`
- Updated test mocks: replaced react-tsparticles mock with canvas getContext mock
- **react-use**: Zero imports found in codebase — no action needed
- **Bundle impact**: Home page 6.4 kB / 172 kB first load. Removed ~114 transitive packages.
- Gate checks: lint PASS, typecheck PASS, build PASS (37 static pages), tests 54/54 PASS

### Phase 4 — ESLint 8→9 Flat Config Migration (2026-02-24)

- **Upgraded**: eslint 8.57.0→9.39.2, @eslint/js 9.39.2, typescript-eslint 8.39.0 (replaces @typescript-eslint/eslint-plugin@6.21.0 + @typescript-eslint/parser@6.21.0), globals 17.3.0
- **Replaced eslint-config-next** with @next/eslint-plugin-next@15.4.6 (direct plugin import). eslint-config-next uses @rushstack/eslint-patch which is incompatible with ESLint 9.
- **Dropped eslint-plugin-unused-imports**: The plugin uses `context.getScope()` (removed in ESLint 9) via @typescript-eslint/utils. Replaced with `@typescript-eslint/no-unused-vars` at "error" level with `argsIgnorePattern: "^_"`, `varsIgnorePattern: "^_"`, `caughtErrorsIgnorePattern: "^_"`.
- **Config format**: Deleted `.eslintrc.json`, created `eslint.config.mjs` (flat config)
- **Lint script**: Changed from `next lint` to `eslint app/ components/ lib/ --max-warnings 0`. Added `lint:fix` script.
- **ESLint runs during builds**: `eslint.ignoreDuringBuilds: false` kept (unchanged)
- **Rule changes vs original**:
  - `unused-imports/no-unused-imports: error` → replaced by `@typescript-eslint/no-unused-vars: error` (catches unused vars + imports)
  - `@typescript-eslint/no-explicit-any: warn` → kept as-is
  - `react/no-unescaped-entities: off` → kept as-is
  - Added `@typescript-eslint/no-require-imports: off` for test files
  - Added all @next/next recommended + core-web-vitals rules explicitly
- **Code fixes**: Prefixed 6 unused catch variables with `_`, added comments to 2 empty catch blocks, added eslint-disable for 3 auth `<a>` links (intentional full-page navigation to auth API)
- Gate checks: lint PASS (0 warnings, 0 errors), typecheck PASS, build PASS (37 static pages), tests 54/54 PASS
