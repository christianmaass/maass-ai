/**
 * ADMIN USERS API
 * Migrated to navaa Auth Guidelines (WP-C1)
 *
 * COMPLIANCE:
 * - Uses requireRole('admin') middleware (MANDATORY)
 * - JWT token validation via auth middleware
 * - Role-based access control for admin operations
 * - No manual JWT extraction or admin validation
 *
 * @version 2.0.0 (WP-C1 Backend Migration)
 */

import { NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { validateAdmin } from '../../../lib/schemas/admin.schemas';
import { requireRole, AuthenticatedRequest, getUserId } from '../../../lib/middleware/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Main API handler with Auth Middleware (WP-C1 Migration)
async function adminUsersHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get user from Auth Middleware (WP-C1 Migration)
  const userId = getUserId(req); // User already validated by requireRole('admin') middleware

  try {
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('id, email, first_name, last_name, role, created_at, expires_at')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return res.status(500).json({ error: 'Error fetching users' });
    }

    // ✅ PHASE 1: Sichere Zod-Validation für Response (additive, non-breaking)
    const responseData = {
      users: users || [],
      total_count: users?.length || 0,
      admin_count: users?.filter((u) => u.role === 'admin').length || 0,
      test_user_count: users?.filter((u) => u.role === 'test_user').length || 0,
    };

    const zodValidationResult = validateAdmin.usersResponse(responseData);

    if (!zodValidationResult.success) {
      // ⚠️ WARNUNG loggen, aber NICHT abbrechen (backwards compatibility)
      console.warn('🔍 Admin Users Response validation failed (non-breaking):', {
        errors: zodValidationResult.error.issues,
        endpoint: '/api/admin/users',
      });
    } else {
      console.log('✅ Admin Zod validation passed: users response');
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error in users API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Export handler with requireRole middleware (WP-C1 Migration)
export default requireRole('admin')(adminUsersHandler);
