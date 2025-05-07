import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isDevEnv = process.env.NODE_ENV !== 'production';
  
  // Only protect /admin routes, excluding login
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    // Check for dev login via isAdmin cookie
    const cookieHeader = request.headers.get('cookie') || '';
    const isDevAdmin = /isAdmin=true/.test(cookieHeader);

    if (!token) {
      if (isDevEnv && isDevAdmin) {
        return NextResponse.next();
      }
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    
    // If token exists, allow if admin, else check dev cookie (only in dev)
    if (!token.isAdmin) {
      if (isDevEnv && isDevAdmin) {
        return NextResponse.next();
      }
      return new NextResponse("Access Denied", { status: 403 });
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
}; 