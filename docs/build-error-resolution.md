# Build Error Resolution Tracker

## Status: In Progress

> Baseline captured 2026-02-22. Goal: resolve all errors, then set
> `ignoreBuildErrors: false` and `ignoreDuringBuilds: false` in `next.config.mjs`.

---

## ESLint

ESLint currently fails to load `next/typescript` config. This needs to be resolved
before individual lint errors can be catalogued.

| File | Issue | Planned Fix | Status |
|------|-------|-------------|--------|
| .eslintrc.json | `next/typescript` config fails to load | Investigate ESLint/Next.js config compatibility | :white_large_square: |

---

## TypeScript Errors (32 total)

### Test Files (19 errors) — lower priority, fix during Vitest migration

| File | Error | Planned Fix | Status |
|------|-------|-------------|--------|
| `__tests__/admin/AdminDashboard.test.tsx` | TS7053 (3x): implicit `any` index | Add proper type annotations to mock objects | :white_large_square: |
| `__tests__/admin/AdminLayout.test.tsx` | TS7053 (3x), TS2339, TS7006 (2x) | Add type annotations; fix `children` prop type | :white_large_square: |
| `__tests__/admin/AdminLogin.test.tsx` | TS2307: missing module, TS7053 (3x), TS2790, TS7006 | Create missing login page or fix import; add types | :white_large_square: |
| `__tests__/utils/admin-test-utils.tsx` | TS2322, TS7053 (3x) | Fix Session type compatibility | :white_large_square: |
| `e2e/admin-dashboard.spec.ts` | TS2322: storageState type | Fix Playwright context options type | :white_large_square: |

### Application Code (10 errors) — higher priority

| File | Error | Planned Fix | Status |
|------|-------|-------------|--------|
| `app/admin/settings/monitoring.tsx` | TS2339 (2x): `status`/`lastDeployment` on `never` | Fix type for deployment status object | :white_large_square: |
| `app/hooks/useWaitlistForm.ts` | TS2345: SetStateAction type mismatch | Fix ValidationErrors type or spread pattern | :white_large_square: |
| `app/hooks/useWaitlistForm.ts` | TS2339 (2x): `window.gtag` not typed | Add global type declaration for gtag | :white_large_square: |
| `lib/feedback-templates/index.ts` | TS2552 (4x): missing template functions | Create or import template functions 1-4 | :white_large_square: |
| `lib/hooks/useFormValidation.ts` | TS2339: `.shape` on ZodType | Use `z.ZodObject` instead of `z.ZodType` | :white_large_square: |
| `lib/smoothScroll.ts` | TS2683: implicit `this` | Add explicit `this` parameter type | :white_large_square: |

### Config Files (3 errors) — fix during tooling upgrade

| File | Error | Planned Fix | Status |
|------|-------|-------------|--------|
| `playwright.config.ts` | TS2353: `maxDiffPixelRatio` | Update Playwright or use correct screenshot option | :white_large_square: |

---

## Target

- [ ] Zero application code TypeScript errors
- [ ] Zero ESLint errors
- [ ] Set `ignoreBuildErrors: false` in `next.config.mjs`
- [ ] Set `ignoreDuringBuilds: false` in `next.config.mjs`
