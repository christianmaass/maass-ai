import 'server-only';
import * as Sentry from '@sentry/nextjs';
import { serverEnv } from '@/lib/config/env.server';

Sentry.init({
  dsn: serverEnv.SENTRY_DSN,
  environment: serverEnv.SENTRY_ENV,
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,
});
