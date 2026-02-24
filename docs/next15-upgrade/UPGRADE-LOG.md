# Next.js 15 Upgrade Log

## Overview

| Field | Value |
|-------|-------|
| **Date started** | 2026-02-23 |
| **Branch** | `next15-upgrade` |
| **Starting versions** | Next 14.2.31, React 18.3.1, next-auth 4.24.12 |
| **Target versions** | Next 15.x, React 19.x, next-auth 5.x (Auth.js) |
| **Baseline commit** | b4f4fc09 (`main`) |

## Baseline State

- Lint: PASS
- Typecheck: PASS
- Unit tests: 54/54 PASS
- E2E tests: 1/17 pass (pre-existing environmental failures — see `phase0-baseline.md`)

## Phase Tracking

- [x] **Phase 0** — Create upgrade branch and establish baseline
- [ ] **Phase 1** — Upgrade Next.js 14 → 15 (keep React 18)
- [ ] **Phase 2** — Upgrade React 18 → 19 + types
- [ ] **Phase 3** — Async API migration (headers, cookies, params, searchParams)
- [ ] **Phase 4** — Upgrade next-auth 4 → 5 (Auth.js)
- [ ] **Phase 5** — ESLint flat config migration (eslint-config-next 15)
- [ ] **Phase 6** — Clean up deprecated patterns and update configs
- [ ] **Phase 7** — Final validation, docs update, merge to main

## Phase Notes

### Phase 0 — Baseline (2026-02-23)

- Branch created from `main` at b4f4fc09
- Full baseline documented in `phase0-baseline.md`
- Dependency snapshot saved to `deps-before.txt`
- All code-level checks pass; E2E failures are environmental (missing auth env vars, visual snapshot diffs)
