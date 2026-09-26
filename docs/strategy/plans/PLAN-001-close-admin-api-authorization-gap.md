# PLAN-001: Close the `/api/admin/*` authorization gap
**Status**: ~~Ready~~ Implemented on branch `fix/plan-001-admin-api-auth` (PR opened 2026-09-26). Done when TK merges it and the post-merge check below passes in production.
**Effort**: S · **Risk**: Low

## Context
The admin API is not actually protected. `middleware.ts` declares a matcher that
*includes* `/api/admin/:path*`, but the enforcement logic only fires for
`/admin/*` page routes. `/api/admin/*` requests start with `/api`, miss every
branch, and fall through to `NextResponse.next()` — reaching the handler
unauthenticated. Only handlers that run their own `auth()` check are protected; most
don't. The SWA route config also marks `/api/*` as anonymous
(`staticwebapp.config.json:52-54`), so there is no platform-level backstop.

Impact is limited *today* only because the affected routes return mock data or reset
an in-memory array (`lib/admin-supabase.ts:18-25`). But the pattern means the next
admin route a developer adds ships unauthenticated, and `clear-data` is already an
unauthenticated state-change. Also, the admin *pages* trust a client-settable
`isAdmin` cookie for their UI gate, which is weak defense-in-depth.

## Goal / Non-goals
- **Goal:** Every `/api/admin/*` route requires an authenticated admin (server-side),
  via both a fixed middleware and a per-route guard (defense-in-depth).
- **Goal:** Remove the client-trusted `isAdmin` cookie/localStorage as an *authority*
  (it may remain as a UI hint only if server enforcement is solid).
- **Non-goal:** Redesigning the auth provider or session model — `auth.ts` is sound.
- **Non-goal:** Building real admin data. This plan secures the surface; wiring real
  data is deferred (see `ROADMAP.md` anti-goals).

## Current state
- `middleware.ts:9-40`: branches for `/admin-simple` (bypass, guards a nonexistent
  route), `/api/auth` (allow), `/admin` (enforce). No branch handles `/api/admin`.
  `middleware.ts:42` matcher: `["/admin/:path*", "/api/admin/:path*", "/admin-simple/:path*"]`.
- `app/api/admin/clear-data/route.ts:4-9` — `POST`, no `auth()` check, calls
  `clearAllFeedbackData()`.
- `app/api/admin/email-stats/route.ts`, `ci-status/route.ts` — no `auth()` check
  (return mock data).
- `app/api/admin/email-usage/route.ts:24-28,106-110` — **correct** pattern
  (`auth()` + `session.user.isAdmin` → 401). Use as the template.
- `app/api/admin/dev-auth`, `dev-login`, `direct-access` — `NODE_ENV==="production"`
  gated; leave their gates but they will also gain the middleware guard.
- Client-trust: `app/admin/page.tsx:57-64`, `app/admin/settings/page.tsx:23-28`,
  `app/admin/feedback/page.tsx:56-61` grant access on
  `document.cookie.includes("isAdmin=true")`, not production-gated.

## Target state
- `middleware.ts` enforces admin auth for `/api/admin/*` (returns JSON 401/403, not a
  redirect, since these are API routes) **and** removes the dead `/admin-simple`
  bypass.
- `email-stats`, `ci-status`, `clear-data` each call `auth()` and 401 on non-admin,
  matching `email-usage`.
- Admin page components no longer treat a raw `isAdmin` cookie as proof of admin;
  they rely on the server session (`useSession`) they already import.

## Steps
1. **Fix `middleware.ts`.** Replace the enforcement so it covers both page and API
   admin paths, and remove the `/admin-simple` bypass block (`middleware.ts:11-15`)
   and its matcher entry.
   - Compute `const isApi = path.startsWith("/api/admin")`.
   - Guard condition becomes: `if (path.startsWith("/admin") || isApi)`.
   - Inside: if no `request.auth` → for API return
     `NextResponse.json({ error: "Unauthorized" }, { status: 401 })`; for pages keep
     the existing redirect to `/api/auth/signin`.
   - If `request.auth` but `!request.auth.user?.isAdmin` → for API return
     `NextResponse.json({ error: "Forbidden" }, { status: 403 })`; for pages keep the
     existing 403 `NextResponse`.
   - Update `config.matcher` to `["/admin/:path*", "/api/admin/:path*"]` (drop
     `/admin-simple/:path*`).
2. **Add per-route guards (defense-in-depth)** to the three unprotected routes, using
   the exact shape from `email-usage/route.ts:24-28`:
   ```ts
   import { auth } from "@/auth";
   // at the top of the handler:
   const session = await auth();
   if (!session?.user?.isAdmin) {
     return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
   }
   ```
   Apply to: `app/api/admin/clear-data/route.ts` (`POST`),
   `app/api/admin/email-stats/route.ts` (`GET`),
   `app/api/admin/ci-status/route.ts` (`GET`). Keep imports minimal to satisfy
   `no-unused-vars` (error-level lint).
3. **De-authorize the client cookie.** In `app/admin/page.tsx`,
   `app/admin/settings/page.tsx`, `app/admin/feedback/page.tsx`, remove the
   `document.cookie.includes("isAdmin=true") || localStorage…` branch from the access
   decision. These components already have `useSession`; gate the UI on
   `session?.user?.isAdmin`. The cookie may remain set by the (prod-gated) dev
   endpoints for local convenience, but it must not be the authority. If a component
   currently *only* uses the cookie and has no `useSession`, add the
   `useSession()`/`SessionProvider` usage (the provider is already in the tree via
   `app/providers.tsx`).
4. **Verify the dev endpoints keep their prod gate** (no change expected):
   `dev-auth`, `dev-login`, `direct-access` still return 403 when
   `NODE_ENV==="production"`.

## Security & compliance notes
- **Least privilege:** admin API now fails closed (401/403 by default) at two layers.
- **Audit trail:** `email-usage` already logs the acting admin email on mutation
  (`route.ts:124`); consider the same one-liner in `clear-data` when it does real
  work later. Not required now.
- **No secrets touched.** This is pure authz wiring.

## Validation
- `npm run typecheck && npm run lint` clean (watch `no-unused-vars`).
- `npm run build` succeeds.
- Local manual check with dev server (`npm run dev`):
  - `curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/admin/clear-data`
    → **401** (was 200).
  - `curl … /api/admin/email-stats` → **401** unauthenticated.
  - With a valid admin session cookie, the same calls → 200.
- Add a middleware/authz unit or e2e test asserting an unauthenticated
  `/api/admin/clear-data` POST returns 401 (feeds `PLAN-008`; at minimum add it here
  as the regression guard for this fix).
- Existing `npm test` suite still passes (54 tests).

## Rollback
`git revert` the commit. The change is additive guards + a matcher edit; reverting
restores prior behavior with no data or config migration.

## Execution record (2026-09-26)

Run by Claude Code (HerculeanInfra orchestrator on MBP14), PR-only: TK merges.

### Measured before the change
Production, GET only, ~10:43 AM CDT (no POST was sent to production):

| Route | Status |
|---|---|
| `GET /api/admin/ci-status` | 200, mock workflow data |
| `GET /api/admin/email-stats` | 200, mock email stats |
| `GET /api/admin/email-usage` | 401 (already guarded) |
| `GET /api/admin/dev-login`, `GET /api/admin/direct-access` | 403 (`NODE_ENV=production` gate) |
| `GET /admin` | 307 to `/api/auth/signin`, so **middleware runs in production** and the matcher fix takes effect there |
| `GET /api/auth/session` | 500 `"There was a problem with the server configuration..."` |

`POST /api/admin/clear-data` was not called in production. Against a local
production build it returned 200 and cleared the in-memory store unauthenticated.

**Admin sign-in is broken in production today, and the cause is outside this plan.**
next-auth v5 trusts the request host only when `AUTH_URL`, `AUTH_TRUST_HOST`,
`VERCEL` or `CF_PAGES` is set, or when `NODE_ENV` is not `production`. `NEXTAUTH_URL`
does not count. The production SWA app-setting names include `NEXTAUTH_URL` and
`NEXTAUTH_SECRET` but none of the four, so every `/api/auth/*` action fails with
`UntrustedHost`. Reproduced locally: a production build with `NEXTAUTH_SECRET` and
`NEXTAUTH_URL` set gives the same 500 body (same length, 94 chars) and logs
`UntrustedHost`; adding `AUTH_TRUST_HOST=true` makes `/api/auth/session` answer 200.
The likely fix is an app-setting change (`AUTH_TRUST_HOST=true`, or `AUTH_URL`),
which is TK's call. It has not been verified in production.

**The trade this plan accepts:** once `/api/admin/*` is gated, admins cannot use the
admin API until sign-in works. That locks out nobody who can get in today, since
nobody can sign in.

### Deviations from the plan
1. **Per-route guard: `await auth().catch(() => null)` instead of `await auth()`.**
   If `auth()` throws, the handler now answers 401 instead of 500. A mutation test
   shows this is load-bearing: with `.catch` removed, the "auth() throws -> 401" case
   goes red. `email-usage` (the plan's template) is untouched. A throw there still
   lands in its own `try` as a 500: closed, but not 401.
2. **Settings page required only *any* session, not an admin one.** Its old comment
   said Microsoft sign-in doesn't set `isAdmin`. That is false: `auth.ts` sets it
   for allowlisted emails, and `signIn` rejects everyone else. The access check now
   requires `session.user.isAdmin`. The cookie/localStorage flag survives on that
   page only as a UI label ("Development Mode"), as the plan allows.
3. **An existing test asserted the removed behaviour.** `AdminDashboard.test.tsx`
   "should render dashboard when authenticated with localStorage" is inverted: a
   localStorage/cookie flag must now redirect to sign-in and load no stats. The suite
   is therefore 54 existing tests (one inverted) plus 52 new.
4. **Validation "with a valid admin session cookie -> 200" was run locally, not in
   prod.** Production sign-in is broken, so the positive control used a local
   production build with a throwaway secret and minted session JWTs. Results below.
5. No component-level test was added for the settings and feedback pages (their
   render pulls in fetch-driven children). `AdminLayout` and the middleware already
   gate them server-side.

### Validation results
| Check | Result |
|---|---|
| `npm run lint` | PASS |
| `npm run typecheck` | FAIL, pre-existing and unchanged: the single error `__tests__/lib/admin-supabase.test.ts(1,1): TS2578` is on `main` too; this change adds none |
| `npm test` | PASS 106/106 |
| `__tests__/api/admin-auth.test.ts` against `main` | FAIL as intended: 30 red / 22 green. The 22 are admin pass-through, the page redirect, admin-200s, and the existing `email-usage` and dev-route gates |
| Inverted `AdminDashboard` test against `main` | FAIL as intended (1 red) |
| `npm run build` | PASS |
| Local production build, no session, three auth configs (prod-like `UntrustedHost`, no auth env at all, working auth) | every `/api/admin/*` route and method: **401** (was 200 for `ci-status`, `email-stats`, `clear-data`) |
| Same, **middleware removed** (per-route layer alone, real next-auth, prod-like config) | `ci-status`, `email-stats`, `clear-data`, `email-usage`: 401; dev routes: 403 |
| Local, working auth, minted **non-admin** session | admin API 403, `/admin` 403 |
| Local, working auth, minted **admin** session | admin API 200, `/admin` 200 |
| `/admin-simple` bypass and matcher entry | removed; 404 |
| Production after merge | UNMEASURABLE until TK merges; see the PR's post-merge check |
