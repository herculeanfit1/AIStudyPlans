# PLAN-007: Resolve CSRF & fix rate-limiting for Azure edge
**Status**: Ready
**Effort**: M · **Risk**: Low

## Context
Two related public-endpoint hardening items, both currently in a false state:

1. **CSRF is decorative.** A full validator exists (`lib/csrf.ts:69-110`) but has
   **zero importers**; `app/api/csrf/route.ts` just returns a `crypto.randomUUID()`
   with no cookie set and no server-side storage. No state-changing route validates a
   CSRF token. This is worse than absent — it reads as "we have CSRF" when we don't.

2. **Rate limiting is coarse and edge-broken.** `lib/rate-limit.ts:50-55`, in
   production, truncates the client IP to its first two octets
   (`ip.split(".").slice(0,2).join(".") + ".x.x"`), collapsing every user in the same
   `/16` into one bucket — so legitimate users behind a shared range get false-blocked,
   while an attacker rotates to a different `/16` to evade. It also reads the entire
   `x-forwarded-for` header as the key; behind Azure's edge the header is
   `client_ip, edge_ip`, so the key is polluted. (It is also in-memory/per-instance —
   that limitation is real but out of scope here; the durable-store move is
   `ROADMAP.md` L-4, trigger-gated.)

Fix only the **canonical SWA copy** (`lib/rate-limit.ts`); the `api/` copy is frozen
(`PLAN-006`).

## The decisions (pre-resolved)
- **CSRF: remove it, don't half-wire it.** The public forms (waitlist, contact,
  feedback) are anonymous and session-less — classic CSRF (riding a victim's ambient
  auth cookie) does not apply, so a token adds friction with no protection. The admin
  mutations run under a NextAuth session cookie that is `SameSite` by default, which
  already blocks cross-site form POSTs, and are now authz-gated by `PLAN-001`. So the
  decorative CSRF protects nothing that isn't already protected. **Delete
  `lib/csrf.ts` and `app/api/csrf/route.ts`.** If a future feature adds a
  sensitive, cookie-authenticated cross-origin mutation, add CSRF then — deliberately,
  wired end-to-end.
- **Rate limiting: keep in-memory, fix the key.** Parse `x-forwarded-for` correctly
  (first IP), and replace the `/16` truncation with a salted hash of the full client
  IP — preserving per-client granularity while not storing raw IPs (the stated
  privacy goal). Durable cross-instance limiting is L-4, not now.

## Current state
- `lib/csrf.ts` (126 lines) — `generateCsrfToken`/`validateCsrfToken`, 0 importers.
- `app/api/csrf/route.ts` — GET returns a UUID; rate-limited; no cookie/storage.
- `lib/rate-limit.ts:48-55` — IP extraction + `/16` truncation in production.
- Consumers of `rateLimit(...)`: `app/api/waitlist/route.ts:34`,
  `app/api/csrf/route.ts` (being deleted), `app/api/contact/*`, and others. The
  function signature stays the same; only its internal keying changes.

## Target state
- No `lib/csrf.ts`, no `app/api/csrf` route, no dangling imports.
- `lib/rate-limit.ts` keys on `sha256(salt + firstXffIp)`; no `/16` collapse; same
  public `rateLimit(request, config)` signature so callers are unchanged.

## Steps
1. **Remove CSRF.**
   - `git grep -nE "csrf|Csrf|CSRF"` across `app/`, `components/`, `lib/`, `e2e/` to
     confirm the only references are `lib/csrf.ts` and `app/api/csrf/route.ts`
     themselves (recon says so). Remove any incidental import if one appears.
   - `git rm lib/csrf.ts && git rm -r app/api/csrf`.
   - If `staticwebapp.config.json` names `/api/csrf`, remove that rule (none
     expected).
2. **Fix IP extraction in `lib/rate-limit.ts`:**
   - Replace the header read with: take `x-forwarded-for`, split on `,`, use the
     **first** entry trimmed; fall back to `x-real-ip`, then `"unknown"`.
   - Replace the production `/16` truncation block (`:50-55`) with a salted hash:
     ```ts
     import { createHash } from "crypto";
     const salt = process.env.RATE_LIMIT_SALT ?? "";
     const key = createHash("sha256").update(salt + clientIp).digest("hex");
     ```
     Use `key` (not the raw IP) as the map key in all environments. This removes the
     privacy motivation for truncation (raw IP is never stored) while keeping
     per-client granularity.
   - Add `RATE_LIMIT_SALT` to `.env.example` and to the SWA app settings (a non-secret
     random string; if absent the limiter still works, just unsalted).
   - Keep the in-memory `Map`, the `setInterval` cleanup, and the
     `DISABLE_RATE_LIMIT` dev escape unchanged.
   - Fix the stale doc comment (`lib/rate-limit.ts` says `windowMs` is "in seconds"
     but callers pass milliseconds, e.g. `60*60*1000`) — correct the comment to
     milliseconds; do **not** change the numeric behavior.
3. **Do not touch `api/src/lib/rate-limit.ts`** (frozen per `PLAN-006`).

## Security & compliance notes
- Removing decorative CSRF eliminates false assurance; document the rationale in the
  ADR (`PLAN-009`) so a future reviewer doesn't "add CSRF back" without cause.
- Salted-hash keying is a small **privacy improvement** (no raw IPs in memory) and a
  **correctness improvement** (real per-client limiting) — note both as SOC 2
  data-minimization + abuse-control evidence.
- Residual: per-instance in-memory limits still multiply across instances; L-4
  addresses it when volume warrants. State this honestly in the ADR.

## Validation
- `git grep -niE "csrf"` → no code references remain.
- `npm run build && npm run typecheck && npm run lint` clean.
- Add unit tests (feeds `PLAN-008`) for `lib/rate-limit.ts`:
  - Same `x-forwarded-for` first-IP → shares a bucket; different first-IP → separate
    buckets (no `/16` collapse: `1.2.3.4` and `1.2.9.9` must be **different** keys).
  - Exceeding `limit` within `windowMs` returns a 429 `NextResponse`; under the limit
    returns `null`.
- Local: `curl` the waitlist endpoint 6× rapidly from the same simulated
  `X-Forwarded-For: 1.2.3.4` → the 6th returns 429; a request with `1.2.9.9` is not
  blocked (proving no `/16` collapse).

## Rollback
`git revert`. CSRF removal and the rate-limit keying change are independent commits —
revert either alone. The `rateLimit()` signature is unchanged, so callers need no
rollback.
