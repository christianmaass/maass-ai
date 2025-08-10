/**
 * ADMIN CHECK-ROLE API
 * Migrated to navaa Auth Guidelines (WP-C1)
 *
 * COMPLIANCE:
 * - Uses requireRole('admin') middleware (MANDATORY)
 * - JWT token validation via auth middleware
 * - Role-based access control for admin role verification
 * - No manual JWT extraction or role validation
 *
 * @version 2.0.0 (WP-C1 Backend Migration)
 */

import { NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { requireRole, AuthenticatedRequest, getUserId } from '../../../lib/middleware/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Main API handler with Auth Middleware (WP-C1 Migration)
async function adminCheckRoleHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get user from Auth Middleware (WP-C1 Migration)
  const adminUserId = getUserId(req); // Admin user already validated by requireRole('admin') middleware

  try {
    // =============================================================================
    // NAVAA AUTH INTEGRATION (WP-C1 Migration)
    // =============================================================================
    // Manual role checking REMOVED - admin role already validated by middleware
    // This endpoint now returns admin role confirmation for authenticated admin users

    // Since requireRole('admin') middleware already validated admin access,
    // we can directly return admin role confirmation
    res.status(200).json({
      isAdmin: true, // Always true since requireRole('admin') middleware validated this
      role: 'admin', // Always admin since only admins can access this endpoint
    });
  } catch (error) {
    console.error('Error in check-role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Export handler with requireRole middleware (WP-C1 Migration)
export default requireRole('admin')(adminCheckRoleHandler);
