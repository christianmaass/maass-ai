/**
 * ADMIN GET FOUNDATION CASES API
 * Migrated to navaa Auth Guidelines
 *
 * COMPLIANCE:
 * - Uses requireRole('admin') middleware (MANDATORY)
 * - JWT token validation via auth middleware
 * - Role-based access control for admin operations
 * - No manual JWT extraction or admin validation
 *
 * @version 2.0.0 (navaa Guidelines Migration)
 */

import { NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { requireRole, AuthenticatedRequest, getUserId } from '@lib/middleware/auth';

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Main API handler with Auth Middleware (navaa Guidelines)
async function adminGetFoundationCasesHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get user from Auth Middleware (navaa Guidelines)
  const userId = getUserId(req); // User already validated by requireRole('admin') middleware

  try {
    console.log(`📋 Loading foundation cases for admin user ${userId}`);

    // Get all foundation cases
    const { data: cases, error: casesError } = await supabase
      .from('foundation_cases')
      .select(
        `
        id,
        title,
        cluster,
        case_type,
        difficulty,
        learning_objectives,
        case_description,
        case_question,
        estimated_duration,
        created_at,
        updated_at
      `,
      )
      .order('created_at', { ascending: true });

    if (casesError) {
      console.error('Error loading foundation cases:', casesError);
      return res.status(500).json({
        success: false,
        error: 'Failed to load foundation cases from database',
      });
    }

    console.log(`📋 Successfully loaded ${cases?.length || 0} foundation cases`);

    return res.status(200).json({
      success: true,
      cases: cases || [],
      meta: {
        total_cases: cases?.length || 0,
        execution_time_ms: Date.now(),
      },
    });
  } catch (error) {
    console.error('Error in get-foundation-cases:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// Export handler with requireRole middleware (navaa Guidelines)
export default requireRole('admin')(adminGetFoundationCasesHandler);
