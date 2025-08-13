/**
 * FOUNDATION PROGRESS API
 * Migrated to navaa Auth Guidelines (WP-C1)
 *
 * COMPLIANCE:
 * - Uses withAuth() middleware (MANDATORY)
 * - JWT token validation via auth middleware
 * - Secure foundation progress tracking with proper authentication
 * - No manual JWT extraction
 *
 * @version 2.0.0 (WP-C1 Backend Migration)
 */

import { NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { FoundationApiError } from '@project-types/foundation.types';
import { withAuth, AuthenticatedRequest, getUserId } from '@lib/middleware/auth';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Performance timer utility
function createPerformanceTimer(_operation: string) {
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

// Fetch overall user progress
async function fetchOverallProgress(userId: string) {
  try {
    const { data: progressData } = await supabase
      .from('foundation_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!progressData) {
      return {
        cases_completed: 0,
        cases_total: 12,
        completion_percentage: 0,
        average_score: 0,
        current_case_id: null,
        last_activity: new Date().toISOString(),
      };
    }

    return {
      cases_completed: progressData.cases_completed,
      cases_total: progressData.cases_total,
      completion_percentage: progressData.completion_percentage,
      average_score: progressData.average_score || 0,
      current_case_id: progressData.current_case_id,
      last_activity: progressData.last_activity,
    };
  } catch (error) {
    console.error('Error fetching overall progress:', error);
    return {
      cases_completed: 0,
      cases_total: 12,
      completion_percentage: 0,
      average_score: 0,
      current_case_id: null,
      last_activity: new Date().toISOString(),
    };
  }
}

// Calculate cluster progress
async function calculateClusterProgress(userId: string) {
  try {
    // Get all foundation cases with cluster information
    const { data: allCases } = await supabase.from('foundation_cases').select('id, cluster');

    if (!allCases) return {};

    // Get user responses and assessments
    const { data: userResponses } = await supabase
      .from('foundation_responses')
      .select(
        `
        case_id,
        foundation_assessments (
          overall_score
        )
      `,
      )
      .eq('user_id', userId);

    // Create case completion map
    const completionMap = new Map();
    userResponses?.forEach((response) => {
      const assessment = response.foundation_assessments?.[0];
      if (assessment) {
        completionMap.set(response.case_id, assessment.overall_score);
      }
    });

    // Group by cluster
    const clusterStats: { [cluster: string]: any } = {};

    allCases.forEach((caseItem) => {
      const cluster = caseItem.cluster;
      if (!clusterStats[cluster]) {
        clusterStats[cluster] = {
          completed: 0,
          total: 0,
          scores: [],
          cases: [],
        };
      }

      clusterStats[cluster].total++;
      clusterStats[cluster].cases.push(caseItem.id);

      if (completionMap.has(caseItem.id)) {
        clusterStats[cluster].completed++;
        clusterStats[cluster].scores.push(completionMap.get(caseItem.id));
      }
    });

    // Calculate averages
    const result: { [cluster: string]: any } = {};
    Object.keys(clusterStats).forEach((cluster) => {
      const stats = clusterStats[cluster];
      result[cluster] = {
        completed: stats.completed,
        total: stats.total,
        avg_score:
          stats.scores.length > 0
            ? Math.round(
                stats.scores.reduce((a: number, b: number) => a + b, 0) / stats.scores.length,
              )
            : 0,
        cases: stats.cases,
      };
    });

    return result;
  } catch (error) {
    console.error('Error calculating cluster progress:', error);
    return {};
  }
}

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
async function foundationProgressHandler(req: AuthenticatedRequest, res: NextApiResponse) {
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

  const performanceTimer = createPerformanceTimer('foundation-progress');
  // Get user from Auth Middleware (WP-C1 Migration)
  const userId = getUserId(req); // User already validated by withAuth() middleware

  // Require authentication
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    });
  }

  try {
    // Parse query parameters
    const { include_case_details = 'false', include_statistics = 'false' } = req.query;

    // Fetch overall progress
    const overallProgress = await fetchOverallProgress(userId);

    // Calculate cluster progress
    const clusterProgress = await calculateClusterProgress(userId);

    // Build response
    const response = {
      success: true,
      data: {
        overall_progress: overallProgress,
        cluster_progress: clusterProgress,
        interaction_type_progress: {}, // Simplified for now
        case_details: include_case_details === 'true' ? {} : undefined,
        statistics:
          include_statistics === 'true'
            ? {
                total_time_spent: 0,
                average_time_per_case: 0,
                strongest_cluster: '',
                improvement_areas: [],
                learning_streak: {
                  current: 0,
                  longest: 0,
                },
              }
            : undefined,
      },
      meta: {
        execution_time_ms: performanceTimer.end(),
      },
    };

    // Set cache headers - user-specific data, no caching
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');

    res.status(200).json(response);
  } catch (error) {
    handleApiError(error, res, 'foundation-progress');
  }
}

// Export handler with Auth Middleware (WP-C1 Migration)
export default withAuth(foundationProgressHandler);
