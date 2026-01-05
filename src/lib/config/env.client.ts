import { z } from 'zod';

const ClientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().trim().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_VERSION: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_SENTRY_ENV: z.string().optional(),
});

// Temporäres Debug-Logging
console.log('[ENV_DEBUG] VERCEL_ENV', process.env.VERCEL_ENV);
console.log(
  '[ENV_DEBUG] NEXT_PUBLIC_SUPABASE_URL raw length',
  (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').length
);
console.log(
  '[ENV_DEBUG] NEXT_PUBLIC_SUPABASE_URL startsWith https://',
  (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').startsWith('https://')
);
console.log(
  '[ENV_DEBUG] NEXT_PUBLIC_SUPABASE_URL raw (first 80 chars)',
  (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').slice(0, 80)
);

export const clientEnv = ClientSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  NEXT_PUBLIC_SENTRY_ENV: process.env.NEXT_PUBLIC_SENTRY_ENV,
});
