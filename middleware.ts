import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const USER = process.env.BASIC_AUTH_USER;
const PASS = process.env.BASIC_AUTH_PASS;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow internal Next.js assets and public static files to bypass auth
  // This prevents blocking of /_next/image optimizer and static resources
  const isInternalOrStatic =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/assets') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.gif') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.ico');

  if (isInternalOrStatic) {
    return NextResponse.next();
  }

  // Disable auth if env vars are not configured
  if (!USER || !PASS) {
    return NextResponse.next();
  }

  // Skip auth for preflight
  if (req.method === 'OPTIONS') {
    return NextResponse.next();
  }

  const authHeader = req.headers.get('authorization') || '';
  const isBasic = authHeader.startsWith('Basic ');
  if (!isBasic) {
    return new NextResponse('Auth required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    });
  }

  try {
    const token = authHeader.split(' ')[1] || '';
    const decoded = atob(token);
    const sep = decoded.indexOf(':');
    const u = sep >= 0 ? decoded.slice(0, sep) : '';
    const p = sep >= 0 ? decoded.slice(sep + 1) : '';
    if (u === USER && p === PASS) {
      return NextResponse.next();
    }
  } catch (e) {
    // fallthrough to 401 below
  }

  return new NextResponse('Auth required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
  });
}

// Protect all application routes, but exclude internal/static above via early return
export const config = { matcher: '/:path*' };
