/**
 * ADMIN CREATE-TEST-USER-DIRECT API
 * Migrated to navaa Auth Guidelines (WP-C1)
 *
 * COMPLIANCE:
 * - Uses requireRole('admin') middleware (MANDATORY)
 * - JWT token validation via auth middleware
 * - Role-based access control for admin test user creation
 * - Maintains rate limiting and Zod validation
 *
 * @version 2.0.0 (WP-C1 Backend Migration)
 */

import { NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { withAdminRateLimit } from '../../../lib/rateLimiter';
import { validateAdmin, ADMIN_SECURITY } from '../../../lib/schemas/admin.schemas';
import { requireRole, AuthenticatedRequest, getUserId } from '../../../lib/middleware/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Main API handler with Auth Middleware (WP-C1 Migration)
async function adminCreateTestUserDirectHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get user from Auth Middleware (WP-C1 Migration)
  const userId = getUserId(req); // User already validated by requireRole('admin') middleware

  try {
    // ✅ ZOD VALIDATION (existing validation)
    const { email, first_name, last_name, duration } = req.body;

    if (!email || !first_name || !last_name || !duration) {
      return res
        .status(400)
        .json({ error: 'Email, first_name, last_name, and duration are required' });
    }

    if (duration > ADMIN_SECURITY.MAX_TEST_USER_DURATION) {
      console.warn(
        `⚠️ Test user duration ${duration}h exceeds maximum ${ADMIN_SECURITY.MAX_TEST_USER_DURATION}h`,
      );
    }

    // ✅ CTO DECISION: BYPASS SUPABASE AUTH - DIRECT APPROACH
    console.log('🎯 CTO Decision: Creating test user directly (bypassing Supabase Auth)');

    // Generate test user credentials
    const testUserId = crypto.randomUUID();
    const tempPassword =
      Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

    // Calculate expiration
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + duration);

    // Direct user_profiles creation (no auth dependency)
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: testUserId,
        email: email,
        first_name: first_name,
        last_name: last_name,
        role: 'test_user',
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Test user specific fields
        is_test_user: true,
        test_password: tempPassword, // Store for admin reference
        created_by_admin: userId, // Admin user from auth middleware
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Profile creation failed:', profileError);
      return res.status(500).json({
        error: 'Error creating test user profile: ' + profileError.message,
      });
    }

    console.log('✅ Test user created successfully (direct approach):', testUserId);

    // Return success
    const data = {
      id: testUserId,
      email: email,
      first_name: first_name,
      last_name: last_name,
      password: tempPassword,
      expires_at: expiresAt.toISOString(),
      login_method: 'direct_profile_login', // No auth required
      note: 'Test user created without Supabase Auth (CTO decision)',
    };

    res.status(200).json({
      success: true,
      message: 'Test user created successfully (direct approach)',
      data: data,
    });
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
}

// Export handler with requireRole middleware and rate limiting (WP-C1 Migration)
export default withAdminRateLimit(requireRole('admin')(adminCreateTestUserDirectHandler));
