# PLAN-002: Remove production debug endpoints
**Status**: ~~Ready~~ Implemented on branch `fix/plan-002-remove-debug-endpoints` (PR opened 2026-09-26). Done when TK merges it and the post-merge check below passes in production.
**Effort**: S · **Risk**: Low

## Context
Several `/api/*debug*` routes ship to production ungated and disclose environment
and configuration details. The worst returns the first and last 3 characters of the
live Resend API key. These routes are not covered by the `middleware.ts` matcher, so
they are fully public. They exist for one-time troubleshooting that is long over; the
information they leak aids an attacker and provides no ongoing value.

## Goal / Non-goals
- **Goal:** No production endpoint discloses secrets, secret fragments, env-var
  presence, or auth configuration.
- **Non-goal:** Removing legitimate operational endpoints. `/api/health` stays (it
  returns only status/version). `/api/email-config` is already dev-gated for its
  detailed branch and returns only a boolean otherwise — keep it.

## Current state
Ungated / disclosing (verified by reading each file):
- `app/api/debug-env/route.ts:26-28` — returns Resend key prefix+suffix, email
  config; `runtime="edge"`; **no** prod gate.
- `app/api/debug-waitlist/route.ts:23-28` — echoes env presence (supabase/resend/
  email_from); `runtime="edge"`; **no** prod gate.
- `app/api/auth/debug/route.ts:5-27` — echoes Azure AD / NextAuth config presence,
  `NEXTAUTH_URL` value, `NODE_ENV`, a hardcoded admin email; **no** prod gate.
- `app/api/debug-email/route.ts:12` — gated by
  `NODE_ENV==="development" || DEBUG_EMAIL==="true"` (so it can be turned on in prod
  via the `DEBUG_EMAIL` flag); logs env details.

Keep as-is:
- `app/api/health/route.ts` — status/version only.
- `app/api/email-config/route.ts` — boolean-only outside development.

## Target state
- `debug-env`, `debug-waitlist`, `auth/debug` route directories deleted.
- `debug-email` either deleted or hard-gated to `NODE_ENV==="development"` only
  (remove the `DEBUG_EMAIL` prod escape hatch). **Pre-resolved choice: delete it** —
  email delivery is confirmed working (its own header comment says to remove it once
  confirmed), and `PLAN-008` will add a proper email-path test.

## Steps
1. `git rm -r app/api/debug-env app/api/debug-waitlist app/api/auth/debug app/api/debug-email`.
2. Grep for any references to these routes so nothing 404s silently:
   `git grep -nE "debug-env|debug-waitlist|auth/debug|debug-email"` across
   `app/`, `components/`, `lib/`, `e2e/`, `scripts/`, `docs/`. Expected: only doc
   mentions. Remove/adjust any live `fetch()` to them (none expected — these were
   manual-curl endpoints).
3. If any `staticwebapp.config.json` route rule names these paths, remove it (none
   expected — its rules are generic `/api/*`).
4. Leave `health` and `email-config` untouched.

## Security & compliance notes
- Removes a partial-secret disclosure and config-enumeration surface. Complements
  `PLAN-000` (rotating the key makes the leaked fragment worthless; deleting the
  route removes the leak entirely).
- No least-privilege or data-handling change beyond deletion.

## Validation
- `git grep -nE "debug-env|debug-waitlist|auth/debug|debug-email"` returns no
  code references (doc-only mentions are acceptable and handled by `PLAN-004`/`009`).
- `npm run build` succeeds (no dangling imports).
- Local: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/debug-env`
  → **404**.
- `curl … /api/health` → 200 (unchanged).

## Rollback
`git revert` the deletion commit restores the routes verbatim. No state involved.

## Execution record (2026-09-26)

Run by Claude Code (HerculeanInfra orchestrator on MBP14), PR-only: TK merges.

### Measured exposure before the change
Production, GET only, ~10:43 AM CDT. Shapes only (key names, value lengths), never
values.

| Route | Status | What it disclosed |
|---|---|---|
| `/api/debug-env` | 200 | `emailConfig.{fromEmailValue,replyToValue}` = 3-char prefixes of the two email settings; `resendApiKeyPrefix` = the 7-char string `not set` (no Resend key is configured in prod, so no key fragment leaked today); request host, node version |
| `/api/auth/debug` | 200 | Azure AD / NextAuth config presence, the `NEXTAUTH_URL` value (24 chars), `NODE_ENV`, and `allowedEmails` = one hardcoded admin address (41 chars) |
| `/api/debug-waitlist` | 405 to GET | POST-only, so not probed in prod. Per its code it echoes env presence and `EMAIL_FROM` in full; a local `next start` returned 200 |
| `/api/debug-email` | 405 to GET | POST-only, so not probed in prod. Inferred 403 there: its gate needs `NODE_ENV=development` or `DEBUG_EMAIL=true`, and `DEBUG_EMAIL` is not among the SWA app-setting names; a local `next start` with `NODE_ENV=production` returned 403 |

### Deviations from the plan
1. **A live caller existed (the plan expected none).** `components/admin/EmailStatusChecker.tsx`
   POSTed to `/api/debug-email` from the admin settings "Test Email Delivery" form.
   Per Step 2 ("remove/adjust any live `fetch()`"), the form, its handler and its state
   were removed; the configuration-status panel (reads `/api/email-config`) stays. No
   working capability is lost: in production the route answered 403.
2. **`/api/auth/debug` answers 400, not 404.** With its route file gone, the path falls
   through to `app/api/auth/[...nextauth]`, which returns next-auth's generic
   `"Bad request."` (400). Nothing is disclosed. The Validation section's 404
   expectation holds for the other three.
3. **Not in the plan: `api/debug-env/` (Azure Functions, v3 `function.json` model).**
   Same disclosure code, but it is NOT deployed: the live Functions app lists six
   functions (`contactSales`, `contactSupport`, `feedbackCampaign`, `feedbackSubmit`,
   `health`, `waitlist`) and no `debug-env` (control-plane read, 2026-09-26). Left in
   place as dead code for PLAN-003, together with `test-api-local.cjs`, which requires
   a file that does not exist (`./api/debug-env/index.js`).
4. The local HTTP check ran against `next start` (production build, `NODE_ENV=production`)
   rather than `next dev`, so it exercises what SWA serves.

### Validation results
| Check | Result |
|---|---|
| `git grep -nE "debug-env\|debug-waitlist\|auth/debug\|debug-email"` outside `docs/` | PASS: only `api/debug-env/index.cjs`, `test-api-local.cjs` (deviation 3) and an explanatory comment in `EmailStatusChecker.tsx` |
| `staticwebapp.config.json` names none of the paths | PASS (rules are generic `/api/*`) |
| `npm run lint` | PASS |
| `npm run typecheck` | FAIL, pre-existing and unchanged: the single error `__tests__/lib/admin-supabase.test.ts(1,1): TS2578 Unused '@ts-expect-error'` is on `main` too; this change adds none |
| `npm test` | PASS, 60/60 (54 existing + 6 new in `__tests__/api/debug-endpoints-removed.test.ts`) |
| New test on `main` (before the deletion) | FAIL as intended: 5 of 6 red; the non-vacuity check passes |
| `npm run build` | PASS; the four routes are gone from the route table |
| `next start`: `/api/debug-env`, `/api/debug-waitlist`, `/api/debug-email` | 404 (were 200 / 200 / 403) |
| `next start`: `/api/auth/debug` | 400 `"Bad request."` (was 200 with config) |
| `next start`: `/api/health`, `/api/email-config` | 200, unchanged |
| Production after merge | UNMEASURABLE until TK merges; see the PR's post-merge check |
