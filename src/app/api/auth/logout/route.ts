import { createServerClient } from '@/lib/db';
import { getAuthUser } from '@/lib/auth/guards';
import { assertAllowedOrigin } from '@/lib/security/guard';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Origin validation
  try {
    assertAllowedOrigin(request);
  } catch (error) {
    // assertAllowedOrigin throws a Response on validation failure
    if (error instanceof Response) {
      return error;
    }
    throw error;
  }
  try {
    // Prüfe, ob User eingeloggt ist
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 });
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
