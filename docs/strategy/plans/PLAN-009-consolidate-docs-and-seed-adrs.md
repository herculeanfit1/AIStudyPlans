# PLAN-009: Consolidate docs & seed an ADR system
**Status**: Ready (do after `PLAN-003`, `PLAN-004`, `PLAN-006`)
**Effort**: M · **Risk**: Low

## Context
`docs/` holds 51 files plus a scatter of root-level notes. Many are point-in-time
fix logs (`build-error-resolution.md`, `typescript-fixes-summary.md`,
`static-export-api-fix.md`, `nextauth-static-export.md`), and there are large
redundant clusters: 9 dependency docs, 5 email docs, 3 typescript-fix docs, 6+
TODO/status/plan trackers. Crucially, **there is no `docs/adr/` or `docs/decisions/`**
— the "why" of every architectural choice is either unrecorded or buried in a fix
log. This review just made several durable decisions (SWA canonical, CSRF removal,
secret rotation) that must be captured where a future session will find them.

Run this **after** the plans whose decisions it records (`PLAN-003/004/006`, and
ideally `PLAN-000/007`).

## Goal / Non-goals
- **Goal:** A lightweight ADR system under `docs/adr/`, seeded with the decisions
  from this review.
- **Goal:** The docs graveyard pruned/archived so living reference docs are findable.
- **Non-goal:** Rewriting the good reference docs (`API.md`, `CODEBASE.md`,
  `COMPONENTS.md`, `docs/security/*`, `prd.md`). Leave content; only relocate the
  cruft around them.
- **Non-goal:** Deleting history. Point-in-time logs move to `docs/archive/`, not the
  bin, unless clearly worthless.

## Current state
- No ADR directory.
- Root transient notes: `ci-cd-fixes.md`, `dependency-report.md`, `email-setup.md`,
  `fix-supabase-rls.md`, `todo.md`.
- `docs/` clusters: dependency ×9 (`dependency-*.md`, `zod-installation-checklist.md`),
  email ×5 (`EMAIL.md`, `EMAIL_RELAY.md`, `email-relay-setup.md`,
  `email-config-fix.md`, + root `email-setup.md`), typescript-fix ×3, trackers
  (`MASTER-TODO.md`, `TODO.md`, `typescript-todo.md`, `v2-implementation-plan.md`,
  `project-status.md`, `production-readiness.md`).
- Living reference: `API.md`, `API-ARCHITECTURE.md`, `CODEBASE.md`, `COMPONENTS.md`,
  `NEXT-APP-ROUTER.md`, `docs/security/*` (7), `prd.md`.

## Target state
- `docs/adr/0000-template.md` + seeded ADRs (see Steps).
- `docs/archive/` holding the point-in-time fix logs and superseded trackers.
- One consolidated `docs/DEPENDENCIES.md` and one `docs/EMAIL.md` (or a clear
  index) replacing the 9+5 sprawl; originals archived.
- Root transient notes moved into `docs/` or `docs/archive/`; root holds only
  `README.md`, `CLAUDE.md`, `STANDARDS.md`.
- `docs/strategy/` (this review) referenced from `CLAUDE.md` and `README.md`.

## Steps
1. **Create the ADR system.**
   - `docs/adr/0000-template.md` — a minimal MADR-style template: Title, Status
     (Proposed/Accepted/Superseded), Context, Decision, Consequences, Date.
   - Seed these ADRs (each ~1 screen), marked **Accepted**, dated 2026-07-03,
     cross-linking the plan that implements them:
     - `0001-swa-api-routes-are-canonical.md` — from `PLAN-006`. Record the decision,
       the reasons, and the L-1 teardown trigger for the Functions backend.
     - `0002-remove-decorative-csrf.md` — from `PLAN-007`. Record why anonymous forms
       don't need CSRF and admin is SameSite+session protected; note "revisit if a
       cookie-authenticated cross-origin mutation is added."
     - `0003-ci-validation-gate.md` — from `PLAN-005`. Record that deploy is
       gated by a PR validation workflow; deploy stays deploy-only.
     - `0004-in-repo-secret-rotation-2026-07.md` — from `PLAN-000`. An
       incident/decision record: what was exposed, that it was rotated, and the
       history-scrub decision the operator made. (Do **not** include secret values.)
2. **Create `docs/archive/`** and `git mv` the point-in-time logs into it:
   `build-error-resolution.md`, `typescript-fixes-summary.md`,
   `typescript-fix-progress.md`, `typescript-todo.md`, `static-export-api-fix.md`,
   `nextauth-static-export.md`, `email-config-fix.md`, `ci-cd-implementation-report.md`,
   and the superseded dependency-*.md once consolidated (Step 3). Keep them in git
   history; archiving just declutters the active dir.
3. **Consolidate clusters.**
   - Dependency docs: create `docs/DEPENDENCIES.md` that states the current policy
     (exact pins, shrinkwrap, Dependabot, the L-2 upgrade campaign) and links to the
     archived detail. `git mv` the 9 source docs to `docs/archive/`.
   - Email docs: create/keep a single `docs/EMAIL.md` as the canonical email setup +
     relay reference; archive the other 4.
4. **Relocate root transient notes:** `git mv ci-cd-fixes.md dependency-report.md
   email-setup.md fix-supabase-rls.md todo.md docs/archive/` (fold anything still
   true into the consolidated docs first — e.g. `fix-supabase-rls.md`'s RLS guidance
   into `docs/security/` since `PLAN-000` Step 2 depends on RLS being correct).
5. **Wire discoverability:** add a "Strategy & decisions" line to `README.md` and
   `CLAUDE.md` pointing at `docs/strategy/` and `docs/adr/`.
6. **Prune the trackers:** `MASTER-TODO.md`/`TODO.md`/`project-status.md` are stale
   snapshots — archive them; the live roadmap is now `docs/strategy/ROADMAP.md`. Note
   in the archive that `docs/strategy/` supersedes them.

## Security & compliance notes
- ADRs are **SOC 2 evidence** (documented decision-making). `0004` is
  incident-response evidence for the secret rotation — keep it factual and
  value-free.
- No code or secret change. When folding `fix-supabase-rls.md` into
  `docs/security/`, do not paste any connection string or key — reference by name.

## Validation
- `docs/adr/` contains the template + 4 seeded ADRs; each links its implementing
  plan.
- `ls docs/*.md | wc -l` is materially smaller; the active `docs/` root holds
  reference docs + `DEPENDENCIES.md` + `EMAIL.md`, not the fix-log sprawl.
- Root dir holds only `README.md`, `CLAUDE.md`, `STANDARDS.md` (plus non-doc files).
- `README.md` and `CLAUDE.md` link to `docs/strategy/` and `docs/adr/`.
- No broken relative links: `git grep -oE '\]\(\.?\.?/?docs/[^)]+\)'` — spot-check
  moved targets resolve.

## Rollback
All `git mv`/additions; `git revert` restores prior layout. Pure documentation.
