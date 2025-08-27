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
    redirect('/catalog');
  }

  return { user, profile };
}
