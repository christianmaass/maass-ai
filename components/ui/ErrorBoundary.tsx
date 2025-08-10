import React, { Component, ReactNode } from 'react';
import { logger } from '../../lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  level?: 'minimal' | 'feature' | 'page';
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Safely extract browser context
    const getBrowserContext = () => {
      if (typeof window === 'undefined') {
        return { userAgent: 'server-side', url: 'server-side' };
      }
      return {
        userAgent: window.navigator?.userAgent ?? 'unknown',
        url: window.location?.href ?? 'unknown',
      };
    };

    const browserContext = getBrowserContext();

    // Log structured frontend error with comprehensive context
    logger.frontendError(error, errorInfo.componentStack, {
      level: this.props.level || 'feature',
      userAgent: browserContext.userAgent,
      url: browserContext.url,
      timestamp: new Date().toISOString(),
      errorBoundaryLevel: this.props.level || 'feature',
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you would send this to an error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  private handleRetry = () => {
    // Log user retry action for analytics
    logger.userAction('Error Boundary Retry', 'anonymous', {
      errorBoundaryLevel: this.props.level || 'feature',
      previousError: this.state.error?.message || 'unknown',
      retryTimestamp: new Date().toISOString(),
    });

    this.setState({ hasError: false, error: undefined });
  };

  private renderFallback() {
    const { fallback, level = 'minimal' } = this.props;

    // Use custom fallback if provided
    if (fallback) {
      return fallback;
    }

    // Default fallbacks based on level
    switch (level) {
      case 'minimal':
        return (
          <div className="p-4 text-center text-gray-600 bg-gray-50 rounded-lg border">
            <p className="text-sm">Etwas ist schiefgelaufen.</p>
            <button
              onClick={this.handleRetry}
              className="mt-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Erneut versuchen
            </button>
          </div>
        );

      case 'feature':
        return (
          <div className="p-6 text-center bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-yellow-600 mb-2">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Feature temporär nicht verfügbar
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.
            </p>
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Erneut versuchen
            </button>
          </div>
        );

      case 'page':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-red-500 text-4xl mb-4">🚨</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Seite konnte nicht geladen werden
              </h2>
              <p className="text-gray-600 mb-6">
                Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut oder kehre zur
                Startseite zurück.
              </p>
              <div className="space-y-3">
                <button
                  onClick={this.handleRetry}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Seite neu laden
                </button>
                <button
                  onClick={() => (window.location.href = '/')}
                  className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Zur Startseite
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 text-center text-red-600 bg-red-50 rounded-lg border border-red-200">
            <p>Ein Fehler ist aufgetreten.</p>
          </div>
        );
    }
  }

  render() {
    if (this.state.hasError) {
      return this.renderFallback();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
