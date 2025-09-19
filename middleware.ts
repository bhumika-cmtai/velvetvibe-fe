// middleware.ts (Full and Corrected Code)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// --- FIX 1: Make the payload match your backend JWT ---
interface UserPayload {
  _id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
}

const getSecretKey = () => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error('JWT Secret key is not set in environment variables!');
  }
  return new TextEncoder().encode(secret);
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  const isAdminPath = pathname.startsWith('/account/admin');
  const isUserPath = pathname.startsWith('/account/user');

  if (!token) {
    if (isAdminPath || isUserPath) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey()) as { payload: UserPayload };
    const userRole = payload.role;

    if (userRole === 'user' && isAdminPath) {
      return NextResponse.redirect(new URL('/account/user', request.url));
    }

    if (userRole === 'admin' && isUserPath) {
      return NextResponse.redirect(new URL('/account/admin', request.url));
    }

    return NextResponse.next();

  } catch (err) {
    console.error('Token verification failed:', err);
    
    // --- FIX 2: Better redirection from catch block ---
    // If token verification fails, the user is effectively logged out.
    // Redirect them to the login page.
    const loginUrl = new URL('/login', request.url);
    // Don't keep redirecting them to a page they can't access
    // loginUrl.searchParams.set('redirect', pathname); 
    
    const response = NextResponse.redirect(loginUrl);
    // Clear the invalid cookie so this doesn't happen again on the next request
    response.cookies.delete('accessToken');
    
    return response;
  }
}

export const config = {
  matcher: [
    '/account/admin/:path*',
    '/account/user/:path*',
  ],
};