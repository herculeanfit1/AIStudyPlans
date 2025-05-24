import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isDevEnv = process.env.NODE_ENV !== 'production';
  
  // Always allow access to admin-simple routes (development bypass)
  if (path.startsWith("/admin-simple")) {
    console.log(`Admin-simple bypass: allowing access to ${path}`);
    return NextResponse.next();
  }
  
  // Allow access to NextAuth routes
  if (path.startsWith("/api/auth")) {
    return NextResponse.next();
  }
  
  // Allow access to the custom admin login page (it's the sign-in page)
  if (path === "/admin/login") {
    return NextResponse.next();
  }
  
  // Only protect /admin routes (excluding login)
  if (path.startsWith("/admin")) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      console.log(`No auth token, redirecting from: ${path}`);
      // Redirect to NextAuth's default sign-in page with Azure AD
      const url = new URL("/api/auth/signin", request.url);
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