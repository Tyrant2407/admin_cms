import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'automateriz-secret-key-2024';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only target admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('automateriz_token')?.value;

    // 1. Trying to access admin panel pages (not login page)
    if (pathname !== '/admin/login') {
      if (!token) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        await jwtVerify(token, secret);
        // Valid token, allow access
        return NextResponse.next();
      } catch (error) {
        // Invalid or expired token, redirect to login and clear corrupt cookie
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('automateriz_token');
        return response;
      }
    }

    // 2. Trying to access login page while already authenticated
    if (pathname === '/admin/login' && token) {
      try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        await jwtVerify(token, secret);
        // Valid token, redirect to dashboard directly
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } catch {
        // Token is invalid/expired, let them see the login page
      }
    }
  }

  return NextResponse.next();
}

// Configure which paths the proxy runs on
export const config = {
  matcher: ['/admin/:path*'],
};
