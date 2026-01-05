import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { clientEnv } from '@/lib/config/env.client';

export async function createServerClient() {
  const cookieStore = await cookies();

  // Use ENV-Guards
  const supabaseUrl = clientEnv.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration not found. Please check your environment variables.');
  }

  return createSupabaseServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>
      ) {
        try {
          cookiesToSet.forEach(
            ({
              name,
              value,
              options,
            }: {
              name: string;
              value: string;
              options?: Record<string, unknown>;
            }) => {
              // SECURITY: Explicitly set secure cookie attributes
              cookieStore.set(name, value, {
                ...options,
                httpOnly: true, // Prevent XSS attacks
                secure: process.env.NODE_ENV === 'production', // HTTPS only in production
                sameSite: 'lax', // CSRF protection
                path: '/',
              });
            }
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}
