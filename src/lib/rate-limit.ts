import 'server-only';
import { NextRequest } from 'next/server';
import { getCache, setCache } from '@/lib/cache';

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * In-memory Fallback für Rate-Limiting (wenn Redis nicht verfügbar)
 */
const memoryStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Extrahiert die Client-IP aus dem Request
 * SECURITY: Nur vertrauenswürdige Quellen werden verwendet, um IP-Spoofing zu verhindern
 */
function getClientIP(request: NextRequest): string {
  // Cloudflare (vertrauenswürdig - kann nicht von Client manipuliert werden)
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP.split(',')[0].trim();
  }

  // Direkte Verbindung (kein Proxy) - request.ip ist vertrauenswürdig
  if (request.ip) {
    return request.ip;
  }

  // SECURITY: x-forwarded-for und x-real-ip können von Clients manipuliert werden
  // Nur in Development verwenden, wenn kein Proxy vorhanden ist
  if (process.env.NODE_ENV === 'development') {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    
    if (forwardedFor) {
      // In Development: Nehme erste IP, aber logge Warnung
      console.warn('Using x-forwarded-for in development - not secure for production');
      return forwardedFor.split(',')[0].trim();
    }
    if (realIP) {
      console.warn('Using x-real-ip in development - not secure for production');
      return realIP.trim();
    }
  }

  // Fallback: Warnung loggen wenn IP nicht bestimmt werden kann
  console.warn('Could not determine client IP - using fallback');
  return 'unknown';
}

/**
 * Rate-Limiting mit Redis (Upstash) oder in-memory Fallback
 * 
 * @param request - Next.js Request
 * @param limit - Maximale Anzahl Requests
 * @param windowSeconds - Zeitfenster in Sekunden
 * @param identifier - Optional: Zusätzlicher Identifier (z.B. User-ID)
 * @returns RateLimitResult
 */
export async function rateLimit(
  request: NextRequest,
  limit: number = 5,
  windowSeconds: number = 900, // 15 Minuten
  identifier?: string
): Promise<RateLimitResult> {
  const ip = getClientIP(request);
  const key = identifier 
    ? `rate-limit:${identifier}:${ip}`
    : `rate-limit:${ip}`;
  
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const resetAt = now + windowMs;

  try {
    // Versuche Redis zu nutzen
    const cached = await getCache<{ count: number; resetAt: number }>(key);
    
    if (cached) {
      // Prüfe ob Window abgelaufen ist
      if (now > cached.resetAt) {
        // Window abgelaufen, starte neu
        await setCache(key, { count: 1, resetAt }, windowSeconds);
        return {
          success: true,
          limit,
          remaining: limit - 1,
          reset: resetAt,
        };
      }

      // Prüfe ob Limit erreicht
      if (cached.count >= limit) {
        return {
          success: false,
          limit,
          remaining: 0,
          reset: cached.resetAt,
        };
      }

      // Erhöhe Counter
      const newCount = cached.count + 1;
      const ttl = Math.ceil((cached.resetAt - now) / 1000);
      await setCache(key, { count: newCount, resetAt: cached.resetAt }, ttl);

      return {
        success: true,
        limit,
        remaining: limit - newCount,
        reset: cached.resetAt,
      };
    }

    // Erster Request in diesem Window
    await setCache(key, { count: 1, resetAt }, windowSeconds);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: resetAt,
    };
  } catch (error) {
    // Redis nicht verfügbar, nutze in-memory Fallback
    console.warn('Redis rate-limit failed, using memory fallback:', error);
    
    const cached = memoryStore.get(key);
    
    if (cached) {
      if (now > cached.resetAt) {
        // Window abgelaufen
        memoryStore.set(key, { count: 1, resetAt });
        return {
          success: true,
          limit,
          remaining: limit - 1,
          reset: resetAt,
        };
      }

      if (cached.count >= limit) {
        return {
          success: false,
          limit,
          remaining: 0,
          reset: cached.resetAt,
        };
      }

      cached.count += 1;
      return {
        success: true,
        limit,
        remaining: limit - cached.count,
        reset: cached.resetAt,
      };
    }

    // Erster Request
    memoryStore.set(key, { count: 1, resetAt });
    
    // Cleanup alte Einträge (alle 100 Requests)
    if (memoryStore.size > 1000) {
      for (const [k, v] of memoryStore.entries()) {
        if (now > v.resetAt) {
          memoryStore.delete(k);
        }
      }
    }

    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: resetAt,
    };
  }
}

