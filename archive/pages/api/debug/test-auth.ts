import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Dev-only guard: disable in non-development environments
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔍 Testing Supabase Auth Configuration...');

    // Test 1: Check environment variables
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('Environment Check:', { hasUrl, hasServiceKey });

    // Test 2: Try to create a simple test user
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TempPassword123!';

    console.log('🔄 Attempting to create test user:', testEmail);

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
    });

    if (authError) {
      console.error('❌ Auth creation failed:', {
        error: authError,
        message: authError.message,
        status: authError.status,
        details: authError,
      });

      return res.status(500).json({
        success: false,
        error: 'Auth creation failed',
        details: {
          message: authError.message,
          status: authError.status,
          error: authError,
        },
        environment: { hasUrl, hasServiceKey },
      });
    }

    console.log('✅ Test user created successfully:', authData.user?.id);

    // Cleanup: Delete the test user
    if (authData.user) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      console.log('🧹 Test user cleaned up');
    }

    return res.status(200).json({
      success: true,
      message: 'Supabase Auth is working correctly',
      testUserId: authData.user?.id,
      environment: { hasUrl, hasServiceKey },
    });
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: 'Unexpected error',
      details: error,
    });
  }
}
