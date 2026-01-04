import { clientEnv } from '@/lib/config/env.client';
import { serverEnv } from '@/lib/config/env.server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Use ENV-Guards
    const version = clientEnv.NEXT_PUBLIC_APP_VERSION ?? 'dev';
    const env = serverEnv.SENTRY_ENV;

    return Response.json({
      ok: true,
      version,
      env,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('ENV-Guards failed:', error);
    return Response.json(
      { error: 'Environment configuration error' },
      { status: 500 }
    );
  }
}
