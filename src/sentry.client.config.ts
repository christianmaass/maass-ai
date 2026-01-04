import * as Sentry from '@sentry/nextjs';

import { clientEnv } from '@/lib/config/env.client';

// Only initialize in browser environment
if (typeof window !== 'undefined') {
  Sentry.init({
    dsn: clientEnv.NEXT_PUBLIC_SENTRY_DSN,
    environment: clientEnv.NEXT_PUBLIC_SENTRY_ENV,
    tracesSampleRate: 0.1,
    integrations: [Sentry.browserTracingIntegration()],
  });
}
