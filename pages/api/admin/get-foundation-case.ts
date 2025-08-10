import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication (consistent with other admin APIs)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const userId = authHeader.split(' ')[1];
    if (!userId) {
      return res.status(401).json({ error: 'Invalid user ID in authorization header' });
    }

    // Get caseId from query parameters
    const { caseId } = req.query;

    if (!caseId || typeof caseId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid caseId parameter',
      });
    }

    console.log(`📋 Loading foundation case ${caseId} for user ${userId}`);

    // Get specific foundation case
    const { data: foundationCase, error: caseError } = await supabase
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
      .eq('id', caseId)
      .single();

    if (caseError) {
      console.error('Error loading foundation case:', caseError);
      if (caseError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Foundation case not found',
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Failed to load foundation case from database',
      });
    }

    if (!foundationCase) {
      return res.status(404).json({
        success: false,
        error: 'Foundation case not found',
      });
    }

    console.log(`📋 Successfully loaded foundation case: ${foundationCase.title}`);

    return res.status(200).json({
      success: true,
      case: foundationCase,
      meta: {
        execution_time_ms: Date.now(),
      },
    });
  } catch (error) {
    console.error('Error in get-foundation-case:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
