import 'server-only';
import { isAllowedOrigin } from './origin';

/**
 * Asserts that the request origin is allowed.
 * Throws a Response with 403 status if the origin is not allowed.
 *
 * @param request - The request object (Request or NextRequest)
 * @throws {Response} If origin validation fails
 */
export function assertAllowedOrigin(request: Request): void {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  if (!isAllowedOrigin(origin, host)) {
    console.error('[SECURITY] Origin blocked', { origin, host });
    throw new Response('Origin validation failed', { status: 403 });
  }
}

