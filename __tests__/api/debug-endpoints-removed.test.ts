// @vitest-environment node
import { existsSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

/**
 * PLAN-002 regression guard: production debug endpoints must not exist.
 *
 * The App Router serves `app/api/<path>/route.ts` at `/api/<path>`. With no route
 * file there, the path 404s -- except `/api/auth/debug`, which then falls through
 * to the `auth/[...nextauth]` catch-all and gets next-auth's generic 400
 * "Bad request.". These four disclosed env/config state (one returned the first and
 * last 3 characters of the Resend API key; another echoed the admin allowlist) and
 * were reachable unauthenticated in production.
 *
 * This is a source-tree check, not an HTTP check: it fails if any of the removed
 * route handlers is re-added, or if a new `app/api/**` route with "debug" in its
 * path appears. The HTTP responses were verified against `next start` when this
 * landed (see PLAN-002's execution record).
 */
const repoRoot = join(__dirname, "..", "..");
const apiRoot = join(repoRoot, "app", "api");

const REMOVED_ROUTES = [
  "app/api/debug-env",
  "app/api/debug-waitlist",
  "app/api/auth/debug",
  "app/api/debug-email",
];

const ROUTE_FILE = /^route\.(ts|tsx|js|jsx|mjs|cjs)$/;

function findRouteFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return findRouteFiles(full);
    return ROUTE_FILE.test(entry.name) ? [full] : [];
  });
}

describe("PLAN-002: production debug endpoints are removed", () => {
  it("finds the API route tree it is guarding (the check is not vacuous)", () => {
    // If app/api moved, the checks below would pass over nothing.
    expect(findRouteFiles(apiRoot).length).toBeGreaterThan(5);
  });

  it.each(REMOVED_ROUTES)("%s has no route handler", (routeDir) => {
    const dir = join(repoRoot, routeDir);
    const present = existsSync(dir) ? readdirSync(dir).filter((f) => ROUTE_FILE.test(f)) : [];
    expect(present).toEqual([]);
  });

  it("no app/api route has a path segment containing 'debug'", () => {
    const offenders = findRouteFiles(apiRoot)
      .map((file) => relative(repoRoot, file).split(sep).join("/"))
      .filter((file) =>
        file
          .split("/")
          .slice(0, -1)
          .some((segment) => /debug/i.test(segment)),
      );
    expect(offenders).toEqual([]);
  });
});
