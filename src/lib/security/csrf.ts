import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { clientEnv } from '@/lib/config/env.client';

/**
 * Validates the Origin header to prevent CSRF attacks
 *
 * @param request - Next.js Request
 * @returns null if valid, NextResponse with error if invalid
 */
export function validateOrigin(request: NextRequest): NextResponse | null {
  // Skip validation for GET/HEAD/OPTIONS requests (read-only)
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return null;
  }

  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // Allow requests without Origin/Referer in development (e.g., Postman, curl)
  if (process.env.NODE_ENV === 'development' && !origin && !referer) {
    return null;
  }

  // Get allowed origins from environment
  const allowedOrigin = clientEnv.NEXT_PUBLIC_APP_URL;

  if (!allowedOrigin) {
    // If no allowed origin is configured, allow in development only
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    // In production, reject if no origin is configured
    return NextResponse.json({ error: 'Origin validation failed' }, { status: 403 });
  }

  // Extract origin from referer if origin header is missing
  const requestOrigin = origin || (referer ? new URL(referer).origin : null);

  if (!requestOrigin) {
    return NextResponse.json({ error: 'Missing origin header' }, { status: 403 });
  }

  // Validate origin matches allowed origin
  if (requestOrigin !== allowedOrigin) {
    // Log potential CSRF attempt
    console.warn(`CSRF attempt detected: Origin ${requestOrigin} does not match ${allowedOrigin}`);
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  }

  return null;
}
