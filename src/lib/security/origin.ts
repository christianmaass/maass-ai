import 'server-only';

/**
 * Checks if an origin is allowed based on the request host and origin.
 *
 * @param origin - The Origin header value (can be null)
 * @param host - The Host header value (can be null)
 * @returns true if the origin is allowed, false otherwise
 */
export function isAllowedOrigin(origin: string | null, host: string | null): boolean {
  // If no origin header, allow (server-to-server / same-origin form posts)
  if (!origin) {
    return true;
  }

  // Parse origin URL safely
  let originHost: string;
  try {
    originHost = new URL(origin).hostname;
  } catch {
    // If parsing fails, reject
    return false;
  }

  // Extract hostname from host header (remove port if present)
  const hostName = host?.split(':')[0] ?? null;

  // Same-origin: origin hostname matches request host
  if (hostName && originHost === hostName) {
    return true;
  }

  // Production domains
  const allowedHosts = new Set(['navaa.ai', 'www.navaa.ai']);
  if (allowedHosts.has(originHost)) {
    return true;
  }

  // Preview domains: any *.vercel.app
  if (originHost.endsWith('.vercel.app')) {
    return true;
  }

  // Otherwise reject
  return false;
}

