/**
 * FOUNDATION CASES API
 * Migrated to navaa Auth Guidelines (WP-C1)
 *
 * COMPLIANCE:
 * - Uses withAuth() middleware (MANDATORY)
 * - JWT token validation via auth middleware
 * - Secure foundation cases management with proper authentication
 * - No manual JWT extraction
 *
 * @version 2.0.0 (WP-C1 Backend Migration)
 */

import { NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import {
  FoundationCasesListResponse,
  FoundationCaseWithUserStatus,
  FoundationApiError,
} from '../../../types/foundation.types';
import { withAuth, AuthenticatedRequest, getUserId } from '../../../lib/middleware/auth';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Performance timer utility
function createPerformanceTimer(operation: string) {
  const start = Date.now();
  return {
    start,
    end: () => Date.now() - start,
  };
}

// =============================================================================
// NAVAA AUTH INTEGRATION (WP-C1 Migration)
// =============================================================================
// Manual JWT extraction REMOVED - now handled by withAuth() middleware

// Handle API errors
function handleApiError(error: any, res: NextApiResponse, operation: string) {
  console.error(`Foundation API Error [${operation}]:`, error);

  const errorResponse: FoundationApiError = {
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: error.message || 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error : undefined,
    },
  };

  const statusCode = error.statusCode || 500;
  res.status(statusCode).json(errorResponse);
}

// Main API handler with Auth Middleware (WP-C1 Migration)
async function foundationCasesHandler(
  req: AuthenticatedRequest,
  res: NextApiResponse<FoundationCasesListResponse | FoundationApiError>,
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only GET requests are allowed',
      },
    });
  }

  const performanceTimer = createPerformanceTimer('foundation-cases-list');
  // Get user from Auth Middleware (WP-C1 Migration)
  const userId = getUserId(req); // User already validated by withAuth() middleware

  try {
    // Parse query parameters
    const { include_progress = 'true', cluster, difficulty_min, difficulty_max } = req.query;

    // Build base query
    let query = supabase
      .from('foundation_cases')
      .select(
        `
        id,
        title,
        category,
        cluster,
        tool,
        difficulty,
        estimated_duration,
        interaction_type,
        learning_objectives,
        content,
        created_at,
        updated_at
      `,
      )
      .order('difficulty');

    // Apply filters
    if (cluster) {
      query = query.eq('cluster', cluster);
    }

    if (difficulty_min) {
      query = query.gte('difficulty', parseInt(difficulty_min as string));
    }

    if (difficulty_max) {
      query = query.lte('difficulty', parseInt(difficulty_max as string));
    }

    // Execute query
    const { data: cases, error: casesError } = await query;

    if (casesError) {
      throw casesError;
    }

    if (!cases) {
      throw new Error('No foundation cases found');
    }

    // Simple response without user status for now
    const casesWithStatus: FoundationCaseWithUserStatus[] = cases.map((c) => ({
      ...c,
      user_status: undefined,
    }));

    // Build response
    const response: FoundationCasesListResponse = {
      success: true,
      data: {
        cases: casesWithStatus,
        user_progress: undefined,
      },
      meta: {
        total_cases: cases.length,
        filtered_cases: casesWithStatus.length,
        execution_time_ms: performanceTimer.end(),
      },
    };

    // Set cache headers for performance
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

    res.status(200).json(response);
  } catch (error) {
    handleApiError(error, res, 'foundation-cases-list');
  }
}

// Export handler with Auth Middleware (WP-C1 Migration)
export default withAuth(foundationCasesHandler);
