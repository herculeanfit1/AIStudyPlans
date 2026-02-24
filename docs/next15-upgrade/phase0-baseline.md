# Phase 0 — Baseline Test Results

**Date**: 2026-02-23
**Branch**: `next15-upgrade` (from `main` at commit b4f4fc09)
**Node**: 20.19.1 | **npm**: 10.x

---

## Lint (`npm run lint`)

```
✔ No ESLint warnings or errors
```

**Result: PASS**

---

## Type Check (`npm run typecheck`)

```
tsc --noEmit
(no errors)
```

**Result: PASS**

---

## Unit Tests (`npm test`)

```
Test Suites: 8 passed, 8 total
Tests:       54 passed, 54 total
Snapshots:   0 total
Time:        ~8s
```

**Result: PASS (54/54)**

### Console warnings (non-blocking)

- `ReactDOMTestUtils.act` deprecation — React 18 warns to use `React.act` instead of `react-dom/test-utils`. This will resolve naturally with React 19 upgrade.

---

## E2E Tests (`npm run test:e2e`)

```
17 tests total
 1 passed
 1 skipped
15 failed
```

**Result: FAIL — pre-existing environmental failures (not code regressions)**

### Failure analysis

All 15 failures are environmental, not code bugs:

| Category | Count | Root cause |
|----------|-------|------------|
| Admin dashboard auth | 6 | Missing NextAuth env vars / Azure AD config for local E2E |
| Landing page elements | 2 | `header` and `#pricing` not found — page doesn't fully render without backend services |
| Visual regression snapshots | 7 | Screenshot comparison failures (expected with environment differences) |

These failures exist identically on `main` and are not a gate blocker for the upgrade. The meaningful baseline is:

- **Lint**: PASS
- **Typecheck**: PASS
- **Unit tests**: 54/54 PASS
- **E2E**: 1/17 pass (pre-existing env issues, not code regressions)

---

## Summary

The codebase is in a clean state for the Next.js 15 upgrade. All code-level checks (lint, types, unit tests) pass. E2E failures are environmental and pre-date this branch.
