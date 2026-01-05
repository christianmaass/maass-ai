import { createServerClient } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { assertAllowedOrigin } from '@/lib/security/guard';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { clientEnv } from '@/lib/config/env.client';

const ResetPasswordSchema = z.object({
  email: z.string().email(),
});

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
  // Rate-Limiting: 3 Requests pro Stunde (striktes Limit für Email-APIs)
  const rateLimitResult = await rateLimit(request, 3, 3600);

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
    const { email } = ResetPasswordSchema.parse(body);

    const supabase = await createServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${clientEnv.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: 'Password reset email sent. Please check your inbox.' },
      { status: 200 }
    );
  } catch (error) {
    // Zod-Validierungsfehler
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues?.[0]?.message ?? 'Validation error' },
        { status: 400 }
      );
    }

    // Andere Fehler
    // SECURITY: Don't log sensitive error details in production
    if (process.env.NODE_ENV !== 'production') {
      console.error('Unexpected error during password reset:', error);
    } else {
      console.error(
        'Unexpected password reset error:',
        error instanceof Error ? error.name : 'UnknownError'
      );
    }
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }
}
