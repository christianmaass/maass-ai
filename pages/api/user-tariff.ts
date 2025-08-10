/**
 * USER-TARIFF API
 * Migrated to navaa Auth Guidelines (WP-C3)
 *
 * COMPLIANCE:
 * - Uses withAuth middleware (MANDATORY)
 * - JWT token validation via auth middleware
 * - Secure tariff information retrieval
 * - No direct supabase client auth usage
 *
 * @version 2.0.0 (WP-C3 User API Migration)
 */

import { NextApiResponse } from 'next';
import { getSupabaseClient } from '../../supabaseClient';
import { withAuth, AuthenticatedRequest, getUserId } from '../../lib/middleware/auth';

// Main API handler with Auth Middleware (WP-C3 Migration)
async function userTariffHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get user from Auth Middleware (WP-C3 Migration)
  const userId = getUserId(req); // User already authenticated by withAuth middleware

  try {
    // =============================================================================
    // NAVAA AUTH INTEGRATION (WP-C3 Migration)
    // =============================================================================
    // Direct supabase.auth.getUser() REMOVED - handled by withAuth middleware
    // User authentication and token validation guaranteed by middleware

    const supabase = getSupabaseClient();

    // User-Tarif-Informationen aus der View abrufen
    const { data: tariffInfo, error: tariffError } = await supabase
      .from('user_tariff_info')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (tariffError) {
      console.error('Error fetching tariff info:', tariffError);

      // Fallback: Free-Tarif als Standard
      const { data: freePlan } = await supabase
        .from('tariff_plans')
        .select('*')
        .eq('name', 'Free')
        .single();

      return res.status(200).json({
        user_id: userId,
        email: null, // Email not available from middleware - would need separate query if required
        tariff_name: 'Free',
        tariff_display_name: 'Free',
        cases_per_week: freePlan?.cases_per_week || 5,
        cases_per_month: freePlan?.cases_per_month || 20,
        features: freePlan?.features || {},
        subscription_status: 'active',
        current_period_end: null,
        cancel_at_period_end: false,
        cases_used_this_week: 0,
        cases_used_this_month: 0,
      });
    }

    return res.status(200).json(tariffInfo);
  } catch (error) {
    console.error('Error in user-tariff API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Export handler with withAuth middleware (WP-C3 Migration)
export default withAuth(userTariffHandler);
