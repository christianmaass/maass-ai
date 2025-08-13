/**
 * TEST-USER API
 * Migrated to navaa Auth Guidelines (WP-C3)
 *
 * COMPLIANCE:
 * - Uses withAuth middleware (MANDATORY)
 * - JWT token validation via auth middleware
 * - Secure test user information access
 * - No public access to test user data
 *
 * @version 2.0.0 (WP-C3 User API Migration)
 */

import { NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { withAuth, AuthenticatedRequest, getUserId } from '@lib/middleware/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Main API handler with Auth Middleware (WP-C3 Migration)
async function testUserHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get authenticated user from Auth Middleware (WP-C3 Migration)
  const _authenticatedUserId = getUserId(req); // User already authenticated by withAuth middleware

  try {
    // =============================================================================
    // NAVAA AUTH INTEGRATION (WP-C3 Migration)
    // =============================================================================
    // Public access REMOVED - now requires JWT authentication
    // Test user information access secured via withAuth middleware

    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Get test user from user_profiles
    const { data: user, error } = await supabase
      .from('user_profiles')
      .select('id, email, first_name, last_name, role, expires_at, created_at')
      .eq('id', userId)
      .eq('role', 'test_user')
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        error: 'Test user not found',
      });
    }

    // Check if expired
    const isExpired = new Date(user.expires_at) < new Date();

    res.status(200).json({
      success: true,
      user: {
        ...user,
        isExpired,
      },
    });
  } catch (error) {
    console.error('Error in test-user API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Export handler with withAuth middleware (WP-C3 Migration)
export default withAuth(testUserHandler);
