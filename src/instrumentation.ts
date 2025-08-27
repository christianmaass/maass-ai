export async function register() {
  if (process.env.SENTRY_DSN) {
    // Only import and initialize Sentry if DSN is configured
    const Sentry = await import('./sentry.server.config');
    console.log('Sentry instrumentation enabled');
  }
}
