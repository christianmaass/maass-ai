import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const USER = process.env.BASIC_AUTH_USER;
const PASS = process.env.BASIC_AUTH_PASS;

export function middleware(req: NextRequest) {
  const auth = req.headers.get('authorization');

  if (auth && USER && PASS) {
    const [u, p] = atob(auth.split(' ')[1] ?? '').split(':');
    if (u === USER && p === PASS) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

// schützt ALLE Seiten – für bestimmte Routen anpassen
export const config = { matcher: '/:path*' };
