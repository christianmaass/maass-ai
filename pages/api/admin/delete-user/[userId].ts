/**
 * ADMIN DELETE-USER API
 * Migrated to navaa Auth Guidelines (WP-C1)
 *
 * COMPLIANCE:
 * - Uses requireRole('admin') middleware (MANDATORY)
 * - JWT token validation via auth middleware
 * - Role-based access control for admin user deletion
 * - No manual JWT extraction or admin validation
 *
 * @version 2.0.0 (WP-C1 Backend Migration)
 */

import { NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { requireRole, AuthenticatedRequest, getUserId } from '../../../../lib/middleware/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Main API handler with Auth Middleware (WP-C1 Migration)
async function adminDeleteUserHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get user from Auth Middleware (WP-C1 Migration)
  const adminUserId = getUserId(req); // Admin user already validated by requireRole('admin') middleware

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if target user exists and is not admin
    const { data: targetUser, error: targetError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (targetError) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (targetUser.role === 'admin') {
      return res.status(403).json({ error: 'Cannot delete admin users' });
    }

    // Delete from user_profiles (this will cascade to related tables)
    const { error: deleteError } = await supabase.from('user_profiles').delete().eq('id', userId);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return res.status(500).json({ error: 'Error deleting user' });
    }

    // For test users, also try to delete from auth.users if it exists
    if (targetUser.role === 'test_user') {
      try {
        await supabase.auth.admin.deleteUser(userId);
      } catch (authDeleteError) {
        // This might fail for test users that don't exist in auth.users, which is OK
        console.log('Could not delete from auth.users (might be test user):', authDeleteError);
      }
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error in delete-user API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Export handler with requireRole middleware (WP-C1 Migration)
export default requireRole('admin')(adminDeleteUserHandler);
