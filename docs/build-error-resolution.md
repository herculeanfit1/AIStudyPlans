# Build Error Resolution Tracker

## Status: In Progress

> Goal: resolve all TypeScript errors and ESLint warnings, then set
> `ignoreBuildErrors: false` and `ignoreDuringBuilds: false` in `next.config.mjs`.

---

## TypeScript Errors — RESOLVED

All 17 TypeScript errors resolved (commit 8df89a03). `ignoreBuildErrors: false` is now active.

---

## ESLint Warnings (54 total)

ESLint exits 0 with zero errors. 54 warnings remain, grouped by rule below.

### `@typescript-eslint/no-explicit-any` (46 warnings)

| File | Lines | Count |
|------|-------|-------|
| `lib/supabase.ts` | 26, 26, 46, 122, 125, 126, 148, 152, 211, 215, 300, 331 | 12 |
| `app/admin/feedback/page.tsx` | 80, 95, 107, 151, 187 | 5 |
| `lib/admin-supabase.ts` | 108, 178, 230, 297 | 4 |
| `components/admin/EmailStatusChecker.tsx` | 16, 22, 50, 92 | 4 |
| `app/components/StudyPlan3D.tsx` | 9, 37, 70 | 3 |
| `app/admin/settings/monitoring.tsx` | 9, 64 | 2 |
| `app/admin/settings/page.tsx` | 79, 123 | 2 |
| `lib/email.ts` | 53, 54 | 2 |
| `app/feedback/page.tsx` | 72, 199 | 2 |
| `app/admin/direct-access/page.tsx` | 28 | 1 |
| `app/admin/page.tsx` | 38 | 1 |
| `app/api/admin/dev-login/route.ts` | 89 | 1 |
| `app/api/debug-email/route.ts` | 71 | 1 |
| `app/api/debug-waitlist/route.ts` | 47 | 1 |
| `app/api/email-config/route.ts` | 90 | 1 |
| `app/feedback/api/submit/route.ts` | 52 | 1 |
| `app/hooks/useWaitlistForm.ts` | 193 | 1 |
| `lib/contact.ts` | 42 | 1 |
| `lib/types.ts` | 18 | 1 |

### `react-hooks/exhaustive-deps` (3 warnings)

| File | Line | Issue |
|------|------|-------|
| `app/admin/feedback/page.tsx` | 117 | Missing dependency: `loadFeedback` |
| `app/admin/feedback/page.tsx` | 122 | Missing dependency: `loadFeedback` |
| `app/components/HowItWorks.tsx` | 60 | Ref value `stepsRef.current` may change before cleanup |

### `@next/next/no-img-element` (4 warnings)

| File | Line |
|------|------|
| `app/admin/layout.tsx` | 234 |
| `app/contact/sales/page.tsx` | 74 |
| `app/contact/support/page.tsx` | 71 |
| `app/feedback/page.tsx` | 133 |

### `@next/next/no-page-custom-font` (1 warning)

| File | Line | Issue |
|------|------|-------|
| `app/layout.tsx` | 45 | Google Fonts CDN link in layout instead of using next/font |

---

## Target

- [x] Zero TypeScript errors (`ignoreBuildErrors: false`)
- [x] Zero ESLint errors
- [ ] Zero ESLint warnings
- [ ] Set `ignoreDuringBuilds: false` in `next.config.mjs`
