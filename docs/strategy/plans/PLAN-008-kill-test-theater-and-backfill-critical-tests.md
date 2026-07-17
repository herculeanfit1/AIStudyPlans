# PLAN-008: Kill test theater & backfill critical-path tests
**Status**: Ready (do after `PLAN-005`)
**Effort**: M · **Risk**: Low

## Context
The test suite passes (54 tests) but overstates what it protects, and several parts
are theater:
- **Coverage gate is cosmetic.** `vitest.config.ts:31-34` sets thresholds to `0`
  whenever `CI` is set, and `npm test` never runs `--coverage`. The advertised "70%"
  bites only a developer manually running `test:coverage` with `CI` unset.
- **A non-failing test.** `__tests__/lib/supabase.test.ts:68-85` ("handle errors
  gracefully") asserts a shape in the success branch **or** an error **or**
  `toBeDefined()` in catch — no input can fail it. The whole file runs in mock mode,
  so it tests the mock, not Supabase.
- **Self-skipping e2e.** `e2e/landing.spec.ts:63-66` wraps the pricing test in
  try/catch → `test.skip()` on any error; it cannot fail on a broken pricing toggle.
  `e2e/visual.spec.ts` self-skips entirely under `CI`/`DOCKER`.
- **Critical paths untested:** `lib/validation.ts`, `lib/rate-limit.ts`, the
  `/api/admin/*` authz (the `PLAN-001` fix), and the waitlist route have no tests.

This plan makes the gate honest and adds tests where a regression would actually
hurt. It runs **after `PLAN-005`** (the CI gate must exist for tests to protect
anything) and **after `PLAN-001`/`PLAN-007`** (so the new tests assert the fixed
behavior).

## Goal / Non-goals
- **Goal:** Coverage thresholds enforced in CI at an honest floor that can only
  ratchet up.
- **Goal:** The non-failing test and the always-green landing e2e assert real
  outcomes.
- **Goal:** Unit tests exist for validation, rate-limiting, admin authz, and the
  waitlist route's happy/sad paths.
- **Non-goal:** Adding Playwright e2e to CI (browsers + time; visual self-skip is a
  legitimate headless-flakiness guard). Keep e2e local for now; document it.
- **Non-goal:** Chasing a coverage number for its own sake. Add tests where failure
  = user harm, not to hit a percentage.

## Current state
- `vitest.config.ts:12` include = `app/`, `lib/`, `components/`; `api/` is out of
  scope (frozen — `PLAN-006`).
- `package.json:18,20` — `test` = `vitest run`; `test:coverage` = `vitest run
  --coverage`.
- 8 test files (see `STRATEGIC_REVIEW.md` §5.6 provenance / the test recon).

## Target state
- `vitest.config.ts` thresholds enforced regardless of `CI`, set to the measured
  current floor.
- The CI `validate` job (`PLAN-005`) runs `test:coverage`, not bare `test`.
- `supabase.test.ts` error case makes a definite assertion.
- `landing.spec.ts` pricing test fails on a broken toggle.
- New tests: `__tests__/lib/validation.test.ts`,
  `__tests__/lib/rate-limit.test.ts`, `__tests__/api/admin-authz.test.ts` (or an e2e
  equivalent), `__tests__/api/waitlist.test.ts`.

## Steps
1. **Measure the honest floor.** Run `CI= npm run test:coverage` and record the
   actual lines/branches/functions/statements percentages.
2. **Make thresholds real.** In `vitest.config.ts:30-35`, remove the
   `process.env.CI ? 0 : 70` ternary. Set each threshold to the **measured floor
   rounded down to the nearest 5%** (e.g. if lines=41%, set 40). This is an honest
   ratchet: it can't regress and is raised as tests are added. Do **not** set 70 if
   the code isn't there yet — a threshold that fails every build gets disabled, which
   is how it became `CI ? 0` in the first place.
3. **Enforce in CI.** In `.github/workflows/validate.yml` (`PLAN-005`), change the
   test step from `npm test` to `npm run test:coverage` so the threshold actually
   gates. Keep the `env` block; add nothing secret.
4. **Fix the non-failing test** (`__tests__/lib/supabase.test.ts:68-85`): rewrite it
   to assert a specific outcome. In mock mode, `addToWaitlist` with a valid input
   returns `{ success: true, user: {...} }`; assert exactly that. If you want an
   error path, force one (e.g. invalid input the mock rejects) and assert
   `success === false`. Remove the three-way "or toBeDefined" escape.
5. **Fix the always-green landing e2e** (`e2e/landing.spec.ts:44-66`): remove the
   try/catch-that-skips. Assert the pricing toggle is visible and that toggling
   changes the displayed price. If the toggle legitimately may not render, that's a
   product bug to surface, not skip.
6. **Backfill critical unit tests:**
   - `__tests__/lib/validation.test.ts` — for `waitlistSchema` and each contact
     schema: valid input passes; over-length name/email/message rejected; malformed
     email rejected; missing required field rejected.
   - `__tests__/lib/rate-limit.test.ts` — the assertions listed in `PLAN-007`
     Validation (first-IP keying, no `/16` collapse, 429 over limit, null under).
   - `__tests__/api/admin-authz.test.ts` — unauthenticated `POST /api/admin/clear-data`
     and `GET /api/admin/email-stats` return 401 (the `PLAN-001` regression guard).
     Mock `auth()` to return no session; assert the route handler 401s.
   - `__tests__/api/waitlist.test.ts` — happy path (valid body → 200, mocks for
     `addToWaitlist`/`sendWaitlistConfirmationEmail`); sad paths (invalid JSON → 400,
     schema failure → 422, missing `RESEND_API_KEY` → 503). Follow the existing mock
     style (`vi.mock`, `vi.mocked`) from `__tests__/lib/*`.
7. **Document the e2e stance.** Add a short note in `docs/` (or the ADR) that
   Playwright e2e runs locally/on-demand, not in CI, and why (browser + dev-server
   cost); visual snapshots self-skip in headless environments by design.

## Security & compliance notes
- The admin-authz test is a **security regression guard** — it prevents the
  `PLAN-001` fix from silently regressing. Note it as SOC 2 change-control evidence.
- No secrets in tests; all external calls (Supabase, Resend) are mocked.

## Validation
- `CI=1 npm run test:coverage` — passes and **enforces** the new thresholds (verify
  by temporarily lowering coverage and seeing it fail).
- New test files run and pass; total test count increases (>54).
- The rewritten `supabase.test.ts` error case fails if you deliberately break the
  mock's return shape (proving it's a real assertion).
- The `validate` CI job (from `PLAN-005`) now runs coverage and would fail on a
  coverage drop below the floor.

## Rollback
`git revert` per commit. Reverting the threshold change restores the prior
(cosmetic) config; reverting a test file removes only that test. No product behavior
depends on these changes.
