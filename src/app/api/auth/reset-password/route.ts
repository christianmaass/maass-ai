import { createServerClient } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ResetPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = ResetPasswordSchema.parse(body);

    const supabase = await createServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: 'Password reset email sent. Please check your inbox.' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }
}
