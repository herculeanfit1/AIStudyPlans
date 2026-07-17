# PLAN-005: Add a CI validation gate
**Status**: Ready
**Effort**: S · **Risk**: Low

## Context
CI is deploy-only: `azure-static-web-apps.yml` builds and deploys on push to `main`
and runs **no** lint, typecheck, or tests (its header comment says validation "runs
locally before push"). The only enforcement is the developer running
`scripts/validate-before-push.sh` by hand. So a broken or untested change reaches
production if a developer forgets, and there is no mechanical gate. The unit suite
already exists and passes (54 tests, ~8s) — it just never runs in CI. This plan makes
the existing, passing tests actually protect the deploy, for one workflow file.

This is intentionally *additive* and respects the repo's "validate locally" ethos: it
adds a fast PR gate, it does not move deploy logic or add e2e (deferred to
`PLAN-008`).

## Goal / Non-goals
- **Goal:** Every PR to `main` runs lint + typecheck + unit tests + build, and a
  failure blocks merge.
- **Non-goal:** Running Playwright e2e in CI (browsers + dev server; also currently
  self-skipping theater — `PLAN-008` fixes that first).
- **Non-goal:** Changing the deploy workflow or the local `validate` script.
- **Non-goal:** Enforcing coverage thresholds — they are zeroed under `CI` today
  (`vitest.config.ts:31`); that's a `PLAN-008` concern.

## Current state
- `.github/workflows/azure-static-web-apps.yml` — build + deploy, no tests.
- `.github/workflows/standards-check.yml` — checks required files / no-`.env`, not
  tests.
- `.github/workflows/security-scan.yml` — Trivy, not tests.
- `.github/workflows/dependency-checks.yml` — dep validation, not tests.
- `package.json:15-18` — `lint`, `typecheck`, `test` scripts exist and pass.
- `scripts/validate-before-push.sh` — the manual gate (lint → typecheck → test →
  build).

## Target state
A new `.github/workflows/validate.yml` runs on `pull_request` to `main` (and on
`push` to `main` as a backstop), executing lint, typecheck, unit tests, and build on
Node 20.19.1. Branch protection is updated (operator step) to require it.

## Steps
1. **Create `.github/workflows/validate.yml`:**
   ```yaml
   name: Validate
   on:
     pull_request:
       branches: [main]
     push:
       branches: [main]
     workflow_dispatch:
   permissions:
     contents: read
   concurrency:
     group: validate-${{ github.ref }}
     cancel-in-progress: true
   jobs:
     validate:
       runs-on: ubuntu-latest
       timeout-minutes: 15
       steps:
         - uses: actions/checkout@v6
         - uses: actions/setup-node@v6
           with:
             node-version: "20.19.1"
             cache: "npm"
         - run: npm ci --legacy-peer-deps
         - run: npm run lint
         - run: npm run typecheck
         - run: npm test
         - run: npm run build
           env:
             NEXT_PUBLIC_SUPABASE_URL: https://placeholder-for-build.supabase.co
             NEXT_PUBLIC_SUPABASE_ANON_KEY: placeholder-anon-key-for-build
   ```
   Rationale for pinned choices: Node `20.19.1` matches `.nvmrc` and the deploy
   workflow; `--legacy-peer-deps` matches the deploy workflow (`@types/node`/vite peer
   conflict per `CLAUDE.md`); the build env placeholders mirror `ci-build.sh:20-27` so
   the build doesn't fail on missing Supabase vars. `npm test` = `vitest run`
   (`package.json:18`).
2. **Order the checks** lint → typecheck → test → build so the cheapest failure
   surfaces first (fail-fast; steps stop on first non-zero exit).
3. **Make it a required check (operator step, human-run).** Per `STANDARDS.md:107`
   branch protection currently sets `required_status_checks=null`. To gate merges,
   the operator runs:
   ```bash
   gh api -X PUT repos/herculeanfit1/AIStudyPlans/branches/main/protection/required_status_checks \
     -F strict=true -f 'contexts[]=validate'
   ```
   Flag this as the human step — the workflow lands first, is observed green on a PR,
   then is marked required (mirrors `STANDARDS.md:97-98`'s "require the gate once it
   runs cleanly for ~1 week" pattern).
4. **Leave `standards-check.yml`, `security-scan.yml`, `dependency-checks.yml`
   untouched** — they cover different concerns and already run.

## Security & compliance notes
- `permissions: contents: read` only — least privilege for the workflow token.
- No secrets needed (build uses public placeholders; unit tests run in mock mode).
- This gate is **change-management evidence for SOC 2** — every merge to `main` now
  has an automated verification record.

## Validation
- Open a scratch PR that intentionally breaks a type (e.g. add `const x: number =
  "s";` in a temp file). The `validate` job fails at the typecheck step and the PR
  shows a failing check. Revert the break; the check goes green.
- On a clean PR, `validate` completes green in a few minutes.
- After Step 3, a failing `validate` blocks the merge button.

## Rollback
Delete `.github/workflows/validate.yml` and, if it was made required, revert the
branch-protection change (`gh api -X PUT … required_status_checks -F 'contexts[]='`
to clear, or set back to null). No product code involved.
