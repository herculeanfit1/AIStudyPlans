// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { NextRequest } from "next/server";

/**
 * PLAN-001 regression guard: every `/api/admin/*` route requires an admin
 * session, at two layers, and fails closed.
 *
 * `@/auth` is mocked. Called with a function (the `auth(handler)` middleware
 * wrapper) it returns the handler, so the test drives middleware.ts's own logic
 * with `request.auth` set by hand. Called with no arguments (`await auth()` in a
 * route handler) it returns `sessionMock()`. next-auth itself is not under test;
 * a production build of the real stack was probed over HTTP when this landed
 * (see PLAN-001's execution record).
 */
const { sessionMock, clearAllFeedbackDataMock } = vi.hoisted(() => ({
  sessionMock: vi.fn(),
  clearAllFeedbackDataMock: vi.fn(),
}));

vi.mock("@/auth", () => ({
  auth: (arg?: unknown) => (typeof arg === "function" ? arg : sessionMock()),
}));

vi.mock("@/lib/admin-supabase", () => ({
  clearAllFeedbackData: () => clearAllFeedbackDataMock(),
}));

type Session = { user?: { email?: string; isAdmin?: boolean } } | null;
const ADMIN: Session = { user: { email: "admin@test.invalid", isAdmin: true } };
const NON_ADMIN: Session = { user: { email: "user@test.invalid", isAdmin: false } };

// Enumerate the admin API from the source tree, so a route added later is covered
// without editing this file.
const adminApiDir = join(__dirname, "..", "..", "app", "api", "admin");
const ADMIN_ROUTES: Array<[string, string]> = readdirSync(adminApiDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((d) => {
    const source = readFileSync(join(adminApiDir, d.name, "route.ts"), "utf8");
    const methods = [
      ...source.matchAll(/export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE)\b/g),
    ].map((m) => m[1]);
    return methods.map((method): [string, string] => [method, `/api/admin/${d.name}`]);
  });

function request(method: string, path: string, session?: unknown): NextRequest {
  const req = new NextRequest(`http://localhost${path}`, { method });
  if (session !== undefined) Object.assign(req, { auth: session });
  return req;
}

async function runMiddleware(req: NextRequest): Promise<Response> {
  const { default: middleware } = await import("@/middleware");
  return (middleware as unknown as (r: NextRequest) => Promise<Response> | Response)(req);
}

beforeEach(() => {
  sessionMock.mockReset();
  clearAllFeedbackDataMock.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("PLAN-001: middleware guards /api/admin/*", () => {
  it("enumerates the admin API (the checks below are not vacuous)", () => {
    expect(ADMIN_ROUTES.length).toBeGreaterThanOrEqual(9);
    expect(ADMIN_ROUTES).toContainEqual(["POST", "/api/admin/clear-data"]);
  });

  it("matches /api/admin/* and no longer carries the /admin-simple bypass", async () => {
    const { config } = await import("@/middleware");
    expect(config.matcher).toContain("/api/admin/:path*");
    expect(config.matcher).toContain("/admin/:path*");
    expect(config.matcher.some((m: string) => m.includes("admin-simple"))).toBe(false);
  });

  it.each(ADMIN_ROUTES)("%s %s without a session -> 401 JSON", async (method, path) => {
    const res = await runMiddleware(request(method, path, null));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it.each(ADMIN_ROUTES)("%s %s with a non-admin session -> 403 JSON", async (method, path) => {
    const res = await runMiddleware(request(method, path, NON_ADMIN));
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "Forbidden" });
  });

  it("denies a next-auth error body in place of a session (fail closed)", async () => {
    // Older next-auth betas returned the 500 body as the session object when the
    // server configuration was broken, so `request.auth` was truthy with no user.
    const errorBody = { message: "There was a problem with the server configuration." };
    const res = await runMiddleware(request("POST", "/api/admin/clear-data", errorBody));
    expect(res.status).toBe(403);
  });

  it.each(ADMIN_ROUTES)("%s %s with an admin session -> passes through", async (method, path) => {
    const res = await runMiddleware(request(method, path, ADMIN));
    expect(res.headers.get("x-middleware-next")).toBe("1");
  });

  it("still redirects an unauthenticated admin page to sign-in", async () => {
    const res = await runMiddleware(request("GET", "/admin/settings", null));
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location") ?? "").pathname).toBe("/api/auth/signin");
  });
});

describe("PLAN-001: per-route guards (defense in depth)", () => {
  const guarded = [
    {
      name: "GET /api/admin/ci-status",
      call: async () => (await import("@/app/api/admin/ci-status/route")).GET(),
    },
    {
      name: "GET /api/admin/email-stats",
      call: async () => (await import("@/app/api/admin/email-stats/route")).GET(),
    },
    {
      name: "POST /api/admin/clear-data",
      call: async () => (await import("@/app/api/admin/clear-data/route")).POST(),
    },
  ];

  describe.each(guarded)("$name", ({ name, call }) => {
    it("no session -> 401", async () => {
      sessionMock.mockResolvedValue(null);
      expect((await call()).status).toBe(401);
    });

    it("non-admin session -> 401", async () => {
      sessionMock.mockResolvedValue(NON_ADMIN);
      expect((await call()).status).toBe(401);
    });

    it("auth() throws -> 401 (fails closed, not 500 and not 200)", async () => {
      sessionMock.mockRejectedValue(new Error("auth misconfigured"));
      expect((await call()).status).toBe(401);
    });

    it("admin session -> 200", async () => {
      sessionMock.mockResolvedValue(ADMIN);
      expect((await call()).status).toBe(200);
    });

    if (name.includes("clear-data")) {
      it("does not clear data unless the caller is an admin", async () => {
        sessionMock.mockResolvedValue(null);
        await call();
        sessionMock.mockResolvedValue(NON_ADMIN);
        await call();
        sessionMock.mockRejectedValue(new Error("auth misconfigured"));
        await call();
        expect(clearAllFeedbackDataMock).not.toHaveBeenCalled();

        sessionMock.mockResolvedValue(ADMIN);
        await call();
        expect(clearAllFeedbackDataMock).toHaveBeenCalledTimes(1);
      });
    }
  });

  it.each([
    ["GET", null],
    ["GET", NON_ADMIN],
    ["POST", null],
    ["POST", NON_ADMIN],
  ] as const)("email-usage %s with session %j -> 401 (existing guard)", async (method, session) => {
    sessionMock.mockResolvedValue(session);
    const route = await import("@/app/api/admin/email-usage/route");
    const handler = method === "GET" ? route.GET : route.POST;
    const res = await handler(request(method, "/api/admin/email-usage"));
    expect(res.status).toBe(401);
  });

  const devRoutes = {
    "dev-auth": () => import("@/app/api/admin/dev-auth/route"),
    "dev-login": () => import("@/app/api/admin/dev-login/route"),
    "direct-access": () => import("@/app/api/admin/direct-access/route"),
  };

  it.each([
    ["POST", "dev-auth"],
    ["GET", "dev-login"],
    ["POST", "dev-login"],
    ["GET", "direct-access"],
  ] as const)("%s /api/admin/%s is refused in production (existing gate)", async (method, name) => {
    vi.stubEnv("NODE_ENV", "production");
    const route = (await devRoutes[name]()) as unknown as Record<
      string,
      (req: NextRequest) => Promise<Response>
    >;
    const res = await route[method](
      new NextRequest(`http://localhost/api/admin/${name}`, {
        method,
        body: method === "POST" ? JSON.stringify({}) : undefined,
      }),
    );
    expect(res.status).toBe(403);
  });
});
