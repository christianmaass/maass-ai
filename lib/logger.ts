// Centralized Structured Logging System
// Production-ready logger with multiple levels and context enrichment

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
}

export interface LogContext {
  userId?: string;
  requestId?: string;
  endpoint?: string;
  duration?: number;
  error?: string;
  metadata?: Record<string, any>;
  // Additional fields for specific log types
  limit?: number;
  event?: string;
  operation?: string;
  action?: string;
  stack?: string;
  componentStack?: string;
  category?: string;
  model?: string;
  tokens?: number;
  cost?: number;
  success?: boolean;
  [key: string]: any; // Allow additional properties
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  levelName: string;
  message: string;
  context: LogContext;
  environment: string;
}

class Logger {
  private minLevel: LogLevel;
  private environment: string;

  constructor() {
    // Set log level based on environment
    this.environment = process.env.NODE_ENV || 'development';
    this.minLevel = this.environment === 'production' ? LogLevel.INFO : LogLevel.DEBUG;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  private formatLogEntry(level: LogLevel, message: string, context: LogContext = {}): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      levelName: LogLevel[level],
      message,
      context: {
        ...context,
        requestId: context.requestId || this.generateRequestId(),
      },
      environment: this.environment,
    };
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private output(logEntry: LogEntry): void {
    if (!this.shouldLog(logEntry.level)) return;

    // In production, you might want to send to external service (e.g., Sentry, LogRocket)
    // For now, we use structured console logging
    const logString = JSON.stringify(logEntry, null, this.environment === 'development' ? 2 : 0);

    switch (logEntry.level) {
      case LogLevel.DEBUG:
        console.debug(logString);
        break;
      case LogLevel.INFO:
        console.info(logString);
        break;
      case LogLevel.WARN:
        console.warn(logString);
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(logString);
        break;
    }
  }

  // Public logging methods
  debug(message: string, context?: LogContext): void {
    const logEntry = this.formatLogEntry(LogLevel.DEBUG, message, context);
    this.output(logEntry);
  }

  info(message: string, context?: LogContext): void {
    const logEntry = this.formatLogEntry(LogLevel.INFO, message, context);
    this.output(logEntry);
  }

  warn(message: string, context?: LogContext): void {
    const logEntry = this.formatLogEntry(LogLevel.WARN, message, context);
    this.output(logEntry);
  }

  error(message: string, context?: LogContext): void {
    const logEntry = this.formatLogEntry(LogLevel.ERROR, message, context);
    this.output(logEntry);
  }

  critical(message: string, context?: LogContext): void {
    const logEntry = this.formatLogEntry(LogLevel.CRITICAL, message, context);
    this.output(logEntry);
  }

  // Convenience methods for common use cases
  apiCall(endpoint: string, duration: number, success: boolean, context?: LogContext): void {
    const message = `API Call ${success ? 'Success' : 'Failed'}: ${endpoint}`;
    const logContext = {
      ...context,
      endpoint,
      duration,
      success,
    };

    if (success) {
      this.info(message, logContext);
    } else {
      this.error(message, logContext);
    }
  }

  rateLimitHit(endpoint: string, userId: string, limit: number, context?: LogContext): void {
    this.warn('Rate Limit Exceeded', {
      ...context,
      endpoint,
      userId,
      limit,
      event: 'rate_limit_hit',
    });
  }

  businessEvent(event: string, context?: LogContext): void {
    this.info(`Business Event: ${event}`, {
      ...context,
      event,
      category: 'business',
    });
  }

  performanceMetric(operation: string, duration: number, context?: LogContext): void {
    const level = duration > 5000 ? LogLevel.WARN : LogLevel.INFO; // Warn if > 5 seconds
    const message = `Performance: ${operation} took ${duration}ms`;

    const logEntry = this.formatLogEntry(level, message, {
      ...context,
      operation,
      duration,
      category: 'performance',
    });

    this.output(logEntry);
  }

  userAction(action: string, userId: string, context?: LogContext): void {
    this.info(`User Action: ${action}`, {
      ...context,
      userId,
      action,
      category: 'user_action',
    });
  }

  // Error boundary integration
  frontendError(error: Error, componentStack?: string, context?: LogContext): void {
    this.error('Frontend Error Boundary Triggered', {
      ...context,
      error: error.message,
      stack: error.stack,
      componentStack,
      category: 'frontend_error',
    });
  }

  // OpenAI cost tracking
  openaiUsage(
    model: string,
    tokens: number,
    cost: number,
    userId: string,
    context?: LogContext,
  ): void {
    this.info('OpenAI Usage', {
      ...context,
      userId,
      model,
      tokens,
      cost,
      category: 'openai_usage',
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Types are already exported above as interfaces

// Utility function to create request-scoped logger
export function createRequestLogger(requestId: string, userId?: string) {
  return {
    debug: (message: string, context?: LogContext) =>
      logger.debug(message, { ...context, requestId, userId }),
    info: (message: string, context?: LogContext) =>
      logger.info(message, { ...context, requestId, userId }),
    warn: (message: string, context?: LogContext) =>
      logger.warn(message, { ...context, requestId, userId }),
    error: (message: string, context?: LogContext) =>
      logger.error(message, { ...context, requestId, userId }),
    critical: (message: string, context?: LogContext) =>
      logger.critical(message, { ...context, requestId, userId }),
  };
}

// Helper to extract user ID from request
export function extractUserIdFromRequest(req: any): string | undefined {
  // Try different sources for user ID
  return req.body?.user_id || req.query?.user_id || req.headers?.['x-user-id'] || undefined;
}

// Performance timing helper
export function createPerformanceTimer(operation: string, context?: LogContext) {
  const startTime = Date.now();

  return {
    end: (additionalContext?: LogContext) => {
      const duration = Date.now() - startTime;
      logger.performanceMetric(operation, duration, {
        ...context,
        ...additionalContext,
      });
      return duration;
    },
  };
}
