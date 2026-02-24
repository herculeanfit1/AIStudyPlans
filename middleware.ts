import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((request) => {
  const path = request.nextUrl.pathname;

  // Always allow access to admin-simple routes (development bypass)
  if (path.startsWith("/admin-simple")) {
    console.log(`Admin-simple bypass: allowing access to ${path}`);
    return NextResponse.next();
  }

  // Allow access to auth routes
  if (path.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Only protect /admin routes
  if (path.startsWith("/admin")) {
    const session = request.auth;

    if (!session) {
      console.log(`No auth session, redirecting from: ${path}`);
      const url = new URL("/api/auth/signin", request.url);
      url.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // If session exists, check admin status
    if (!session.user?.isAdmin) {
      return new NextResponse("Access Denied: Admin role required", { status: 403 });
    }

    // Admin user with valid session - allow access
    console.log(`Authenticated admin access to: ${path}`);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/admin-simple/:path*"],
};
