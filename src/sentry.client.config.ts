import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const SENTRY_ENV = process.env.NEXT_PUBLIC_SENTRY_ENV || process.env.NODE_ENV;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENV,

    // Performance monitoring
    tracesSampleRate: 0.1,

    // Error sampling
    sampleRate: 0.1,

    // Client-specific settings
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: ['localhost', 'your-domain.com'],
      }),
    ],

    // Only capture errors in production
    beforeSend(event) {
      if (process.env.NODE_ENV === 'development') {
        return null;
      }
      return event;
    },
  });
}

export default Sentry;
