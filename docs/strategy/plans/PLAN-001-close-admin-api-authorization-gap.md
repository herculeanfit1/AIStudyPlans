# PLAN-001: Close the `/api/admin/*` authorization gap
**Status**: Ready
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
