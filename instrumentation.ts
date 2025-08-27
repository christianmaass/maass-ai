export async function register() {
  if (!process.env.SENTRY_DSN) return;
  await import('./src/sentry.server.config');
  await import('./src/sentry.client.config');
}
