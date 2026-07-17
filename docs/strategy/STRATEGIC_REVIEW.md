# SchedulEd (AIStudyPlans) — Strategic Review

**Reviewer:** Claude Fable 5 (architecture pass, planning only — no source changed)
**Date:** 2026-07-03
**Repo:** `/Users/herculeanfit1/dev/AIStudyPlans` · branch `main` @ `72cb9c33`
**Companion docs:** `ROADMAP.md`, `plans/PLAN-*.md`

> This review is written for an executor (Claude Opus) with **zero memory of this
> session**. Every claim cites a file path. Where a finding drove a decision, the
> decision is pre-made in the matching `plans/PLAN-NNN-*.md`.

---

## 1. Purpose & Portfolio Fit

**What it is.** SchedulEd is the consumer-facing landing page and waitlist funnel
for an AI study-plan product under Bridging Trust AI. It is a Next.js 15 / React 19
app deployed to Azure Static Web Apps (SSR/hybrid — confirmed: `next.config.mjs`
has no `output: "export"`). It collects waitlist signups and contact/feedback
submissions, stores them in Supabase, and sends transactional email via Resend. An
admin dashboard (Auth.js v5 + Microsoft Entra ID) surfaces email/feedback stats.

**Who consumes it.** End users (students, parents, educators) hit the public
funnel; the owner (TK) uses the admin dashboard. No other system depends on this
repo — it is a leaf, not a hub.

**Fleet fit.** Per `STANDARDS.md:21`, this is classified a **non-agent external
repo** in the Herculean ecosystem — the lowest-trust, internet-facing tier. It is a
marketing/lead-capture surface, not infrastructure. That classification matters:
the security baseline that applies is `STANDARDS.md` (Trivy scan, Dependabot,
branch protection, no committed secrets), **not** the full agent-repo standard.
There is a live contradiction here (see §3, Doc Drift): `CLAUDE.md:30` treats the
repo as an *agent* repo governed by "Standards v1.1" while `STANDARDS.md` is the
*non-agent* v1.0 standard that explicitly exempts this repo from the agent
workflow. The repo currently carries both sets of machinery.

---

## 2. Architecture Health

### 2.1 What's genuinely good
- **Dependency hygiene is real.** Exact-pinned versions (`package.json:75-116`),
  `npm-shrinkwrap.json` committed and force-kept (`.gitignore:76-77`), Dependabot
  configured (`.github/dependabot.yml`), Trivy fs/config/secret scanning with a
  HIGH/CRITICAL gate (`.github/workflows/security-scan.yml`). This is the
  strongest part of the repo.
- **The NextAuth core is sound.** `auth.ts:45-63` rejects non-allowlisted emails at
  `signIn`, derives `isAdmin` server-side into the JWT, and the `/admin/*` *page*
  routes are gated by real server-side middleware (`middleware.ts:24-36`).
- **Input validation is solid where used.** Zod schemas with length caps and email
  validation for waitlist and all contact forms (`lib/validation.ts:6-119`).
- **Build enforces types & lint.** `next.config.mjs:29-34` keeps
  `ignoreBuildErrors:false` and `ignoreDuringBuilds:false`.

### 2.2 Structural risks (ranked)

**R-A. Duplicated backend — every endpoint exists twice.** The single biggest
structural liability. `lib/*` + `app/api/*` (the SWA copy) and `api/src/*` (the
standalone Azure Functions copy) are parallel implementations of the same
endpoints. Nine `lib/` files are byte-identical between the two trees
(`supabase.ts`, `admin-supabase.ts`, `email.ts`, `email-templates.ts`,
`email-monitor.ts`, `validation.ts`, `types.ts`, `contact.ts`,
`feedback-email-templates.ts`); `rate-limit.ts` has **already diverged 143 lines**.
Any fix must be applied twice or the copies rot. **The Functions backend is dead in
the request path** — see R-B.

**R-B. Documented architecture ≠ running architecture.** `CLAUDE.md:112-198`
describes waitlist/contact/feedback as "moved to Azure Functions," with the browser
calling `func-btai-asp-prod` via CORS. **Reality:** the waitlist form posts to
`${NEXT_PUBLIC_APP_URL}/api/waitlist` = `https://aistudyplans.com/api/waitlist`
(`app/hooks/useWaitlistForm.ts:133-150`, `.env.production:22`), which is the
**Next.js SWA route** (`app/api/waitlist/route.ts`). Contact and feedback forms
likewise call SWA routes (`app/contact/sales/page.tsx:31`,
`app/feedback/page.tsx:45`). **No frontend form calls the Functions backend.** The
Functions app is deployed infrastructure that serves zero production traffic.

**R-C. Two full landing-page implementations.** `/` (`app/page.tsx`) renders one
component set (`app/components/Hero|Features|Footer|HowItWorks`); `/landing`
(`app/landing/page.tsx`) renders a parallel set
(`app/components/landing/*Section`). Both routes are live; nothing links them.
Double the surface for one product page.

**R-D. Dead weight drowns the signal.** 37 tracked `.bak` files
(`app/components/*.bak`, `components/*.bak`), an untouched create-next-app
boilerplate at `src/app/` (`src/app/page.tsx` still says "Get started by editing…"),
~11 never-imported duplicate components under root `components/`, a committed
`~/Library/Application Support/Cursor/User/settings.json` (a literal `~` dir),
`package-lock.json.backup` (483 KB), zero-byte tracked logs, and 51 files in
`docs/` (many point-in-time fix logs). This inflates every future review and
every grep.

### 2.3 Coupling & scaling
- **Coupling hot spot:** the `lib/` ↔ `api/src/lib/` duplication (R-A). There is no
  shared package; the two trees are copy-paste-coupled.
- **Scaling ceiling (functional):** rate limiting and the email quota circuit
  breaker are in-memory per-instance (`lib/rate-limit.ts:16-17`,
  `lib/email-monitor.ts`). On SWA managed functions and Functions Flex Consumption,
  counters reset on cold start and multiply by instance count — so the "5/hr"
  waitlist cap is effectively `5 × live_instances` and resets frequently. For a
  low-volume funnel this is tolerable today; it is not a real abuse control.

---

## 3. Documentation vs. Reality Drift

`CLAUDE.md` is the file every future session reads first, so its drift is
high-leverage to fix (see `PLAN-004`). Confirmed inaccuracies:

| CLAUDE.md claim | Reality |
|---|---|
| L112-198: waitlist/contact/feedback moved to Functions; frontend calls Functions via CORS | Frontend calls **SWA Next.js routes**; Functions serves no traffic (R-B) |
| L96-102: `src/app/` is a "secondary/legacy entry point … backup layout" | `src/app/` is untouched create-next-app boilerplate, unrouted/dead |
| L166: admin access controlled by `ADMIN_EMAILS` env var | `ADMIN_EMAILS` is **read by no code**; allowlist is hardcoded in `auth.ts:22-26` |
| L198: "Public forms use honeypot fields (`_gotcha`)" | No honeypot field exists anywhere (grep-negative) |
| L198: "API route pipeline (per STANDARDS.md)" | `STANDARDS.md` contains no API-pipeline guidance; it's a non-agent security baseline |
| L30: "Standards v1.1 enforced by standards-check.yml" | `STANDARDS.md` is v1.0 **non-agent**, whose §2 says `standards-check.yml` is *not* enforced for this repo class |
| L145-153: `lib/csrf.ts` listed as active | `lib/csrf.ts` has **zero importers**; CSRF is generated but never validated |

---

## 4. Tech Debt Inventory

Interest rate = how fast the item compounds if left alone.

| Item | Location | Impact | Effort | Interest rate |
|---|---|---|---|---|
| **Live Resend API key + Supabase anon JWT committed to git** | `update-production-env.sh:12-18` | Critical — live email-send credential in history | S (rotate) / L (history scrub) | **Very high** — exposure grows every clone/fork/backup |
| **`/api/admin/*` unprotected by middleware** | `middleware.ts:19,42` | High — auth silently bypassed for admin API | S | **High** — every new `/api/admin` route inherits the hole |
| **Unauthenticated `/api/admin/clear-data`** | `app/api/admin/clear-data/route.ts:4-9` | High (latent) — state-change w/o auth; harmless only while store is in-memory mock | S | High — becomes data-loss the moment a real store is wired |
| **Duplicated backend (`lib/` ↔ `api/src/lib/`)** | `lib/*`, `api/src/lib/*` | High — every fix done twice; `rate-limit` already drifted | L | **High** — divergence compounds per commit |
| **Ungated debug routes leak env in prod** | `app/api/debug-env/route.ts:26-28`, `auth/debug`, `debug-waitlist` | Medium — partial Resend key + config disclosure | S | Medium |
| **CSRF theater** | `lib/csrf.ts`, `app/api/csrf/route.ts` | Medium — false assurance; 0 validators | S | Low (static) |
| **Rate limit in-memory + IP-spoofable + /16 truncation** | `lib/rate-limit.ts:16-17,50-55` | Medium — weak abuse control on email-send path | M | Medium |
| **Deploy ships untested (no CI test gate)** | `.github/workflows/*.yml` | Medium — regressions reach prod unblocked | S | **High** — risk grows with every feature |
| **Test theater** | `vitest.config.ts:31-34`, `e2e/*.spec.ts` | Medium — coverage gate is cosmetic; e2e self-skips | M | Medium |
| **Dead code & tracked junk** | 37 `.bak`, `src/`, root `components/*`, `~/…Cursor` | Low each — noise tax on every review | M | Medium (accretes) |
| **Doc drift (CLAUDE.md)** | `CLAUDE.md` | Medium — misleads every future session | M | **High** — each session acts on stale map |
| **Two landing implementations** | `app/components/*` vs `app/components/landing/*` | Low — 2× UI surface | M | Low |
| **`next-auth` pinned to a beta** | `package.json:82` (`5.0.0-beta.30`) | Medium — production auth on a pre-release | M | Medium |
| **npm audit: 12 vulns (2 critical, 4 high)** | transitive (`ws`, others) | Medium | S | Medium |
| **Docs graveyard (51 files, no ADRs)** | `docs/` | Low — decisions unrecorded/scattered | M | Medium |

---

## 5. Security & Compliance Posture

**Blast-radius framing (read this first).** Two facts lower the *current* impact of
the auth findings without excusing them: the admin data layer is an **in-memory
mock array** (`lib/admin-supabase.ts:18-25`), and contact submissions are written
only to that mock (`api/src/lib/contact.ts:33-45`), not persisted. Real PII
(`waitlist_users`, `feedback_responses`) is written via the Supabase **anon** key
(`api/src/lib/supabase.ts:6-15`). So the admin-panel gaps expose mock data today —
but the *patterns* are production-dangerous the moment a real store is wired in.

### 5.1 Secrets — the one that must be handled before anything else
- **CRITICAL:** `update-production-env.sh:12-18` (tracked in git) contains a
  real-format **Resend API key** (`re_…`, 36 chars, full send capability), the
  **Supabase anon JWT**, and the project URL. The Resend key is a live credential
  that can send mail from the domain. It predates the Trivy secret-scan gate, so the
  gate never caught it (the gate only blocks *new* PRs). **Rotate the Resend key
  now; rotate/verify the anon key + RLS; then scrub.** See `PLAN-000`.
- **MEDIUM:** `updated-env-production.txt:19-20` commits
  `NEXT_PUBLIC_ADMIN_USERNAME`/`_PASSWORD` defaults. `NEXT_PUBLIC_` inlines into the
  client bundle. No current code reads them (NextAuth is used instead) — likely dead
  config, but a committed default credential.
- **MEDIUM:** `app/api/debug-env/route.ts:26-28` returns the Resend key's first+last
  3 chars, ungated, on the `edge` runtime — reachable by anyone in production.
  `auth/debug/route.ts:19-27` and `debug-waitlist/route.ts:23-28` similarly echo
  config/env presence.
- **Good:** real `.env*` files are untracked and gitignored (`.gitignore:34-46`);
  `.env.1p.template` uses 1Password references.

### 5.2 AuthN / AuthZ
- **HIGH — `/api/admin/*` middleware gap.** `middleware.ts:42` matches
  `/api/admin/:path*`, but the enforcement branch is `if (path.startsWith("/admin"))`
  (`middleware.ts:19`). `/api/admin/...` starts with `/api`, so it falls through to
  `NextResponse.next()`. Only routes that self-check are actually protected:
  `email-usage/route.ts:24-28` does (`auth()` + `isAdmin`), while
  `email-stats`, `ci-status`, and `clear-data` do **not**. See `PLAN-001`.
- **HIGH (conditional) — client-trusted admin.** `app/admin/page.tsx:57-64` (and
  `settings/page.tsx:23-28`, `feedback/page.tsx:56-61`) grant the admin UI when
  `document.cookie.includes("isAdmin=true")` — not production-gated. Server
  enforcement rests entirely on the fragile middleware. See `PLAN-001`.
- **MEDIUM — dev bypasses.** `dev-auth/route.ts:21` accepts a hardcoded password;
  `dev-login`, `direct-access` set non-httpOnly `isAdmin` cookies. All are
  `NODE_ENV==="production"`-gated (correct), but hardcoded creds in source are poor
  hygiene. The `/admin-simple/*` middleware bypass (`middleware.ts:11-15`) guards a
  route that **does not exist** (no `app/admin-simple/`) — a latent footgun.
- **MEDIUM — config drift.** Admin allowlist hardcoded in `auth.ts:22-26`, also
  duplicated in `dev-login` and `auth/debug`; documented `ADMIN_EMAILS` control does
  not exist.

### 5.3 Public endpoint abuse surface
All six Functions are `authLevel:"anonymous"`; the SWA twins are anonymous too
(`staticwebapp.config.json:52-54`).
- **Email-bomb / cost vector (MED-HIGH):** `POST /api/waitlist` sends a Resend
  confirmation to an attacker-supplied address plus an admin notification
  (`app/api/waitlist/route.ts`). The only defense (5/hr rate limit + in-memory email
  quota) is per-instance and `x-forwarded-for`-spoofable.
- **IDOR + missing validation (MED):** `api/src/functions/feedbackSubmit.ts:22,29`
  is the one public endpoint that bypasses Zod — it writes a `feedback_responses`
  row for any `waitlist_user_id` with no ownership check and an unvalidated
  `feedbackType`.
- **CORS contradiction:** `infra/main.bicep:123-133` restricts origins with
  `supportCredentials:true`, but handlers hardcode `Access-Control-Allow-Origin:"*"`
  (`waitlist.ts:12-16`). `*` + credentials is self-cancelling; net effect is
  callable cross-origin from anywhere.
- **CSRF absent in practice:** a full validator exists (`lib/csrf.ts:69-110`) but
  has zero consumers; `/api/csrf` just returns a UUID with no cookie set. No
  state-changing route validates CSRF.

### 5.4 Platform headers
- **MEDIUM — weak CSP** (`staticwebapp.config.json:19`): `script-src` allows
  `'unsafe-inline' 'unsafe-eval'`, and `connect-src` ends in a trailing `*` that
  nullifies the connect allowlist (exfil to any origin).
- Otherwise solid: HSTS, `X-Frame-Options:DENY`, nosniff, Referrer-Policy,
  Permissions-Policy, COOP/COEP/CORP.

### 5.5 PII flow (collect → store → log → email)
- **Collect:** name + email + free-text (`lib/validation.ts`).
- **Store:** `waitlist_users`, `feedback_responses` via anon key; contact → in-memory
  mock only (not persisted).
- **Log:** name+email written to stdout → App Insights in multiple places
  (`api/src/lib/supabase.ts:94-95`, `lib/email.ts:91,124,223,257,262`). No full
  secrets logged.
- **Email:** confirmation to submitted address; admin notification with new user's
  name+email. Dev/DEBUG redirects mail to `delivered@resend.dev` (`lib/email.ts:100-106`).

### 5.6 SOC 2 evidence opportunities
Cheap wins that double as audit evidence: (1) the CI test/validation gate in
`PLAN-005` = change-management evidence; (2) ADR system in `PLAN-009` = decision
records; (3) secret rotation + history scrub in `PLAN-000` = incident-response
evidence; (4) least-privilege pass on Supabase (move writes to service-role behind
the server, verify RLS) = access-control evidence.

---

## 6. Operational Maturity

- **CI/CD:** deploy-only (`.github/workflows/azure-static-web-apps.yml`) — no lint,
  typecheck, or test runs in CI by design; validation is developer-run via
  `scripts/validate-before-push.sh`. This is the operational soft spot: **nothing
  mechanical stops a broken or untested change from deploying** (`PLAN-005`).
- **Observability:** App Insights configured for prod; admin dashboard surfaces
  email/CI stats (partly mock — `email-stats/route.ts:7-40` returns hardcoded data).
- **Backup/recovery:** weekly repo mirror to `AIStudyPlans-Backups`
  (`.github/workflows/backup-repository.yml`). Note: the backup copies working-tree
  files including the committed secret — a second reason `PLAN-000` matters.
- **Runbooks:** scattered across `docs/` as point-in-time fix logs; no consolidated
  operational doc and no ADRs (`PLAN-009`).
- **IaC:** `infra/main.bicep` provisions Functions/Storage/App Insights with KV
  references — well done, but provisions the backend that serves no traffic (R-B).

---

## 7. Top 5 Risks (likelihood × impact)

1. **Committed live Resend key is exploited** (likelihood: medium — it's in history
   and weekly-mirrored; impact: high — domain email abuse, quota theft,
   reputation). → `PLAN-000`.
2. **A real data store gets wired behind the unauthenticated admin API**, turning
   `clear-data`/admin routes into a live data-loss + PII-exposure hole (likelihood:
   medium — it's the natural next feature; impact: high). → `PLAN-001`.
3. **Backend duplication causes a silent prod bug** — a fix applied to one tree, not
   the other (likelihood: high — already happened to `rate-limit`; impact: medium).
   → `PLAN-006`.
4. **An untested change breaks the funnel in prod** — no CI gate catches it
   (likelihood: medium; impact: high — the funnel *is* the product). → `PLAN-005`.
5. **`next-auth` beta or an unpatched transitive CVE breaks or exposes auth**
   (likelihood: low-medium; impact: high). → roadmap Later (upgrade campaign) + `npm audit fix`.

## Top 5 Opportunities (value ÷ effort)

1. **Rotate + scrub the secret** (`PLAN-000`) — removes the one critical exposure;
   hours of work.
2. **Close the admin/debug attack surface** (`PLAN-001`, `PLAN-002`) — converts the
   two HIGH auth findings to closed; small, surgical, reversible.
3. **Add the CI validation gate** (`PLAN-005`) — makes the existing (passing) tests
   actually protect prod; one workflow file.
4. **Reconcile CLAUDE.md with reality** (`PLAN-004`) — compounding leverage: every
   future session of every model inherits an accurate map.
5. **Declare SWA canonical + delete the dead backend copy** (`PLAN-006`) — removes
   the single largest structural liability; medium effort, high durable payoff.

---

## 8. Verdict

**Repo health: 5 / 10.**

Justification: the funnel is live and functional, and dependency hygiene is
genuinely strong (exact pins, shrinkwrap, Trivy gate, Dependabot). But four things
hold the score at the midpoint: (1) a **live email-send credential committed to
git**, (2) **real authorization gaps** on the admin/debug API surface, (3) **the
entire backend exists in two divergent copies**, one of which is documented-but-dead
and one live-but-undocumented, and (4) **the deploy path runs no tests**. None of
these are hard to fix — they are hygiene and consolidation, not rewrites — which is
why the roadmap front-loads small, reversible, high-leverage moves. Fix the secret
and the auth surface and this is a 7; consolidate the backend and add a CI gate and
it's an 8.
