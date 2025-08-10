import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
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

    // Extract request data
    const { caseId, stepNumber, selectedOption, reasoning, decisionMatrix } = req.body;

    // Validate required fields
    if (!caseId || !stepNumber || !selectedOption || !reasoning) {
      return res.status(400).json({
        error: 'Missing required fields: caseId, stepNumber, selectedOption, reasoning',
      });
    }

    // Validate step number
    if (stepNumber < 1 || stepNumber > 5) {
      return res.status(400).json({
        error: 'Step number must be between 1 and 5',
      });
    }

    // Validate selected option
    if (!/^[A-Z]$/.test(selectedOption)) {
      return res.status(400).json({
        error: 'Selected option must be a single uppercase letter (A, B, C, etc.)',
      });
    }

    console.log(
      `🎯 Saving decision for case ${caseId}, step ${stepNumber}, option ${selectedOption}`,
    );

    // Verify that the foundation case exists
    const { data: foundationCase, error: caseError } = await supabase
      .from('foundation_cases')
      .select('id')
      .eq('id', caseId)
      .single();

    if (caseError || !foundationCase) {
      return res.status(404).json({ error: 'Foundation case not found' });
    }

    // Upsert decision (insert or update) - USER-ISOLATED
    const { data, error } = await supabase
      .from('case_decisions')
      .upsert(
        {
          foundation_case_id: caseId,
          step_number: stepNumber,
          user_id: userId, // USER ISOLATION
          selected_option: selectedOption?.trim() || null,
          reasoning: reasoning?.trim() || null,
          decision_matrix: decisionMatrix || null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'foundation_case_id,step_number,user_id', // USER-SPECIFIC CONFLICT
        },
      )
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        error: 'Failed to save decision',
        details: error.message,
      });
    }

    console.log('✅ Decision saved successfully');

    return res.status(200).json({
      success: true,
      data: data,
      message: `Decision saved for step ${stepNumber}: Option ${selectedOption}`,
    });
  } catch (error: any) {
    console.error('💥 Error in save-decision API:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
}
