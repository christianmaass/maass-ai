/**
 * USER CASE HISTORY API
 * Created during WP-D1 Testing & Validation
 *
 * COMPLIANCE:
 * - Uses withAuth middleware (MANDATORY)
 * - JWT token validation via auth middleware
 * - Secure user case history retrieval
 * - No manual JWT extraction or verification
 *
 * @version 1.0.0 (WP-D1 Critical Fix)
 */

import { NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { withAuth, AuthenticatedRequest, getUserId } from '@lib/middleware/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Main API handler with Auth Middleware (WP-D1 Critical Fix)
async function userCaseHistoryHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get user from Auth Middleware (WP-D1 Critical Fix)
  const userId = getUserId(req); // User already authenticated by withAuth middleware

  try {
    // =============================================================================
    // NAVAA AUTH INTEGRATION (WP-D1 Critical Fix)
    // =============================================================================
    // JWT token validation handled by withAuth middleware
    // User authentication guaranteed before case history retrieval

    // Get user's case history from foundation_responses
    const { data: caseHistory, error } = await supabase
      .from('foundation_responses')
      .select(
        `
        id,
        case_id,
        interaction_type,
        responses,
        time_spent_seconds,
        submitted_at,
        foundation_cases (
          id,
          title,
          cluster,
          tool,
          difficulty,
          category
        )
      `,
      )
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error fetching user case history:', error);
      return res.status(500).json({
        error: 'Fehler beim Laden der Case History',
        details:
          process.env.NODE_ENV === 'development'
            ? (error as any)?.message || (error instanceof Error ? error.message : undefined)
            : undefined,
      });
    }

    // Transform data to match frontend expectations
    const cases =
      caseHistory?.map((response) => {
        const caseData = Array.isArray(response.foundation_cases)
          ? response.foundation_cases[0]
          : response.foundation_cases;

        return {
          id: response.id,
          case_id: response.case_id,
          interaction_type: response.interaction_type,
          responses: response.responses,
          time_spent_seconds: response.time_spent_seconds,
          submitted_at: response.submitted_at,
          case_title: caseData?.title || 'Unbekannter Case',
          case_cluster: caseData?.cluster || '',
          case_tool: caseData?.tool || '',
          case_difficulty: caseData?.difficulty || 1,
          case_category: caseData?.category || 'foundation',
        };
      }) || [];

    // Return case history in expected format
    res.status(200).json({
      success: true,
      cases,
      total: cases.length,
      user_id: userId,
    });
  } catch (error) {
    console.error('Error in user-case-history API:', error);
    res.status(500).json({
      error: 'Interner Server-Fehler',
      details:
        process.env.NODE_ENV === 'development'
          ? (error as any)?.message || (error instanceof Error ? error.message : undefined)
          : undefined,
    });
  }
}

// Export handler with withAuth middleware (WP-D1 Critical Fix)
export default withAuth(userCaseHistoryHandler);
