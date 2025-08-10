import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { withAdminRateLimit } from '../../../lib/rateLimiter';
import { validateAdmin, ADMIN_SECURITY } from '../../../lib/schemas/admin.schemas';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // ✅ PHASE 1: Sichere Zod-Validation (additive, non-breaking)
    const zodValidationResult = validateAdmin.createTestUserSafe(req.body);

    if (!zodValidationResult.success) {
      // ⚠️ WARNUNG loggen, aber NICHT abbrechen (backwards compatibility)
      console.warn('🔍 Admin Zod validation failed (non-breaking):', {
        errors: zodValidationResult.error.issues,
        body: req.body,
        endpoint: '/api/admin/create-test-user',
      });
    } else {
      console.log('✅ Admin Zod validation passed: create-test-user');
    }

    // ✅ BESTEHENDE Validation beibehalten (garantiert keine Breaking Changes)
    const { email, first_name, last_name, duration } = req.body;

    if (!email || !first_name || !last_name || !duration) {
      return res
        .status(400)
        .json({ error: 'Email, first_name, last_name, and duration are required' });
    }

    // ✅ ZUSÄTZLICHE Sicherheitsprüfungen (optional, non-breaking)
    if (duration > ADMIN_SECURITY.MAX_TEST_USER_DURATION) {
      console.warn(
        `⚠️ Test user duration ${duration}h exceeds maximum ${ADMIN_SECURITY.MAX_TEST_USER_DURATION}h`,
      );
    }

    // ✅ HYBRID APPROACH: Auth creation + Supabase function for profile
    // Generate temporary password
    const tempPassword =
      Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

    // Step 1: Create auth user with proper configuration
    console.log('🔄 Creating auth user for:', email);

    // ✅ PRODUCTION FIX: email_confirm: false for admin-created test users
    // Root Cause: email_confirm: true requires configured SMTP provider
    // Solution: Admin-created test users don't need email confirmation
    const { data: authData, error: createAuthError } = await supabase.auth.admin.createUser({
      email: email,
      password: tempPassword,
      email_confirm: false, // Admin-created users are pre-confirmed
      user_metadata: {
        first_name: first_name,
        last_name: last_name,
        role: 'test_user',
        created_by: 'admin',
        confirmed_at: new Date().toISOString(),
      },
    });

    if (createAuthError) {
      console.error('❌ Auth user creation failed:', {
        error: createAuthError,
        email: email,
        message: createAuthError.message,
      });

      // Check if user already exists
      if (createAuthError.message?.includes('already registered')) {
        return res.status(409).json({
          error: 'User with this email already exists. Please use a different email.',
        });
      }

      return res.status(500).json({
        error: 'Error creating auth user: ' + createAuthError.message,
        details: createAuthError,
      });
    }

    if (!authData?.user) {
      console.error('❌ No user data returned from auth creation');
      return res.status(500).json({ error: 'Failed to create user - no user data returned' });
    }

    console.log('✅ Auth user created successfully:', authData.user.id);

    // Step 2: Create user profile using proper Supabase function
    console.log('🔄 Creating user profile via Supabase function...');

    const { data: profileData, error: createProfileError } = await supabase.rpc(
      'create_test_user_profile',
      {
        user_id: authData.user.id,
        test_email: email,
        test_first_name: first_name,
        test_last_name: last_name,
        duration_hours: duration,
      },
    );

    if (createProfileError) {
      console.error('❌ Profile creation failed:', {
        error: createProfileError,
        user_id: authData.user.id,
        message: createProfileError.message,
      });

      // Cleanup: delete auth user if profile creation failed
      console.log('🧹 Cleaning up auth user due to profile creation failure...');
      await supabase.auth.admin.deleteUser(authData.user.id);

      return res.status(500).json({
        error: 'Error creating user profile: ' + createProfileError.message,
        details: createProfileError,
      });
    }

    console.log('✅ User profile created successfully via Supabase function');

    const data = {
      id: authData.user.id,
      email: email,
      first_name: first_name,
      last_name: last_name,
      password: tempPassword,
      expires_at: profileData.expires_at,
    };

    res.status(200).json({
      success: true,
      testUser: data,
    });
  } catch (error) {
    console.error('Error in create-test-user API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Export handler with admin rate limiting (20 requests per 5 minutes)
export default withAdminRateLimit(handler);
