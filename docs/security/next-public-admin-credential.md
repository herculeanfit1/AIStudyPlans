# Security note: the `NEXT_PUBLIC_ADMIN_*` client credential

**Status:** Remediated (design fix landed) · **Severity:** Medium · **Class:** committed credential / client-inlined secret
**Related:** `docs/strategy/plans/PLAN-000-rotate-and-scrub-committed-secret.md`, PR #43 (working-tree removal)

> Do not paste any credential value into this file, a commit, a PR, or chat.
> Refer to secrets by location only.

## What happened

`updated-env-production.txt` (tracked on `main`, first committed 2025-05-06 in
`d7c10bda`) contains a default admin credential pair:

- `updated-env-production.txt:19` — `NEXT_PUBLIC_ADMIN_USERNAME`
- `updated-env-production.txt:20` — `NEXT_PUBLIC_ADMIN_PASSWORD`

The `NEXT_PUBLIC_` prefix is the problem. Next.js **inlines every
`NEXT_PUBLIC_*` variable into the client JavaScript bundle at build time**, so
any value behind that prefix is shipped to — and readable by — every browser.
A secret with that prefix is not a secret.

### It was a real client-side auth gate — historically

Earlier revisions of the admin portal compared the typed password against the
inlined variable **in the browser**:

- `app/admin/login/page.tsx` and `app/admin/direct-login/page.tsx` did
  `password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD` client-side.
- Because the check ran in shipped JS, "admin access" was effectively public to
  anyone who opened devtools.

This was removed:

- `e2035032` — *"Fix admin login security: Disable fallback login in production"*
- `e030ae33` — *"Remove non-SSO authentication methods in admin portal for security"*

Both login pages are gone from `main`. The server-side migration the exposure
called for **is already complete** (see "How admin auth works today").

### Current state

No code on `main` reads `NEXT_PUBLIC_ADMIN_USERNAME` / `NEXT_PUBLIC_ADMIN_PASSWORD`
(grep-negative across `app/`, `src/`, `components/`, `lib/`, `middleware.ts`,
`auth.ts`, including dynamic `process.env[...]` access). The variable is also:

- **not** injected by the deploy build (`.github/workflows/azure-static-web-apps.yml`
  passes only `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_RESEND_CONFIGURED`),
- **not** defined in `next.config.mjs` (`env:` exposes only `NEXT_PUBLIC_RESEND_CONFIGURED`),
- **not** a GitHub Actions secret (`gh secret list`),
- **not** an Azure Static Web App application setting on the live app
  (`swa-btai-aistudyplans-prod`, RG `AIStudyPlans-RG1`), and
- **not** a Key Vault secret consumed by the app.

So the current production bundle does **not** contain it. The residual exposure
is the plaintext default value in **git history** (~ the `d7c10bda` commit and
every clone/backup mirror since) and in the **working-tree file** on `main`.

## How admin auth works today

Admin authentication is **NextAuth (Auth.js v5) + Microsoft Entra ID SSO only**:

- `auth.ts:22-26` — hardcoded email allowlist; `signIn` rejects non-allowlisted
  accounts and derives `isAdmin` into the JWT/session **server-side**.
- `middleware.ts:19-36` — server middleware gates `/admin/*` page routes
  (redirect to sign-in if unauthenticated, `403` if not `isAdmin`).

There is **no supported client-side admin credential**. (The `dev-auth` /
`dev-login` / `direct-access` API routes set a non-`httpOnly` `isAdmin` cookie,
but all are `NODE_ENV === "production"`-gated and return `403` in production.)

## Rotation

**There is no live consumer to rotate.** The value is a committed default that
was never wired into any live production source (CI, `next.config.mjs`, GitHub
secrets, SWA app settings, or Key Vault). "Rotating" it re-ships nothing and
protects nothing — the correct action is **removal**, not rotation:

1. **Working tree** — remove the file (in progress in **PR #43**; no code depends
   on it). Do not reintroduce it.
2. **Git history (optional, human-gated)** — the old default value stays in
   history until scrubbed. Per `PLAN-000` Steps 4–5, a history rewrite is
   defense-in-depth and requires a human decision (branch-protection relaxation +
   force-push). Because nothing consumes the value, this is not urgent.
3. **Belt-and-suspenders platform check** — confirm the variable is absent from
   the live hosting env (it already is, per the audit above). Names only; do not
   print values:

   ```bash
   az staticwebapp appsettings list \
     --name swa-btai-aistudyplans-prod --resource-group AIStudyPlans-RG1 \
     --query 'keys(properties)' -o tsv | grep -i ADMIN   # expect: no NEXT_PUBLIC_ADMIN_* names
   ```

   If (and only if) a `NEXT_PUBLIC_ADMIN_*` setting is ever found in the platform,
   delete it — do not set a new value:

   ```bash
   az staticwebapp appsettings delete \
     --name swa-btai-aistudyplans-prod --resource-group AIStudyPlans-RG1 \
     --setting-names NEXT_PUBLIC_ADMIN_USERNAME NEXT_PUBLIC_ADMIN_PASSWORD
   ```

> If a future admin feature genuinely needs a shared password (it should not —
> prefer SSO), it must be **server-only**: name it `ADMIN_PASSWORD_HASH` (no
> `NEXT_PUBLIC_` prefix), store the value in Key Vault (`aistudyplansvault`),
> reference it from SWA/Functions app settings, and validate it in an API route /
> server action — never in client code. Placeholder for the operator:
> `az keyvault secret set --vault-name aistudyplansvault --name admin-password-hash --value <NEW_VALUE>`
> (run interactively so the value never lands in a tool log).

## The design fix (this repo)

To make this class of mistake un-committable:

- `scripts/check-no-client-secrets.sh` — flags a `NEXT_PUBLIC_*` variable when it
  is *assigned* or *referenced in code* (`process.env.NAME`) **and** its name
  contains a credential word: `PASSWORD` / `SECRET` / `CREDENTIAL` / `PRIVATE_KEY`
  / `SECRET_KEY` / `API_KEY` / `ACCESS_KEY` / `SERVICE_ROLE` / `TOKEN` / `BEARER`
  / `ADMIN_USERNAME|USER|LOGIN` (case- and camelCase-aware, e.g.
  `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_AdminPassword` both
  match). Legitimately-public vars — `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_ADMIN_URL`/`_EMAIL`, `...CREDENTIALLESS` —
  do not. Prose/comments that only *mention* a name are not flagged. A genuinely
  public value can be waived with an inline `check-no-client-secrets: allow`.
  Run `scripts/check-no-client-secrets.sh --all` for a full-tree audit.
- `.pre-commit-config.yaml` — `no-client-secrets` local hook runs the script on
  staged files, blocking new introductions (companion to the existing
  `no-dot-env` hook).

The Trivy secret scan (`.github/workflows/security-scan.yml`) remains the backstop
for high-entropy secrets; this guard specifically closes the client-inlining
design gap, which name-based detection catches and entropy-based scanners miss.

**Recommended follow-up (after PR #43 lands):** because pre-commit is local and
`--no-verify`-bypassable, add a CI gate running
`scripts/check-no-client-secrets.sh --all` on PR/push. It is deliberately *not*
added now: the still-tracked `updated-env-production.txt` is a true positive, so
an `--all` gate would fail until #43 removes that file. The two existing security
workflows (`security-scan.yml`, `standards-check.yml`) are canonical HerculeanOlympus
copies ("do not edit per-repo copies"), so the gate should be a new dedicated
workflow rather than an edit to those.
