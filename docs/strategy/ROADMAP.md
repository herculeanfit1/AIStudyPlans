# SchedulEd (AIStudyPlans) — Roadmap

**Companion to** `STRATEGIC_REVIEW.md`. Each Now/Next item has a `plans/PLAN-NNN-*.md`
with pre-resolved, executable steps. Later items are triggers, not yet plans.

**Sequencing principle:** boring and reversible first. Security exposure (secret,
auth) → hygiene/truth (dead code, docs, CI gate) → structural consolidation
(backend, tests) → strategic bets (upgrades, infra teardown).

---

## NOW (0–30 days) — highest leverage, lowest risk

| # | Plan | Effort | Risk | Why now |
|---|---|---|---|---|
| 0 | **PLAN-000 — Rotate & scrub the committed secret** | S (rotate) / L (scrub) | Med | A live Resend key sits in git + weekly backups. This is the only *actively exploitable* item. Do it first. |
| 1 | **PLAN-001 — Close the `/api/admin/*` authorization gap** | S | Low | Two HIGH auth findings; surgical middleware + per-route fix. |
| 2 | **PLAN-002 — Remove production debug endpoints** | S | Low | Ungated env/config disclosure; pure deletion. |
| 3 | **PLAN-003 — Purge dead code & tracked junk** | M | Low | 37 `.bak`, `src/` boilerplate, junk files. Deletion only; git is the rollback. Makes every later plan cheaper. |
| 4 | **PLAN-004 — Reconcile CLAUDE.md with reality** | M | Low | Every future session reads it first; fixing it compounds. |
| 5 | **PLAN-005 — Add a CI validation gate** | S | Low | Make the existing passing tests actually protect the deploy. |

**Ordering within Now:** `PLAN-000` is independent and first. `PLAN-001`/`002` are
independent security fixes (any order). `PLAN-003` should land **before** `PLAN-004`
(deleting dead files changes what the docs must describe) and gives `PLAN-005` a
clean tree to gate. `PLAN-005` should land **after** `003` so the first gated build
isn't fighting lint errors in soon-to-be-deleted files.

Recommended execution order: **000 → 001 → 002 → 003 → 004 → 005.**

---

## NEXT (30–90 days) — structural moves

| # | Plan | Effort | Risk | Depends on |
|---|---|---|---|---|
| 6 | **PLAN-006 — Declare SWA API routes canonical; freeze the Functions backend** | M | Med | 004 (docs must first tell the truth about the split) |
| 7 | **PLAN-007 — Resolve CSRF + fix rate-limiting for Azure edge** | M | Low | 001, 006 (touches the canonical route set) |
| 8 | **PLAN-008 — Kill test theater & backfill critical-path tests** | M | Low | 005 (gate must exist for tests to protect anything) |
| 9 | **PLAN-009 — Consolidate docs & seed an ADR system** | M | Low | 003, 004, 006 (ADRs record the decisions those plans make) |

**The load-bearing decision (pre-resolved in PLAN-006):** the **Azure SWA Next.js
API routes are canonical**; the standalone Azure Functions backend (`api/`) is
frozen and marked for decommission. Rationale: the frontend already calls the SWA
routes exclusively (`app/hooks/useWaitlistForm.ts:133-150`), the Functions copy
serves zero traffic, SWA managed functions are more than adequate for waitlist
volume, and maintaining two divergent trees is the repo's biggest bug vector.
Consolidating *toward reality* is lower-risk than migrating the frontend to the
documented-but-unused Functions path. PLAN-006 does the low-risk half (declare +
de-duplicate + freeze); the actual infra teardown is a Later item with a trigger.

---

## LATER (90 days+) — strategic bets, each gated by a trigger

- **L-1. Decommission the Azure Functions backend infrastructure.**
  *Trigger:* PLAN-006 shipped **and** SWA routes confirmed serving 100% of prod
  traffic for 30 days with no consumer needing Functions. *Then:* delete `api/`,
  remove the Functions/Storage resources from `infra/main.bicep`, retire the
  `func-btai-asp-prod` KV references. Reversible until the `az deployment`;
  irreversible after — hence the wait.

- **L-2. Breaking-major dependency upgrade campaign.** Held majors:
  `next 15→16`, `tailwindcss 3→4`, `eslint 9→10`, `vitest 3→4`, `zod 3→4`,
  `@types/node 20→22/26`, `typescript 5→6`, `@vitejs/plugin-react 4→6`,
  `react-intersection-observer 9→10`. *Trigger:* PLAN-008 shipped (real tests give
  the safety net an upgrade campaign requires). *Sequence:* one PR per major, lowest
  blast-radius first (`@types/node`, `zod`, `vitest`), highest last (`next`,
  `tailwind` — see BTAISite CLAUDE.md "Critical: Tailwind CSS v4 Rules" **before**
  touching Tailwind). `next-auth` beta→stable is part of the `next` upgrade PR.
  Do **not** bundle majors.

- **L-3. Collapse the two landing implementations into one.**
  *Trigger:* a product decision on which page (`/` vs `/landing`) is canonical.
  *Then:* delete the losing component set and its route. Blocked on a human product
  call, not an engineering one.

- **L-4. Durable rate limiting + email quota (Redis/Upstash).**
  *Trigger:* observed abuse **or** waitlist volume high enough that per-instance
  in-memory limits demonstrably fail (App Insights shows limit resets/multiplication
  causing either bypass or false blocks). Until then, the in-memory limiter is
  adequate for the volume and not worth an external dependency.

- **L-5. Move Supabase writes behind the server with least privilege.**
  *Trigger:* any move to store real (non-mock) admin/contact data, or a SOC 2
  access-control control that requires it. *Then:* writes go through the server using
  the service-role key with verified RLS, not the client-exposed anon key.

---

## Anti-goals — what NOT to do (and why)

- **Do NOT migrate the frontend to call the Azure Functions backend** to "make the
  docs true." The docs are wrong, not the code. Fix the docs (`PLAN-004`) and
  consolidate toward the running system (`PLAN-006`). Migrating live traffic onto
  the untested Functions copy would add risk to serve zero benefit.

- **Do NOT rewrite, restructure, or "modernize" working component code** while
  cleaning up. `PLAN-003` is deletion of dead files only. Resist the urge to refactor
  `Hero`, the email templates, or the admin pages in the same pass — that turns a
  reversible cleanup into a risky change.

- **Do NOT bundle dependency majors** (see L-2). Each major (Next, Tailwind, ESLint,
  Zod, Vitest) is its own PR with its own rollback. A combined bump is
  unbisectable.

- **Do NOT delete the Azure Functions infra in the Now/Next window.** Freeze it
  (`PLAN-006`), confirm traffic (L-1 trigger), then tear down. Deleting live cloud
  infra before confirming nothing depends on it is the one genuinely irreversible
  move here.

- **Do NOT invest in the admin dashboard's mock data paths** (`email-stats`
  hardcoded, `admin-supabase` in-memory) as if they were real. Either wire real data
  *with* auth (`PLAN-001` first) or leave them clearly labeled as mock. Building
  features on the mock deepens the auth-gap risk.

- **Do NOT add new API endpoints under `app/api/admin/` until `PLAN-001` lands.**
  They would silently inherit the middleware bypass and ship unauthenticated.

- **Do NOT "fix" security by re-enabling the decorative CSRF** without deciding it's
  actually needed. `PLAN-007` resolves the CSRF question deliberately; half-wiring a
  validator that clients don't send tokens for adds friction without protection.
