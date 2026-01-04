import { createServerClient } from '@/lib/db';
import { getAuthUser } from '@/lib/auth/guards';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Prüfe, ob User eingeloggt ist
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in first.' },
        { status: 401 }
      );
    }

    const supabase = await createServerClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
