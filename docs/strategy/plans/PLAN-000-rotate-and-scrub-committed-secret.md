# PLAN-000: Rotate & scrub the committed production secret
**Status**: Ready
**Effort**: S (rotate) / L (history scrub) · **Risk**: Med

## Context
This repo has a **live Resend API key** and the Supabase anon JWT committed to git
in a tracked shell script. Anyone with repo (or backup-mirror) access can send email
from the SchedulEd domain. The Trivy secret-scan gate
(`.github/workflows/security-scan.yml`) did not catch it because the file predates
the gate, which only blocks *new* PRs. The repo is also weekly-mirrored to
`AIStudyPlans-Backups` (`.github/workflows/backup-repository.yml`), so the secret is
replicated. This is the only actively-exploitable finding in the review — do it
first, before any other plan.

Do **not** paste the secret values into any file, commit message, PR, or chat. Refer
to them by location only.

## Goal / Non-goals
- **Goal:** Make the committed credential worthless (rotate) and remove it from the
  working tree so no future clone re-exposes a live secret.
- **Goal:** Decide and document whether to rewrite history.
- **Non-goal:** Changing how the app reads secrets at runtime (it already uses
  env/Key Vault correctly). This plan does not touch `lib/email.ts` or KV wiring
  beyond updating the rotated value.

## Current state
Tracked files containing secrets (verified via `git grep`):
- `update-production-env.sh:12` — Supabase project URL
- `update-production-env.sh:13` — Supabase **anon** JWT (`eyJ…`, `role:anon`)
- `update-production-env.sh:18` — **Resend API key** (`re_…`, 36 chars, live send)
- `updated-env-production.txt:19-20` — `NEXT_PUBLIC_ADMIN_USERNAME` /
  `NEXT_PUBLIC_ADMIN_PASSWORD` (default `admin`/`adminpass`; unused by current
  NextAuth code but committed)

Also verify (may be a placeholder, confirm before acting):
- `scripts/direct-env-setup.sh:8` — a `re_REP…`-prefixed string that looks like
  `re_REPLACE...`; if it is a placeholder, leave it; if it is a real key, treat it
  like `update-production-env.sh`.

Runtime already reads `RESEND_API_KEY` from env / Key Vault (`lib/email.ts`), so
rotating the value in Resend + Key Vault + SWA settings is transparent to the code.

## Target state
- The Resend key committed here is **revoked**; a new key is issued and stored only
  in Key Vault (`aistudyplansvault`, secret `resend-api-key`) and referenced by the
  SWA/Functions app settings.
- `update-production-env.sh` and `updated-env-production.txt` are removed from the
  working tree (they are operational scratch, not needed in-repo), and the secret
  pattern is gitignored so they cannot be re-added.
- A decision on history rewrite is recorded (see Steps 4–5).

## Steps
1. **Rotate the Resend key (mandatory, first).** This neutralizes the exposure
   regardless of history.
   - In the Resend dashboard, **revoke** the key whose value is in
     `update-production-env.sh:18`, and create a replacement.
   - Store the new key in Key Vault: `az keyvault secret set --vault-name
     aistudyplansvault --name resend-api-key --value <NEW_KEY>` (run interactively by
     the operator via `! az …` so the value never lands in a tool log).
   - Confirm the SWA and Functions app settings reference the KV secret (they already
     do per `CLAUDE.md` "KV secrets"); no code change needed. Verify with a test send
     (`npm run test:email` or a waitlist signup to a test address).
2. **Rotate/verify the Supabase anon key + RLS.** The anon key is public-by-design
   (it ships in the client bundle), so its exposure is lower severity — but the repo
   ships `fix-supabase-rls.md` implying RLS was loosened. In the Supabase dashboard:
   verify RLS on `waitlist_users` and `feedback_responses` allows anonymous
   **INSERT only** (no anonymous SELECT of PII). Rotating the anon key is optional;
   fixing RLS is the real control. Record the RLS state.
3. **Remove the secret-bearing scratch files from the working tree** and gitignore
   them:
   - `git rm update-production-env.sh updated-env-production.txt`
   - If `scripts/direct-env-setup.sh:8` is confirmed a real key, `git rm` it too;
     if placeholder, leave it.
   - Add to `.gitignore`: `update-production-env.sh`, `updated-env-production.txt`,
     `*-env-production.txt`.
   - Commit: `chore(security): remove committed env scratch files (secret rotated)`.
4. **Decide on history rewrite (escalate to human).** Rewriting history is the only
   way to remove the *old* value from git history, but it requires a force-push to
   `main`, which is blocked by branch protection (`STANDARDS.md:107` —
   `allow_force_pushes=false`) and would break the backup mirror's fast-forward.
   **Pre-resolved recommendation:** because the key is rotated (Step 1), the historic
   value is already worthless, so a history rewrite is *defense-in-depth, not
   urgent*. Recommend scrubbing history only if the repo will ever go public
   (`STANDARDS.md:136-141`) or if policy requires no secrets in history. **This is
   the one human decision in this plan** — the operator must choose.
5. **If (and only if) the human approves a history rewrite:**
   - Temporarily relax branch protection: allow force-push on `main`.
   - `git filter-repo --path update-production-env.sh --path updated-env-production.txt --invert-paths`
     (install `git-filter-repo`; do **not** use the deprecated `filter-branch`).
   - Force-push, then re-run the backup workflow (it force-pushes the mirror anyway —
     `backup-repository.yml` uses `git push -f`, so the mirror self-heals).
   - Re-enable branch protection.
   - Notify any other clone holders to re-clone.

## Security & compliance notes
- **Least privilege:** the new Resend key should be scoped to sending only, if Resend
  supports scoped keys. Store only in Key Vault; never in a tracked file.
- **Audit trail:** record the rotation (date, who, old-key-revoked) — this is SOC 2
  incident-response evidence. A one-line ADR (`PLAN-009`) is a good home.
- **Data handling:** Step 2's RLS verification is the actual PII control; do not skip
  it because the anon key is "public."

## Validation
- `git ls-files | grep -E 'update-production-env|updated-env-production'` → **no
  output** (files untracked).
- `git grep -nE 're_[A-Za-z0-9_-]{20,}'` → returns only confirmed placeholders (e.g.
  `re_REPLACE…`), no live key.
- Resend dashboard shows the old key **revoked** and a new key active.
- A test waitlist signup to a throwaway address delivers a confirmation email (proves
  the rotated key is wired correctly).
- If history was scrubbed: `git log --all --full-history -- update-production-env.sh`
  → empty.

## Rollback
- Working-tree removal (Step 3) is reversible via `git revert` of the removal commit
  — but do **not** revert it, since that re-adds the (now-revoked, worthless) file.
- Key rotation is not "rolled back"; if the new key misbehaves, issue another key and
  update KV. The old key stays revoked permanently.
- History rewrite (Step 5) is the irreversible step; the pre-rewrite state exists in
  the backup mirror until its next weekly run, and locally in reflogs — but treat
  Step 5 as one-way and only run it with human sign-off.
