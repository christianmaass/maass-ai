import { createServerClient } from '@/lib/db';
import { RegisterSchema } from '@/lib/schemas';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = RegisterSchema.parse(body);

    const supabase = await createServerClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: 'Signup successful. Please check your email for verification.',
        user: data.user,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}
