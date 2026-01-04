import { createServerClient } from '@/lib/db';
import { RegisterSchema } from '@/lib/schemas';
import { rateLimit } from '@/lib/rate-limit';
import { validateOrigin } from '@/lib/security/csrf';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // CSRF-Schutz: Origin-Header-Validierung
  const csrfError = validateOrigin(request);
  if (csrfError) {
    return csrfError;
  }
  // Rate-Limiting: 5 Requests pro 15 Minuten
  const rateLimitResult = await rateLimit(request, 5, 900);
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
          'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

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
