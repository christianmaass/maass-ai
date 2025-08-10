import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const userId = authHeader.split(' ')[1];
    if (!userId) {
      return res.status(401).json({ error: 'Invalid user ID in authorization header' });
    }

    // Get query parameters
    const { caseId, stepNumber } = req.query;

    if (!caseId || !stepNumber) {
      return res.status(400).json({
        error: 'Missing required parameters: caseId and stepNumber',
      });
    }

    // Validate stepNumber is a valid number
    const stepNum = parseInt(stepNumber as string);
    if (isNaN(stepNum) || stepNum < 1 || stepNum > 5) {
      return res.status(400).json({
        error: 'stepNumber must be a number between 1 and 5',
      });
    }

    console.log(`Loading voice input for case ${caseId}, step ${stepNum}`);

    // Load existing voice input from database - USER-ISOLATED
    const { data: voiceInputs, error: dbError } = await supabase
      .from('case_voice_inputs')
      .select('*')
      .eq('foundation_case_id', caseId)
      .eq('step_number', parseInt(stepNumber as string))
      .eq('user_id', userId) // ✅ USER ISOLATION - Only load user's own data
      .order('created_at', { ascending: false });

    if (dbError) {
      console.error('Database error loading voice input:', dbError);
      return res.status(500).json({
        error: 'Database error loading voice input',
        details: dbError.message,
      });
    }

    console.log(
      `Found ${voiceInputs?.length || 0} voice inputs for case ${caseId}, step ${stepNum}`,
    );

    // Return the voice inputs (empty array if none found)
    return res.status(200).json({
      success: true,
      voiceInputs: voiceInputs || [],
      count: voiceInputs?.length || 0,
    });
  } catch (error) {
    console.error('Unexpected error in get-voice-input:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
