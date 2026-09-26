import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((request) => {
  const path = request.nextUrl.pathname;

  // Allow access to auth routes
  if (path.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Protect admin pages AND the admin API. `/api/admin/*` starts with `/api`, so
  // before PLAN-001 it missed the `/admin` branch and reached its handler
  // unauthenticated. API paths get JSON 401/403; pages keep the sign-in redirect.
  // Fails closed: when next-auth cannot produce a session (including a server
  // configuration error), `request.auth` is null and the request is denied.
  const isApi = path.startsWith("/api/admin");
  if (path.startsWith("/admin") || isApi) {
    const session = request.auth;

    if (!session) {
      if (isApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      console.log(`No auth session, redirecting from: ${path}`);
      const url = new URL("/api/auth/signin", request.url);
      url.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // If session exists, check admin status
    if (!session.user?.isAdmin) {
      if (isApi) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return new NextResponse("Access Denied: Admin role required", { status: 403 });
    }

    // Admin user with valid session - allow access
    console.log(`Authenticated admin access to: ${path}`);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
