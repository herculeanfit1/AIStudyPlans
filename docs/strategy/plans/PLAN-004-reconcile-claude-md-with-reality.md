# PLAN-004: Reconcile CLAUDE.md with reality
**Status**: Ready
**Effort**: M · **Risk**: Low

## Context
`CLAUDE.md` is the first file every future Claude session reads. Several of its
load-bearing claims are wrong, so every session starts from a false map — describing
an architecture that isn't running, a security control that doesn't exist, and a
standards classification that contradicts `STANDARDS.md`. Fixing it is
low-effort and compounds across every future session of every model.

Run this **after** `PLAN-003` (dead-code purge) so the corrected doc describes the
cleaned tree, and **after** `PLAN-000/001/002` so it can state the post-fix security
posture.

## Goal / Non-goals
- **Goal:** `CLAUDE.md` accurately describes the running system, the real data flow,
  the real admin-auth control, and the correct standards classification.
- **Non-goal:** Rewriting the whole file or changing its structure. Targeted edits to
  the drifted claims only.
- **Non-goal:** Making code match the docs (that's `PLAN-006`). Here, docs bend to
  code.

## Current state — the drifted claims (each verified)
1. `CLAUDE.md:112-198` — describes waitlist/contact/feedback as served by the Azure
   Functions backend via CORS. **Reality:** the frontend calls the SWA Next.js routes
   (`app/hooks/useWaitlistForm.ts:133-150` → `${NEXT_PUBLIC_APP_URL}/api/waitlist`).
   Functions serves no production traffic.
2. `CLAUDE.md:96-102` — calls `src/app/` a "secondary/legacy entry point … backup
   layout." **Reality:** it was create-next-app boilerplate, now deleted by
   `PLAN-003`.
3. `CLAUDE.md:166` — "Admin access controlled by `ADMIN_EMAILS` env var." **Reality:**
   `ADMIN_EMAILS` is read by no code; the allowlist is hardcoded in `auth.ts:22-26`.
4. `CLAUDE.md:198` — "Public forms use honeypot fields (`_gotcha`)." **Reality:** no
   honeypot exists.
5. `CLAUDE.md:198` — "API route pipeline (per STANDARDS.md)." **Reality:**
   `STANDARDS.md` has no such guidance.
6. `CLAUDE.md:30` — "Herculean Ecosystem Standards v1.1 (enforced by
   standards-check.yml)." **Reality:** `STANDARDS.md` is the **non-agent v1.0**
   standard whose §2 says `standards-check.yml`, root `STANDARDS.md`, and root
   `CLAUDE.md` are *not* gating for this repo class.
7. `CLAUDE.md:145-153` — lists `lib/csrf.ts` as active. **Reality:** zero importers;
   CSRF is generated but never validated (resolved by `PLAN-007`).

## Target state
Each claim above is corrected to describe reality. The API-architecture section
states plainly: **the Azure SWA Next.js API routes are canonical and serve all
production traffic; the `api/` Azure Functions backend exists but is not in the
request path and is slated for decommission** (points to `PLAN-006` / `ROADMAP.md`
L-1). The standards section states the repo's actual classification (non-agent, per
`STANDARDS.md`) and notes the historical agent-repo machinery still present.

## Steps
1. **API architecture (CLAUDE.md ~112-198):** rewrite the "Split Architecture" and
   "Service Layer & Data Flow" subsections to describe the running system:
   - Waitlist/contact/feedback/health are served by `app/api/*` on the SWA.
   - The data flow is: Client → SWA → Next.js route → `lib/*` → Supabase/Resend.
   - Add a one-line note: "An `api/` Azure Functions backend exists as a parallel,
     currently-unused implementation; it is frozen and slated for decommission — see
     `docs/strategy/` and `PLAN-006`." Do not describe it as the active backend.
2. **Remove the honeypot claim** (`:198`) — no `_gotcha` field exists. If desired as
   a *future* control, phrase it as a TODO, not a statement of fact. (Pre-resolved:
   just remove it; a honeypot can be added later if spam warrants.)
3. **Admin auth (`:166`):** change to "Admin access is controlled by a hardcoded
   allowlist in `auth.ts`; `ADMIN_EMAILS` is documented but not currently wired." If
   `PLAN-001` or a follow-up wires `ADMIN_EMAILS`, update to match — but state today's
   truth now.
4. **Dual app directory section (`:96-102`):** remove — `src/app/` no longer exists
   after `PLAN-003`. Replace with a one-line note that `app/` is the sole app dir.
5. **Standards section (`:30`):** correct to reflect `STANDARDS.md` (non-agent v1.0).
   State that root `STANDARDS.md`/`CLAUDE.md`/`standards-check.yml` are present for
   historical/convenience reasons but are not gating for this repo class per
   `STANDARDS.md:25-35`. Escalate the underlying question to the human as a note:
   "Decide whether this repo should be reclassified as an agent repo or have the
   agent-only machinery removed" — this is a fleet-policy call, not an edit.
6. **`lib/` list (`:145-153`):** mark `csrf.ts` per the outcome of `PLAN-007`. If
   `PLAN-004` runs before `PLAN-007`, note "CSRF token generation exists but is not
   currently validated on any route (under review — see `PLAN-007`)."
7. Cross-check every remaining path in `CLAUDE.md` still resolves after `PLAN-003`
   (e.g. component locations). Fix any now-stale path.

## Security & compliance notes
- No code or secret change. Accurate docs are themselves a compliance asset (they
  prevent a future session from, e.g., adding an unauthenticated admin route believing
  the middleware protects it).

## Validation
- Manual diff review: each of the 7 claims above now matches code. Spot-check with
  grep, e.g. `git grep -n "ADMIN_EMAILS"` returns no code hits, confirming claim 3's
  correction.
- Every file path referenced in `CLAUDE.md` exists:
  `grep -oE '\b[a-zA-Z0-9_./-]+\.(ts|tsx|mjs|json|bicep|sh)\b' CLAUDE.md` → spot-check
  each resolves (allow for the intentional `api/` mention).
- No automated test; this is a documentation-accuracy plan. The proof is the diff.

## Rollback
`git revert`. Documentation-only.
