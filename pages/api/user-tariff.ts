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
import { getUserTariff } from '@payments/services/userTariff';

// Main API handler with Auth Middleware (WP-C3 Migration)
async function userTariffHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get user from Auth Middleware (WP-C3 Migration)
  const userId = getUserId(req); // User already authenticated by withAuth middleware

  try {
    const supabase = getSupabaseClient();
    const tariffInfo = await getUserTariff({ supabase, userId });
    return res.status(200).json(tariffInfo);
  } catch (error) {
    console.error('Error in user-tariff API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Export handler with withAuth middleware (WP-C3 Migration)
export default withAuth(userTariffHandler);
