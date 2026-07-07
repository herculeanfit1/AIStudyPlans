# CLAUDE.md

SchedulEd (repo: AIStudyPlans) — AI study-plan generator: consumer landing page + waitlist funnel. Next.js 15 / React 19 / TypeScript / Tailwind v3 / Supabase / Resend / Auth.js v5. SWA (Static Web App) frontend + standalone Azure Functions backend (`api/`); deployed on Azure Static Web Apps.

## Commands

CI is deployment-only (no PR lint/test gate) — `npm run validate` is the local pre-push gate.

```bash
npm run dev             # dev server on :3000
npm run build           # production build (fails on any TS error OR lint warning)
npm run validate        # PRE-PUSH GATE: lint → typecheck → unit tests → build (scripts/validate-before-push.sh)
npm run validate:quick  # lint + typecheck + build, no tests
npm run validate:deps   # enforce exact-version + shrinkwrap dependency standards
npm run lint            # eslint app/ components/ lib/ --max-warnings 0  (any warning fails)
npm run typecheck       # tsc --noEmit
npm test                # vitest run  (single file: npm test -- __tests__/Header.test.tsx)
npm run test:e2e        # playwright (auto-starts dev server)
./run-docker.sh start   # dockerized dev on :3001
```

- Add deps with `--save-exact` (no `^`/`~`), then `npm shrinkwrap`.
- Use `--legacy-peer-deps` on peer-dep conflicts (@types/node vs vite).

## Architecture facts

Non-derivable facts only — inventory (routes, components, lib files) is derivable by `ls`/grep.

- **Split API + auth exception (the load-bearing deviation).** The Azure Functions backend (`api/`) is deliberately **standalone, NOT a SWA "linked backend."** A linked backend routes ALL `/api/*` to Functions, which would swallow `/api/auth/*` and break NextAuth. So auth-critical routes stay in the Next.js SWA (`app/api/`: `auth/[...nextauth]`, `csrf`, `admin/*`); data endpoints (`waitlist`, `contact/sales`, `contact/support`, `feedback/submit`, `feedback-campaign`, `health`) live in Functions and the frontend calls them **directly via CORS**.
- **Admin allowlist is hardcoded in `auth.ts`** (`allowedEmails` array) — it gates both sign-in and the `isAdmin` claim. `ADMIN_EMAILS` exists in `.env.example` but is read by NO code; do not wire admin logic to it.
- **Dual app directory.** `app/` is the live Next.js root and takes precedence; `src/app/` is a legacy/backup layout+page. Edit `app/`, not `src/app/`.
- **`lib/supabase.ts` falls back to a mock client** when Supabase env vars are absent, so local dev runs without Supabase. `lib/admin-supabase.ts` is the higher-privilege service-role client (admin ops only).
- **`lib/rate-limit.ts` is in-memory per-IP** and resets on restart — a known limitation (prod should move to Redis).
- **`feedback-campaign`** is cron-triggered and bearer-token authed (`FEEDBACK_CAMPAIGN_API_KEY`), unlike the other Supabase-backed public endpoints.

## Gotchas

- **Do NOT migrate Tailwind to v4.** This repo is pinned to v3. Read BTAISite `CLAUDE.md` "Critical: Tailwind CSS v4 Rules" first. All base resets in `globals.css` are wrapped in `@layer base` for v4 forward-compat — keep them there.
- **Build enforces TS and ESLint** (`ignoreBuildErrors: false`, `ignoreDuringBuilds: false`): one type error OR lint warning fails the build. The "Next.js plugin was not detected in ESLint configuration" build warning is **cosmetic** (lint runs via `eslint` directly, not `next lint`) — WRONG: try to silence it; CORRECT: ignore it.
- **ESLint uses the flat config `eslint.config.mjs` (ESLint 9), NOT `.eslintrc.json`.** `@typescript-eslint/no-unused-vars` is `error` (unused import/var fails); `no-explicit-any` and `no-console` are `warn`, but `--max-warnings 0` means any warning still fails. For an intentional log: `// eslint-disable-next-line no-console`.
- **Node is pinned to 20.19.1** (`.nvmrc`); `engines.node >=20.19.1`. Run `nvm use` to match CI.
- **Vitest 3.x + happy-dom + @testing-library/react@16** (React 19-compatible). Mock with `vi.mock()`/`vi.fn()`/`vi.mocked()`.

## Deployment

Azure Static Web Apps (frontend) + standalone Azure Functions (Flex Consumption, Node 22 ESM; backend build `cd api && npm run build`, esbuild → `dist/index.js`).

- `.github/workflows/azure-static-web-apps.yml` builds + deploys on push to `main`; PR preview URLs on PRs. **No lint/test in CI** — run `npm run validate` locally first.
- IaC: `infra/main.bicep` (Functions, Storage, App Insights, existing Key Vault RBAC). Settings/KV wiring via `scripts/wire-functions-settings.sh [--seed-kv]`.
- Prod secrets are Azure Key Vault references on both the Functions app and SWA. Resource-group / vault / KV item names are **withheld from this public repo — see the private runbook / 1Password vault.**

## Environment variables

`.env.example` is the tracked contract. `.env.development` / `.env.production` are gitignored; only `.env.example` is committed. Non-derivable notes:

- **Prod secrets are injected as Azure Key Vault references** (Functions app + SWA); item names withheld — see the private runbook / 1Password vault.
- `SUPABASE_SERVICE_ROLE_KEY` is the elevated server-only admin credential — never expose it via a `NEXT_PUBLIC_*` var.
- `ADMIN_EMAILS` is present in `.env.example` but **unused** (allowlist is hardcoded in `auth.ts`).
- `OPENAI_API_KEY` / `OPENAI_BASE_URL` / `ALLOWED_ORIGINS` are read **only** by the auxiliary `mcp-server/` (a local-Qwen3 Coder dev tool), not the landing page or Functions backend.

## Standards

Follows the Herculean Ecosystem Standards (NONAGENT variant) — see the `STANDARDS.md` header for the current version. STANDARDS.md takes precedence on any conflict.

- **Linters**: Biome (`biome.json`) for format + lint via pre-commit; ESLint (`eslint.config.mjs`) for TS/Next rules via `npm run lint`.
- **Pre-commit** (`.pre-commit-config.yaml`): `biome-check`, `no-dot-env`, `no-client-secrets`. The `no-dot-env` hook blocks staging `.env*` — unstage the file, don't bypass.
- **Secrets**: 1Password via `.env.1p.template` (`op://` refs); never commit `.env` files.
- **Module system**: ESM (`"type": "module"`). Exact dependency versions; `npm shrinkwrap` committed.

## Key docs / paths

- `STANDARDS.md` — shared cross-site conventions (precedence on conflicts)
- `.env.example` — environment-variable contract
- `infra/main.bicep` — Azure IaC (Functions, Storage, App Insights, KV RBAC)
- BTAISite `CLAUDE.md` — "Critical: Tailwind CSS v4 Rules" (read before any v4 migration)
