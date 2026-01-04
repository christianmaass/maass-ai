import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';

import { clientEnv } from '@/lib/config/env.client';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for test environment if no Supabase config
  if (!clientEnv.NEXT_PUBLIC_SUPABASE_URL || !clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Supabase environment variables not found, skipping middleware');
    return NextResponse.next();
  }

  // Check if route requires authentication
  const isProtectedRoute =
    pathname.startsWith('/app') || pathname.startsWith('/admin') || pathname.startsWith('/courses');

  // Skip authentication for public routes
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // SECURITY: Validate token instead of just checking cookie existence
  // This prevents access with invalid/expired tokens
  // Note: This makes an API call to Supabase. For better performance, consider
  // JWT signature verification without API calls (requires JWT secret).
  try {
    const supabase = createSupabaseServerClient(
      clientEnv.NEXT_PUBLIC_SUPABASE_URL!,
      clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(
            _cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>
          ) {
            // Middleware can't set cookies, but Supabase SDK expects this
            // The actual cookie setting happens in the route handlers
          },
        },
      }
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      // Invalid or expired token - redirect to login
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // User has valid session, continue
    return NextResponse.next();
  } catch (error) {
    // Error during token validation - redirect to login for safety
    console.error('Middleware auth error:', error);
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/app/:path*', '/admin/:path*', '/courses/:path*'],
};
