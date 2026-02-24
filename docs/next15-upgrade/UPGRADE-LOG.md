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
- [x] **Phase 5** — Migrate Jest to Vitest
- [x] **Phase 6** — Clean up deprecated patterns and update configs
- [x] **Phase 7** — Final validation, docs update, merge to main

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
- **ESLint runs during builds**: No explicit `eslint.ignoreDuringBuilds` in next.config.mjs; Next.js default (`false`) applies — ESLint runs during builds
- **Rule changes vs original**:
  - `unused-imports/no-unused-imports: error` → replaced by `@typescript-eslint/no-unused-vars: error` (catches unused vars + imports)
  - `@typescript-eslint/no-explicit-any: warn` → kept as-is
  - `react/no-unescaped-entities: off` → kept as-is
  - Added `@typescript-eslint/no-require-imports: off` for test files
  - Added all @next/next recommended + core-web-vitals rules explicitly
- **Code fixes**: Prefixed 6 unused catch variables with `_`, added comments to 2 empty catch blocks, added eslint-disable for 3 auth `<a>` links (intentional full-page navigation to auth API)
- Gate checks: lint PASS (0 warnings, 0 errors), typecheck PASS, build PASS (37 static pages), tests 54/54 PASS

### Phase 5 — Jest to Vitest Migration (2026-02-24)

- **Installed**: vitest@3.2.4, @vitejs/plugin-react@4.7.0, @vitest/coverage-v8@3.2.4, happy-dom@17.6.3, @testing-library/dom@10.4.0
- **Removed**: jest@29.7.0, jest-environment-jsdom@29.7.0, @types/jest@29.5.12, @types/testing-library__jest-dom@5.14.9 (288 packages removed)
- **Upgraded**: @testing-library/react 14→16 (React 19 support), @testing-library/jest-dom 6.6.3, @testing-library/user-event 14.6.1
- **Config**: Created `vitest.config.ts` (happy-dom, globals:true, retry:2, 10s timeouts, v8 coverage with 70% thresholds). Deleted `jest.config.js` and `jest.setup.js`.
- **Setup file**: Created `vitest.setup.tsx` — migrated all mocks from jest.setup.js (`vi.mock` for next/navigation, next/image, next/link, next-themes). Uses `@testing-library/jest-dom/vitest` import path.
- **Type support**: Created `vitest.d.ts` with `/// <reference types="vitest/globals" />` for global `vi`, `describe`, `it`, `expect` types.
- **Path aliases**: Simplified to single `@` → project root (matching tsconfig `@/*` → `./*`). Removed specific `@/components`, `@/app`, `@/lib` overrides — they incorrectly pointed `@/components` to `app/components/` instead of root `components/`.
- **Test file migration (8 files)**:
  - `jest.mock()` → `vi.mock()`, `jest.fn()` → `vi.fn()`, `jest.clearAllMocks()` → `vi.clearAllMocks()`
  - `jest.requireActual()` → async `vi.importActual()` (contact.test.ts, supabase.test.ts)
  - `as jest.Mock` → `vi.mocked()` (AdminLayout.test.tsx, AdminDashboard.test.tsx)
  - `require()` inline mock access → direct import + `vi.mocked()` (contact.test.ts)
  - Canvas prototype mock type assertion added for TypeScript (OptimizedUseEffect.test.tsx)
- **Utility files**: Migrated test-utils.tsx (`jest.resetAllMocks` → `vi.resetAllMocks`) and admin-test-utils.tsx (`jest.fn` → `vi.fn`)
- **Scripts**: `"test": "vitest run"`, `"test:watch": "vitest"`, `"test:coverage": "vitest run --coverage"`
- Gate checks: lint PASS, typecheck PASS, build PASS (37 static pages), tests 54/54 PASS

### Phase 6 — Cleanup and Lint Hardening (2026-02-24)

- **Removed packages** (56 transitive packages removed):
  - `react-use@17.6.0` — zero imports in codebase (phantom dependency)
  - `@types/cors@2.8.18`, `@types/express@5.0.2`, `@types/helmet@0.0.48`, `@types/pino@7.0.4`, `@types/uuid@10.0.0` — only used by mcp-server/ which has its own package.json
- **No Babel packages found**: Jest's Babel transpilation packages were already absent (never explicitly listed in devDependencies; Vitest uses esbuild)
- **tsconfig.json**: Added `mcp-server` to `exclude` array — mcp-server has its own tsconfig and should not be typechecked by the root config
- **.gitignore**: Added `playwright-report/` and `test-results/` (test artifact directories)
- **ESLint hardening**: Re-added `no-console` rule as `["warn", { allow: ["warn", "error"] }]`. Added 41 eslint-disable comments across 9 files to suppress existing `console.log` calls. New code adding `console.log` will now trigger lint warnings.
- **ESLint config cleanup**: Updated ignore patterns from `jest.config.*`/`jest.setup.*` to `vitest.config.*`/`vitest.setup.*`
- **UPGRADE-LOG fix**: Corrected Phase 4 documentation — `eslint.ignoreDuringBuilds: false` is Next.js's default behavior, not an explicit config setting
- **.npmrc cleanup**: Removed 3 invalid entries that produced npm warnings (`scripts-prepend-node-path`, `resolution-mode`, `force-node-version`)
- **Docker note**: Docker compose test configs (`docker-compose.test.yml`) still reference Jest internally — should be updated when Docker configs are refreshed
- **Package count**: 42 top-level packages (down from 53 at baseline)
- Gate checks: lint PASS (0 warnings, 0 errors), typecheck PASS, build PASS (37 static pages), tests 54/54 PASS

### Phase 7 — Final Validation and Merge (2026-02-24)

- **Script audit**: All package.json scripts verified — no stale jest/babel references. Docker compose test configs use `npm test`/`npm run test:coverage` which correctly resolve to vitest.
- **Build warning**: Documented cosmetic "Next.js plugin not detected in ESLint configuration" warning — harmless because lint runs via `eslint` directly, not `next lint`. `eslint-config-next` is incompatible with ESLint 9.
- **Full regression**: Clean install (`rm -rf .next node_modules && npm install --legacy-peer-deps`) → all gates pass (lint, typecheck, build, tests). Zero npm config warnings after .npmrc cleanup.
- **Documentation updates**:
  - CLAUDE.md: Updated project overview (Next.js 15, Auth.js v5), testing commands (Vitest), lint commands (ESLint 9 flat config), path aliases (single @ alias), testing structure (vitest.config.ts, vitest.setup.tsx), authentication (Auth.js v5, auth() function), animation stack (motion, canvas particles), build notes, npm install notes, ESLint notes
  - README.md: Updated framework version (Next.js 15, React 19), testing framework (Vitest)
- **Final package count**: 42 top-level packages (baseline was 53, net reduction of 11)
- **Final test count**: 54/54 (unchanged from baseline)
- **Total commits on branch**: 8 (baseline + 7 phase commits)
