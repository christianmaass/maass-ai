import { createServerClient } from '@/lib/db';
import { LoginSchema } from '@/lib/schemas';
import { rateLimit } from '@/lib/rate-limit';
import { assertAllowedOrigin } from '@/lib/security/guard';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

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
    // Prüfe Content-Type Header
    const contentType = request.headers.get('content-type');
    let body: unknown;

    if (contentType?.includes('application/json')) {
      // JSON Request (von AuthForm)
      body = await request.json();
    } else {
      // FormData Request (von HTML-Form)
      const formData = await request.formData();
      body = {
        email: formData.get('email'),
        password: formData.get('password'),
      };
    }

    // Zod-Validierung
    const { email, password } = LoginSchema.parse(body);

    const supabase = await createServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // SECURITY: Don't log sensitive error details in production
      if (process.env.NODE_ENV !== 'production') {
        console.error('Login error:', error);
      } else {
        // Production: Only log error type, not full details
        console.error('Login failed:', error.name || 'AuthenticationError');
      }
      return NextResponse.json(
        { error: 'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.' },
        { status: 401 }
      );
    }

    if (data.user) {
      // Erfolgreiche Anmeldung
      return NextResponse.json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      });
    }

    return NextResponse.json({ error: 'Unerwarteter Fehler bei der Anmeldung' }, { status: 500 });
  } catch (error) {
    // Zod-Validierungsfehler
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues?.[0]?.message ?? 'Validation error' },
        { status: 400 }
      );
    }

    // Andere Fehler (Supabase, etc.)
    // SECURITY: Don't log sensitive error details in production
    if (process.env.NODE_ENV !== 'production') {
      console.error('Unexpected error during login:', error);
    } else {
      console.error(
        'Unexpected login error:',
        error instanceof Error ? error.name : 'UnknownError'
      );
    }
    return NextResponse.json({ error: 'Ein unerwarteter Fehler ist aufgetreten' }, { status: 500 });
  }
}
