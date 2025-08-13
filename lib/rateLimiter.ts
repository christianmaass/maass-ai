import { NextApiRequest, NextApiResponse } from 'next';
import { logger, extractUserIdFromRequest } from './logger';

// Rate limit configuration interface
interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: NextApiRequest) => string; // Custom key generator
  skipSuccessfulRequests?: boolean; // Only count failed requests
  skipFailedRequests?: boolean; // Only count successful requests
  onLimitReached?: (req: NextApiRequest, res: NextApiResponse) => void;
}

// In-memory store for rate limiting (simple and safe)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Predefined rate limit configurations
export const RATE_LIMITS = {
  // OpenAI endpoints - very conservative limits to protect costs
  openai: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 requests per minute (very safe)
  },

  // Database-intensive endpoints
  database: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 50, // 50 requests per minute
  },

  // Admin endpoints - more restrictive
  admin: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 20, // 20 requests per 5 minutes
  },

  // General endpoints - generous limits
  general: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
  },
};

// Default key generator - uses IP address
const defaultKeyGenerator = (req: NextApiRequest): string => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.toString().split(',')[0] : req.socket.remoteAddress;
  return `ip:${ip}`;
};

// User-based key generator (for authenticated requests)
export const userKeyGenerator = (req: NextApiRequest): string => {
  // Try to extract user ID from various sources
  const authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      // Simple extraction - in production you'd decode the JWT properly
      const token = authHeader.replace('Bearer ', '');
      // For now, use a hash of the token as user identifier
      const userId = Buffer.from(token).toString('base64').slice(0, 10);
      return `user:${userId}`;
    } catch (error) {
      console.warn('Failed to extract user ID from token:', error);
    }
  }

  // Fallback to IP-based limiting
  return defaultKeyGenerator(req);
};

// Check if request is within rate limit
async function checkRateLimit(
  req: NextApiRequest,
  config: RateLimitConfig,
): Promise<{
  allowed: boolean;
  remaining: number;
  resetTime: number;
  totalHits: number;
}> {
  const keyGenerator = config.keyGenerator || defaultKeyGenerator;
  const key = keyGenerator(req);
  const now = Date.now();

  // Clean up expired entries (simple cleanup)
  for (const [entryKey, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(entryKey);
    }
  }

  // Get or create entry for this key
  let entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired entry
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
  }

  // Check if limit is exceeded
  const allowed = entry.count < config.maxRequests;

  if (allowed) {
    entry.count++;
  }

  return {
    allowed,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetTime: entry.resetTime,
    totalHits: entry.count,
  };
}

// Main rate limiting middleware
export function withRateLimit(
  config: RateLimitConfig,
  handler: (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>,
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Check rate limit
      const result = await checkRateLimit(req, config);

      // Add rate limit headers (standard practice)
      res.setHeader('X-RateLimit-Limit', config.maxRequests);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000));

      if (!result.allowed) {
        // Rate limit exceeded
        const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);

        res.setHeader('Retry-After', retryAfter);

        // Call custom handler if provided
        if (config.onLimitReached) {
          config.onLimitReached(req, res);
          return;
        }

        // Log rate limit hit with structured logging
        const userId = extractUserIdFromRequest(req);
        logger.rateLimitHit(req.url || 'unknown', userId || 'anonymous', config.maxRequests, {
          currentCount: result.totalHits,
          retryAfter,
          windowMs: config.windowMs,
          keyType: userId ? 'user' : 'ip',
        });

        // Default rate limit response
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: 'Du hast zu viele Anfragen gesendet. Bitte warte einen Moment.',
          retryAfter,
          limit: config.maxRequests,
          windowMs: config.windowMs,
          remaining: result.remaining,
        });
      }

      // Rate limit passed, execute original handler
      return await handler(req, res);
    } catch (error) {
      console.error('Rate limiter error:', error);

      // On rate limiter error, allow request to proceed (fail-open)
      // This ensures the application doesn't break if rate limiting fails
      console.warn('Rate limiting failed, allowing request to proceed');
      return await handler(req, res);
    }
  };
}

// Convenience function for OpenAI endpoints
export const withOpenAIRateLimit = (
  handler: (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>,
) => {
  return withRateLimit(
    {
      ...RATE_LIMITS.openai,
      keyGenerator: userKeyGenerator,
      onLimitReached: (req, res) => {
        const retryAfter = Math.ceil(RATE_LIMITS.openai.windowMs / 1000);
        res.status(429).json({
          error: 'OpenAI rate limit exceeded',
          message: 'Du hast zu viele AI-Anfragen gesendet. Bitte warte 1 Minute.',
          retryAfter,
          upgradeHint: 'Premium-User erhalten höhere Limits für AI-Features.',
        });
      },
    },
    handler,
  );
};

// Convenience function for admin endpoints
export const withAdminRateLimit = (
  handler: (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>,
) => {
  return withRateLimit(
    {
      ...RATE_LIMITS.admin,
      keyGenerator: userKeyGenerator,
      onLimitReached: (req, res) => {
        const retryAfter = Math.ceil((5 * 60 * 1000) / 1000); // 5 minutes
        res.status(429).json({
          error: 'Admin rate limit exceeded',
          message: 'Zu viele Admin-Aktionen. Bitte warte 5 Minuten.',
          retryAfter,
        });
      },
    },
    handler,
  );
};

// Export for testing and monitoring
export const getRateLimitStats = () => {
  const stats = {
    totalKeys: rateLimitStore.size,
    entries: Array.from(rateLimitStore.entries()).map(([key, entry]) => ({
      key: key.replace(/^(ip|user):/, ''), // Remove prefix for privacy
      count: entry.count,
      resetTime: new Date(entry.resetTime).toISOString(),
    })),
  };

  return stats;
};

// Cleanup function (can be called periodically)
export const cleanupExpiredEntries = () => {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
      cleaned++;
    }
  }

  console.log(`Cleaned up ${cleaned} expired rate limit entries`);
  return cleaned;
};
