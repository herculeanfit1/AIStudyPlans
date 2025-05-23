import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isDevEnv = process.env.NODE_ENV !== 'production';
  
  // Always allow access to admin-simple routes
  if (path.startsWith("/admin-simple")) {
    console.log(`Admin-simple bypass: allowing access to ${path}`);
    return NextResponse.next();
  }
  
  // Allow access to development login and bypass pages in development mode
  if (isDevEnv && (
    path.startsWith("/admin/manual-login") || 
    path.startsWith("/admin/test-login") ||
    path.startsWith("/admin/direct-access") ||
    path.startsWith("/api/admin/direct-access") ||
    path.startsWith("/api/admin/dev-login")
  )) {
    console.log(`Development access allowed to: ${path}`);
    return NextResponse.next();
  }
  
  // Only protect /admin routes, excluding login
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    // Check for dev login via isAdmin cookie immediately
    const cookieHeader = request.headers.get('cookie') || '';
    const isDevAdmin = /isAdmin=true/.test(cookieHeader);
    
    // In development mode, allow admin cookie to bypass authentication
    if (isDevEnv && isDevAdmin) {
      console.log(`Dev admin cookie detected, allowing access to: ${path}`);
      return NextResponse.next();
    }
    
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      console.log(`No auth token, redirecting from: ${path}`);
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    
    // If token exists, check admin status
    if (!token.isAdmin) {
      return new NextResponse("Access Denied: Admin role required", { status: 403 });
    }
    
    // Admin user with valid token - allow access
    console.log(`Authenticated admin access to: ${path}`);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/admin-simple/:path*"],
}; 