# PLAN-003: Purge dead code & tracked junk
**Status**: Ready
**Effort**: M · **Risk**: Low

## Context
The repo carries heavy dead weight that taxes every review, grep, and future
session: 37 tracked `.bak` files, an untouched create-next-app boilerplate at
`src/app/`, ~16 never-imported duplicate components, and assorted committed junk
(editor settings inside a literal `~` directory, lockfile backups, zero-byte logs).
None of it runs. Deleting it is the single cheapest way to raise the
signal-to-noise of the whole codebase, and git is a perfect rollback.

This plan deletes **only unambiguously dead files**. It deliberately does **not**
touch: the Azure Functions backend (`api/`, see `PLAN-006`), `lib/csrf.ts` +
`app/api/csrf` (see `PLAN-007`), or the second landing page (`ROADMAP.md` L-3).
Those need decisions, not just deletion.

## Goal / Non-goals
- **Goal:** Remove dead files with zero runtime effect, verified before each Tier-2
  deletion.
- **Non-goal:** Refactoring, renaming, or "improving" any live code. Deletion only.
- **Non-goal:** Removing anything that requires an architectural decision (backend,
  CSRF, landing pages).

## Current state
Confirmed via the architecture recon (import-graph grep):

**Tier 1 — delete unconditionally (100% dead, no possible importer):**
- All 37 `.bak` files: `app/components/*.bak` (14), `app/*.bak` +
  `app/context/ThemeContext.tsx.bak`, `app/feedback/page.tsx.bak`,
  `app/landing/page.tsx.bak`, `components/*.bak` (15), `src/app/layout.tsx.bak`.
- `src/` entirely — `src/app/{page.tsx,layout.tsx,globals.css,favicon.ico}` is
  create-next-app boilerplate ("Get started by editing src/app/page.tsx"); `src/utils/helpers.js`
  imported by nothing. Next.js ignores `src/app/` because root `app/` wins.
- Committed junk: `~/Library/Application Support/Cursor/User/settings.json` (a literal
  `~` dir), `package-lock.json.backup`, `package.json.backup`, `.dependency-status.json`,
  `.security-audit.json`, `test_file.ts`, `end_line.txt`, `test-backup.txt`,
  `aistudyplans-launchd_backup.log`, `aistudyplans-launchd_backup_error.log`,
  `swa-deploy/` (stale deploy staging), `saved/` (snapshot dump).

**Tier 2 — delete after a per-path grep confirms zero importers:**
- Root `components/` dead duplicates: `CTASection.tsx`, `DashboardSidebar.tsx`,
  `DashboardLayout.tsx`, `FeaturesGrid.tsx`, `HowItWorksCards.tsx`, `Stats.tsx`,
  `StatsShowcase.tsx`, `StudyPlanPreview.tsx`, `StudyPlanCard.tsx`, `StudyTimer.tsx`,
  `Testimonials.tsx`, `TodoApp.tsx`, `Waitlist.tsx`, `FAQ.tsx`, `HowItWorks.tsx`,
  `admin/FeedbackChart.tsx`.
- `app/components/AnimatedFeature.tsx`, `app/components/ParallaxBackground.tsx`.
- Pages-Router remnant: `pages/_app.js` + root `styles/globals.css`,
  `styles/animations.css` (live CSS is `app/globals.css`; `app/styles/` is empty).

**Keep (live — do NOT delete):** `components/ErrorBoundary.tsx`,
`components/InteractiveStudyPlanDemo.tsx`, `components/auth/Provider.tsx`,
`components/admin/{EmailStatusChecker,FeedbackFilters,FeedbackTable}.tsx`.

## Target state
Tier 1 and grep-confirmed Tier 2 files removed; build, typecheck, lint, and tests
still green; no route or component behavior changed.

## Steps
1. **Tier 1 deletion.**
   - `git rm` all 37 `.bak` files. Generate the list with
     `git ls-files '*.bak'` and remove exactly those.
   - `git rm -r src/`.
   - `git rm -r "~"` (the literal tilde directory) and the junk files listed above.
   - `git rm -r swa-deploy saved`.
2. **Prevent recurrence:** confirm `.gitignore` already ignores `*.bak`? It does
   **not** — add `*.bak` and `*.backup` to `.gitignore` so these can't be re-added.
3. **Tier 2 deletion — verify each before removing.** For every Tier-2 path, run a
   consumer grep and delete only if it returns nothing outside the file itself and
   `.bak` files:
   ```
   git grep -n "ComponentNameOrBasename" -- 'app/**' 'components/**' 'lib/**' \
     ':!*.bak' | grep -v 'components/<the-file-itself>'
   ```
   Example: for `components/FAQ.tsx`, confirm the only live `FAQ` import is
   `app/components/FAQ` (used by `app/page.tsx`), not `components/FAQ`. Delete the
   root `components/FAQ.tsx` only if nothing imports `@/components/FAQ`.
   - For `pages/_app.js` + `styles/`: confirm nothing imports from `../styles/` or
     `@/styles/` except `pages/_app.js` itself, then `git rm -r pages styles`.
4. **Rebuild the type build info is not tracked** (`.gitignore` covers
   `*.tsbuildinfo`); no action.
5. Commit in two commits (Tier 1, then Tier 2) so a bisect can isolate any
   surprise.

## Security & compliance notes
- Removes committed editor config and lockfile backups (minor supply-chain/noise
  hygiene). No secrets are in these Tier-1/2 files (the secret files are handled by
  `PLAN-000` — do that first so this plan doesn't touch them).
- None of these files are in the request path; deletion cannot change runtime authz
  or data handling.

## Validation
- `npm run typecheck` clean (proves no live code imported a deleted file — TS would
  error on a missing module).
- `npm run lint` clean.
- `npm run build` succeeds.
- `npm test` → still 54 passing (no test imports a deleted path; if one does, it was
  testing dead code — remove that test and note it).
- `git ls-files '*.bak' | wc -l` → **0**.
- `git ls-files | grep -E '~/|\.backup$|launchd_backup'` → **empty**.

## Rollback
Every deletion is a `git revert` away. Because Tier 1 and Tier 2 are separate
commits, a surprise in Tier 2 can be reverted without losing the Tier-1 cleanup.
