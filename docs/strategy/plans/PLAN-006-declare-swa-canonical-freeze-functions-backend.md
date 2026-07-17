# PLAN-006: Declare SWA API routes canonical; freeze the Functions backend
**Status**: Ready
**Effort**: M · **Risk**: Med

## Context
The repo has two full backend implementations of the same endpoints:
- **SWA Next.js routes** (`app/api/*` + `lib/*`) — **the ones the frontend actually
  calls in production** (`app/hooks/useWaitlistForm.ts:133-150` posts to
  `${NEXT_PUBLIC_APP_URL}/api/waitlist`; contact/feedback likewise).
- **Standalone Azure Functions** (`api/src/*`) — deployed as `func-btai-asp-prod`,
  but **called by no frontend code**. Verified: no `fetch` in the app targets the
  Functions host; `NEXT_PUBLIC_APP_URL` is the SWA domain, not the Functions URL.

Nine `lib/` files are byte-identical across the two trees; `rate-limit.ts` has
already diverged 143 lines. This duplication is the review's #1 structural risk: every
fix must be done twice or the copies rot, and one copy is dead.

**This plan resolves the direction and stops the bleed. It does not tear down cloud
infrastructure** — that is `ROADMAP.md` L-1, gated on confirming traffic, because
deleting live Azure resources is the one irreversible move in this whole review.

## The decision (pre-resolved — do not re-litigate)
**The Azure SWA Next.js API routes are canonical. The `api/` Azure Functions backend
is frozen and slated for decommission.**

Why this direction and not the reverse (migrating the frontend onto Functions, which
is what `CLAUDE.md` *documents*):
1. The SWA routes already serve 100% of production traffic. Consolidating toward the
   running system is lower-risk than repointing live traffic onto the untested
   Functions copy (`api/` has **zero tests** — no test script in `api/package.json`).
2. SWA managed functions comfortably handle waitlist-funnel volume; the Functions app
   is over-provisioned for the load.
3. The documented rationale for the split (`CLAUDE.md:130-134`) is only that NextAuth
   must stay on SWA. Under "SWA canonical," *everything* stays on SWA, which fully
   satisfies that constraint — the split it argues for isn't needed.

**Assumption stated (cannot see from the repo):** that there is no business/cost
reason the Functions backend was chosen (e.g., a plan to share it with another
product, or a cost model that favors Flex Consumption). If such a reason exists, the
operator should surface it before L-1 teardown — but it does **not** change this
plan's low-risk half (freeze + de-dup toward SWA), which is correct either way.

## Goal / Non-goals
- **Goal:** One canonical backend (SWA); the other frozen and clearly marked, so
  drift stops.
- **Goal:** `CLAUDE.md` and a new ADR record the decision.
- **Non-goal:** Deleting `api/` or its Azure infra (that's L-1, trigger-gated).
- **Non-goal:** Extracting a shared code package for the two trees. Do **not** build a
  shared lib — investing in sharing code between a canonical tree and a
  decommission-bound tree is wasted effort. The right move is to stop touching the
  dead tree, not to couple them more cleanly.

## Current state
- `app/api/{waitlist,contact/sales,contact/support,feedback-campaign,health}/route.ts`
  + `app/feedback/api/submit/route.ts` — live, frontend-called.
- `api/src/functions/{waitlist,contactSales,contactSupport,feedbackCampaign,feedbackSubmit,health}.ts`
  — deployed, unused.
- `api/src/lib/*` — 9 files byte-identical to `lib/*`; `rate-limit.ts` diverged.
- No CI workflow deploys the Functions app (manual `az`/`func` per `CLAUDE.md`), so
  "freezing" needs no pipeline change.
- `infra/main.bicep` provisions the Functions/Storage/App Insights + KV refs.

## Target state
- A `FROZEN.md` (or header banner) in `api/` states: "This Azure Functions backend is
  frozen and slated for decommission (see `docs/strategy/ROADMAP.md` L-1). It serves
  no production traffic. Do not add features here; make backend changes in the SWA
  `app/api/*` routes." 
- `CLAUDE.md` updated per `PLAN-004` to name SWA as canonical.
- An ADR (`PLAN-009`) records the decision and its trigger for teardown.
- `rate-limit.ts` divergence noted (the SWA copy is canonical; the `api/` copy is
  frozen as-is — do **not** spend effort reconciling a frozen file).

## Steps
1. **Confirm the reality once more before acting** (the decision rests on it):
   - `git grep -nE "func-btai-asp-prod|azurewebsites\.net|NEXT_PUBLIC_API" app/ components/ lib/`
     → confirm no frontend `fetch` targets the Functions host. (If this surprises and
     something *does* call Functions, **stop** and re-scope — but recon says it does
     not.)
2. **Add `api/FROZEN.md`** with the banner text above and a link to
   `docs/strategy/ROADMAP.md`.
3. **Add a top-of-file comment** to each `api/src/functions/*.ts` handler:
   `// FROZEN — not in production request path. See api/FROZEN.md. Make changes in app/api/*.`
4. **Update `CLAUDE.md`** (coordinate with `PLAN-004`) so the API-architecture
   section names SWA canonical and Functions decommission-pending.
5. **Do not** modify `infra/main.bicep`, delete `api/`, or change Azure resources.
   Leave the deployed Functions app running until L-1's trigger fires (removing it now
   risks an unknown dependency; leaving it costs little at Flex Consumption idle).
6. **Record the L-1 teardown trigger** explicitly in the ADR: "Decommission when SWA
   routes confirmed serving 100% of prod traffic for 30 days (verify via App Insights
   request logs on both the SWA and the Functions app) and no other consumer is
   found."

## Security & compliance notes
- Freezing reduces the maintained attack surface to one backend. The frozen
  Functions app remains deployed and anonymous (`authLevel:"anonymous"`) — note in the
  ADR that its public endpoints (waitlist/contact/feedback) are still reachable
  directly by URL even though the frontend doesn't use them, so its abuse surface
  (email-bomb, `feedbackSubmit` IDOR) persists until L-1. If that residual surface is
  a concern before teardown, the operator can disable the Functions app in Azure
  (stop, don't delete) as an interim step — flag as an operator option, not required.
- No secrets touched.

## Validation
- `api/FROZEN.md` exists and is referenced from `CLAUDE.md` and the ADR.
- Every `api/src/functions/*.ts` carries the FROZEN header comment.
- `git grep` confirms (again) no frontend call to the Functions host.
- No infra or deploy behavior changed: `npm run build` and the SWA deploy are
  unaffected (this plan touches only `api/` docs/comments + `CLAUDE.md`).

## Rollback
Documentation/comment-only; `git revert` restores. The decision is reversible on
paper until L-1 executes the (irreversible) infra teardown — which is deliberately
out of scope here.
