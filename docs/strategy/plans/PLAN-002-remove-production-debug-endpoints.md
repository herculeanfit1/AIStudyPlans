# PLAN-002: Remove production debug endpoints
**Status**: Ready
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
