import { serverEnv } from '@/lib/config/env.server';

export async function register() {
  if (!serverEnv.SENTRY_DSN) return;
  await import('./src/sentry.server.config'); // kein client-import
}
