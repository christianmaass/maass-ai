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
    // Get authorization header (for consistency, but we use service role key)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const userId = authHeader.split(' ')[1];
    if (!userId) {
      return res.status(401).json({ error: 'Invalid user ID in authorization header' });
    }

    // Extract query parameters
    const { caseId, stepNumber } = req.query;

    // Validate required parameters
    if (!caseId || !stepNumber) {
      return res.status(400).json({
        error: 'Missing required parameters: caseId, stepNumber',
      });
    }

    // Validate step number
    const stepNum = parseInt(stepNumber as string);
    if (isNaN(stepNum) || stepNum < 1 || stepNum > 5) {
      return res.status(400).json({
        error: 'Step number must be between 1 and 5',
      });
    }

    console.log(`🔍 Loading decision for case ${caseId}, step ${stepNum}`);

    // Query the case_decisions table using service role (bypasses RLS) - USER-ISOLATED
    const { data, error } = await supabase
      .from('case_decisions')
      .select('*')
      .eq('foundation_case_id', caseId)
      .eq('step_number', stepNum)
      .eq('user_id', userId) // ✅ USER ISOLATION - Only load user's own data
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - this is normal, no decision exists yet
        console.log(`📝 No decision found for case ${caseId}, step ${stepNum}`);
        return res.status(404).json({
          message: 'No decision found',
          data: null,
        });
      }

      console.error('Database error loading decision:', error);
      return res.status(500).json({
        error: 'Database error loading decision',
        details: error.message,
      });
    }

    console.log(`✅ Decision loaded successfully for case ${caseId}, step ${stepNum}`);

    return res.status(200).json({
      success: true,
      data: data,
      message: 'Decision loaded successfully',
    });
  } catch (error) {
    console.error('Unexpected error in get-decision:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
