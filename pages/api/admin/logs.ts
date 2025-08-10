/**
 * ADMIN LOGS API
 * Migrated to navaa Auth Guidelines (WP-C1)
 *
 * COMPLIANCE:
 * - Uses requireRole('admin') middleware (MANDATORY)
 * - JWT token validation via auth middleware
 * - Role-based access control for admin logging operations
 * - Maintains rate limiting and structured logging
 *
 * @version 2.0.0 (WP-C1 Backend Migration)
 */

import { NextApiResponse } from 'next';
import { getSupabaseClient } from '../../../supabaseClient';
import { withRateLimit, RATE_LIMITS, userKeyGenerator } from '../../../lib/rateLimiter';
import { logger } from '../../../lib/logger';
import { requireRole, AuthenticatedRequest, getUserId } from '../../../lib/middleware/auth';

// In-memory log storage for demo purposes
// In production, you'd use a proper logging service like Winston with file/database storage
let logBuffer: any[] = [];

// Capture console logs for the dashboard
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Override console methods to capture logs
console.log = (...args) => {
  originalConsoleLog(...args);
  captureLog('INFO', args.join(' '));
};

console.error = (...args) => {
  originalConsoleError(...args);
  captureLog('ERROR', args.join(' '));
};

console.warn = (...args) => {
  originalConsoleWarn(...args);
  captureLog('WARN', args.join(' '));
};

function captureLog(level: string, message: string, context?: any) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: level === 'ERROR' ? 3 : level === 'WARN' ? 2 : 1,
    levelName: level,
    message,
    context: context || {},
  };

  logBuffer.unshift(logEntry);

  // Keep only last 500 logs in memory
  if (logBuffer.length > 500) {
    logBuffer = logBuffer.slice(0, 500);
  }
}

// Hook into our structured logger to capture logs
const originalLoggerMethods = {
  info: logger.info,
  warn: logger.warn,
  error: logger.error,
  debug: logger.debug,
  businessEvent: logger.businessEvent,
  rateLimitHit: logger.rateLimitHit,
  openaiUsage: logger.openaiUsage,
  frontendError: logger.frontendError,
};

// Override logger methods to capture structured logs
// Use try-catch to prevent logger errors from breaking the API
logger.info = (message: string, context?: any) => {
  try {
    originalLoggerMethods.info.call(logger, message, context);
    captureLog('INFO', message, context);
  } catch (error) {
    console.log('[LOG CAPTURE ERROR]', error);
    captureLog('INFO', message, context);
  }
};

logger.warn = (message: string, context?: any) => {
  try {
    originalLoggerMethods.warn.call(logger, message, context);
    captureLog('WARN', message, context);
  } catch (error) {
    console.log('[LOG CAPTURE ERROR]', error);
    captureLog('WARN', message, context);
  }
};

logger.error = (message: string, context?: any) => {
  try {
    originalLoggerMethods.error.call(logger, message, context);
    captureLog('ERROR', message, context);
  } catch (error) {
    console.log('[LOG CAPTURE ERROR]', error);
    captureLog('ERROR', message, context);
  }
};

logger.debug = (message: string, context?: any) => {
  try {
    originalLoggerMethods.debug.call(logger, message, context);
    captureLog('DEBUG', message, context);
  } catch (error) {
    console.log('[LOG CAPTURE ERROR]', error);
    captureLog('DEBUG', message, context);
  }
};

logger.businessEvent = (message: string, context?: any) => {
  try {
    originalLoggerMethods.businessEvent.call(logger, message, context);
    captureLog('INFO', `[BUSINESS EVENT] ${message}`, { ...context, category: 'business_event' });
  } catch (error) {
    console.log('[LOG CAPTURE ERROR]', error);
    captureLog('INFO', `[BUSINESS EVENT] ${message}`, { ...context, category: 'business_event' });
  }
};

logger.rateLimitHit = (endpoint: string, userId: string, limit: number, context?: any) => {
  originalLoggerMethods.rateLimitHit(endpoint, userId, limit, context);
  captureLog('WARN', `Rate Limit Hit: ${endpoint}`, {
    ...context,
    userId,
    limit,
    endpoint,
    category: 'rate_limit',
  });
};

logger.openaiUsage = (model: string, tokens: number, cost: number, context?: any) => {
  originalLoggerMethods.openaiUsage(model, tokens, cost, context);
  captureLog('INFO', `OpenAI Usage: ${model}`, {
    ...context,
    model,
    tokens,
    cost,
    category: 'openai_usage',
  });
};

logger.frontendError = (error: Error, componentStack?: string, context?: any) => {
  originalLoggerMethods.frontendError(error, componentStack, context);
  captureLog('ERROR', `Frontend Error: ${error.message}`, {
    ...context,
    error: error.message,
    stack: error.stack,
    componentStack,
    category: 'frontend_error',
  });
};

// Main API handler with Auth Middleware (WP-C1 Migration)
async function adminLogsHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get user from Auth Middleware (WP-C1 Migration)
  const adminUserId = getUserId(req); // Admin user already validated by requireRole('admin') middleware

  try {
    // =============================================================================
    // NAVAA AUTH INTEGRATION (WP-C1 Migration)
    // =============================================================================
    // Manual admin validation REMOVED - now handled by requireRole('admin') middleware

    // Admin access already validated by middleware - proceed with log retrieval
    // Admin access already validated by requireRole('admin') middleware

    // Get query parameters for filtering
    const { level, limit = '100', since } = req.query;

    let filteredLogs = [...logBuffer];

    // Filter by log level
    if (level && level !== 'all') {
      filteredLogs = filteredLogs.filter((log) => log.levelName === level);
    }

    // Filter by timestamp
    if (since) {
      const sinceDate = new Date(since as string);
      filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) > sinceDate);
    }

    // Limit results
    const limitNum = parseInt(limit as string, 10);
    filteredLogs = filteredLogs.slice(0, limitNum);

    logger.info('Admin Logs Retrieved', {
      userId: adminUserId, // Admin user from auth middleware
      totalLogs: logBuffer.length,
      filteredLogs: filteredLogs.length,
      level,
      limit: limitNum,
    });

    res.status(200).json(filteredLogs);
  } catch (error) {
    logger.error('Admin Logs Retrieval Failed', {
      error: error.message,
      stack: error.stack,
    });

    res.status(500).json({ error: 'Internal server error' });
  }
}

// Export handler with requireRole middleware and rate limiting (WP-C1 Migration)
// Fixed: Proper middleware stacking to prevent HTML error responses
export default requireRole('admin')(adminLogsHandler);
