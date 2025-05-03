import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Only protect /admin routes, excluding login
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    // Redirect to login if not authenticated
    if (!token) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    
    // Verify if the authenticated user is allowed
    if (!token.isAdmin) {
      return new NextResponse("Access Denied", { status: 403 });
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
}; 