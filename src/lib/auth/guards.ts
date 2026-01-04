import { createServerClient } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function requireAuth() {
  const supabase = await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  const supabase = await createServerClient();

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || profile?.role !== 'admin') {
    redirect('/');
  }

  return { user, profile };
}

/**
 * API-spezifische Auth-Funktion für API Routes
 * Gibt null zurück, wenn kein User eingeloggt ist (statt redirect)
 */
export async function getAuthUser() {
  const supabase = await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * API-spezifische Admin-Funktion für API Routes
 * Gibt null zurück, wenn User nicht Admin ist (statt redirect)
 */
export async function getAdminUser() {
  const user = await getAuthUser();
  if (!user) {
    return null;
  }

  const supabase = await createServerClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || profile?.role !== 'admin') {
    return null;
  }

  return { user, profile };
}
