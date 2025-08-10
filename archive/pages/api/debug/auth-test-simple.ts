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
  // Allow both GET and POST for easy testing
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔍 Testing minimal auth user creation...');

    // Test with minimal parameters - exactly like our failing case
    const testEmail = `debug-test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    console.log('📧 Testing email:', testEmail);

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true, // This is what our real code uses
    });

    if (authError) {
      console.error('❌ Auth creation failed with details:', {
        message: authError.message,
        status: authError.status,
        name: authError.name,
        cause: authError.cause,
        details: JSON.stringify(authError, null, 2),
      });

      return res.status(500).json({
        success: false,
        error: 'Auth creation failed',
        details: {
          message: authError.message,
          status: authError.status,
          name: authError.name,
          full_error: authError,
        },
      });
    }

    console.log('✅ Auth user created successfully:', authData.user?.id);

    // Cleanup immediately
    if (authData.user) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      console.log('🧹 Test user cleaned up');
    }

    return res.status(200).json({
      success: true,
      message: 'Auth user creation works perfectly',
      user_id: authData.user?.id,
    });
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: 'Unexpected error',
      details: error.message,
    });
  }
}
