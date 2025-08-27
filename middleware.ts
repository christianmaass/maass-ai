import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { PROTECTED_ROUTES, AUTH_ROUTES } from '@/lib/constants/routes';

export async function middleware(request: NextRequest) {
  // Skip middleware for test environment if no Supabase config
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Supabase environment variables not found, skipping middleware');
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it so that
  // users can't log out.

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Log for debugging in development with explicit debug flag
  if (process.env.NODE_ENV === 'development' && process.env.DEBUG_AUTH) {
    console.log('Middleware Debug:', {
      path: request.nextUrl.pathname,
      hasUser: !!user,
      authError: error?.message,
    });
  }

  // Define protected routes that require authentication
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) =>
      request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + '/')
  );

  // Redirect unauthenticated users from protected routes to login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users from login/register to catalog
  if (user && AUTH_ROUTES.includes(request.nextUrl.pathname as (typeof AUTH_ROUTES)[number])) {
    const url = request.nextUrl.clone();
    url.pathname = '/catalog';
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
