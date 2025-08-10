/**
 * USER DELETE-ACCOUNT API
 * Migrated to navaa Auth Guidelines (WP-C3)
 *
 * COMPLIANCE:
 * - Uses withAuth middleware (MANDATORY)
 * - JWT token validation via auth middleware
 * - GDPR-compliant soft delete with audit logging
 * - No manual JWT extraction or verification
 *
 * @version 2.0.0 (WP-C3 User API Migration)
 */

import { NextApiResponse } from 'next';
import { getSupabaseClient } from '../../../supabaseClient';
import { withAuth, AuthenticatedRequest, getUserId } from '../../../lib/middleware/auth';

// Main API handler with Auth Middleware (WP-C3 Migration)
async function userDeleteAccountHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Only allow DELETE requests
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  // Get user from Auth Middleware (WP-C3 Migration)
  const userId = getUserId(req); // User already authenticated by withAuth middleware

  try {
    // =============================================================================
    // NAVAA AUTH INTEGRATION (WP-C3 Migration)
    // =============================================================================
    // Manual JWT extraction and verification REMOVED - handled by withAuth middleware
    // User authentication and token validation guaranteed by middleware

    // Validate request body
    const { confirmationText, reason } = req.body;

    if (confirmationText !== 'KONTO LÖSCHEN') {
      return res.status(400).json({
        success: false,
        error: 'Bestätigungstext ist erforderlich',
      });
    }

    // Initialize Supabase client
    const supabase = getSupabaseClient();

    // Check if user exists and is not already deleted
    const { data: existingUser, error: fetchError } = await supabase
      .from('user_profiles')
      .select('id, email, first_name, last_name, deleted_at')
      .eq('id', userId)
      .single();

    if (fetchError || !existingUser) {
      return res.status(404).json({
        success: false,
        error: 'Benutzer nicht gefunden',
      });
    }

    if (existingUser.deleted_at) {
      return res.status(400).json({
        success: false,
        error: 'Konto ist bereits gelöscht',
      });
    }

    // GDPR-konformes Soft Delete
    const deletionTimestamp = new Date().toISOString();

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        deleted_at: deletionTimestamp,
        deletion_reason: reason || 'User requested deletion',
        updated_at: deletionTimestamp,
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Account deletion error:', updateError);
      return res.status(500).json({
        success: false,
        error: 'Fehler beim Löschen des Kontos',
      });
    }

    // Audit Log für DSGVO-Compliance
    try {
      await supabase.from('audit_logs').insert({
        user_id: userId,
        action: 'account_deletion',
        details: {
          email: existingUser.email,
          deletion_reason: reason || 'User requested deletion',
          ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          user_agent: req.headers['user-agent'],
        },
        created_at: deletionTimestamp,
      });
    } catch (auditError) {
      // Audit log failure shouldn't block deletion
      console.warn('Audit log creation failed:', auditError);
    }

    // Invalidate user session in Supabase Auth
    try {
      await supabase.auth.admin.signOut(userId);
    } catch (signOutError) {
      console.warn('Session invalidation failed:', signOutError);
    }

    return res.status(200).json({
      success: true,
      message: 'Konto erfolgreich gelöscht',
      deletion_timestamp: deletionTimestamp,
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    return res.status(500).json({
      success: false,
      error: 'Interner Serverfehler',
    });
  }
}

// Export handler with withAuth middleware (WP-C3 Migration)
export default withAuth(userDeleteAccountHandler);
