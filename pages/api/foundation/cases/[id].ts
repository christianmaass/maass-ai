import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { FoundationApiError } from '../../../../types/foundation.types';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Performance timer utility
function createPerformanceTimer() {
  const start = Date.now();
  return {
    start,
    end: () => Date.now() - start,
  };
}

// Extract user ID from request
function extractUserIdFromRequest(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;

  try {
    return (req.headers['x-user-id'] as string) || null;
  } catch (error) {
    console.error('Error extracting user ID:', error);
    return null;
  }
}

// Error handler
function handleApiError(error: any, res: NextApiResponse, operation: string) {
  console.error(`API Error in ${operation}:`, error);

  const apiError: FoundationApiError = {
    success: false,
    error: error.message || 'Internal server error',
    code: error.code || 'INTERNAL_ERROR',
    details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  };

  res.status(500).json(apiError);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const performanceTimer = createPerformanceTimer();

  try {
    // Extract case ID from URL
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Case ID is required',
      });
    }

    // Get user (for potential user-specific data later) - consistent with cases list API
    const userId = extractUserIdFromRequest(req);
    // Note: We don't block on missing userId to maintain consistency with /api/foundation/cases

    // Query single foundation case
    const { data: foundationCase, error } = await supabase
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
      .eq('id', id)
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to fetch case: ${error.message}`);
    }

    if (!foundationCase) {
      return res.status(404).json({
        success: false,
        error: 'Case not found',
      });
    }

    // Build response
    const response = {
      success: true,
      data: {
        case: foundationCase,
        user_status: undefined, // TODO: Add user progress/completion status
      },
      meta: {
        execution_time_ms: performanceTimer.end(),
      },
    };

    // Set cache headers
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

    res.status(200).json(response);
  } catch (error) {
    handleApiError(error, res, 'foundation-case-detail');
  }
}
