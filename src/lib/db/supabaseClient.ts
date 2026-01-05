import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr';
import { clientEnv } from '@/lib/config/env.client';

export function createBrowserClient() {
  // Use ENV-Guards
  const supabaseUrl = clientEnv.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration not found. Please check your environment variables.');
  }

  return createSupabaseBrowserClient(supabaseUrl, supabaseKey);
}
