# SchedulEd — Strategy & Execution Handoff

Strategic review of the AIStudyPlans (SchedulEd) repo, written by Claude Fable 5 for
execution by later Claude Opus sessions with no memory of the review. **Planning
artifacts only — no source was changed.**

## Read in this order
1. **`STRATEGIC_REVIEW.md`** — the assessment: architecture health, tech-debt
   inventory, security posture, risks/opportunities, health verdict (5/10).
2. **`ROADMAP.md`** — Now / Next / Later, sequencing, and explicit anti-goals.
3. **`plans/PLAN-NNN-*.md`** — one self-contained, executable plan per Now/Next item.

## Executing a plan
Open one `PLAN-NNN` file in a fresh session: *"Read
`docs/strategy/plans/PLAN-001-*.md`. Implement exactly as written. Update Status and
record Validation results when done."* One plan per session keeps context clean.

## Execution order (from ROADMAP.md)
**Now:** 000 → 001 → 002 → 003 → 004 → 005. **Next:** 006 → 007 → 008 → 009.

| Plan | Title | Effort · Risk |
|---|---|---|
| PLAN-000 | Rotate & scrub the committed production secret | S/L · Med |
| PLAN-001 | Close the `/api/admin/*` authorization gap | S · Low |
| PLAN-002 | Remove production debug endpoints | S · Low |
| PLAN-003 | Purge dead code & tracked junk | M · Low |
| PLAN-004 | Reconcile CLAUDE.md with reality | M · Low |
| PLAN-005 | Add a CI validation gate | S · Low |
| PLAN-006 | Declare SWA canonical; freeze the Functions backend | M · Med |
| PLAN-007 | Resolve CSRF & fix rate-limiting for Azure edge | M · Low |
| PLAN-008 | Kill test theater & backfill critical-path tests | M · Low |
| PLAN-009 | Consolidate docs & seed an ADR system | M · Low |

## Do first, before touching any plan
**PLAN-000.** A live Resend API key is committed in `update-production-env.sh` and is
weekly-mirrored to the backup repo. Rotate it before anything else.

## Anti-goals (don't drift — see ROADMAP.md)
Don't migrate the frontend onto the Functions backend; don't rewrite working
components during cleanup; don't bundle dependency majors; don't delete Azure infra
before the L-1 trigger; don't add `/api/admin/*` routes before PLAN-001.
