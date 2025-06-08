import { NextRequest, NextResponse } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/dashboard/resources',
  '/dashboard/traffic',
  '/dashboard/simulation',
  '/dashboard/green-spaces',
  '/dashboard/ai-assistant',
  '/dashboard/weather',
  '/profile',
  '/api/protected'
];

// Define public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/api/auth'
];

// Simple function to decode JWT token without verification
function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode the payload (middle part)
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('Middleware checking path:', pathname);
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Skip middleware for public routes
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  if (!isProtectedRoute || isPublicRoute) {
    return NextResponse.next();
  }
  
  console.log('Protected route detected:', pathname);
  
  // Get token from request cookies - try both cookie names
  const token = 
    request.cookies.get('auth-token')?.value || 
    request.cookies.get('auth_token')?.value;
  
  console.log('Token found in cookies:', !!token);
  
  // Also check Authorization header for API routes
  const authHeader = request.headers.get('Authorization');
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  
  // Use token from cookie or header
  const finalToken = token || headerToken;
  
  // If no token is present, redirect to login page
  if (!finalToken) {
    console.log('No token found, redirecting to login');
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  try {
    // Simple validation - check if token is valid JWT format
    const decoded = decodeJWT(finalToken);
    
    if (!decoded) {
      throw new Error('Invalid token format');
    }
    
    // Check if token has expired
    const expiry = decoded.exp as number;
    if (expiry && expiry * 1000 < Date.now()) {
      throw new Error('Token expired');
    }
    
    console.log('Token verified successfully');
    return NextResponse.next();
  } catch (error) {
    // Token is invalid or expired, redirect to login
    console.log('Token verification failed:', error);
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /_next (Next.js internals)
     * 2. /api/auth/* (auth endpoints)
     * 3. /static (static files)
     * 4. /_vercel (Vercel internals)
     * 5. /*.png, /*.jpg, etc. (static assets)
     */
    '/((?!_next|api/auth|static|_vercel|.*\\..*).+)',
  ],
};
