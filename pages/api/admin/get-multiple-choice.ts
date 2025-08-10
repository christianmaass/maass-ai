import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Types
interface MCQuestion {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  question_number: number;
}

interface ApiResponse {
  success: boolean;
  questions?: MCQuestion[];
  error?: string;
  message?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { caseId, stepNumber } = req.query;

    if (!caseId || !stepNumber) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: caseId and stepNumber',
      });
    }

    console.log(`[MC Load] Loading questions for case ${caseId}, step ${stepNumber}`);

    // Initialize Supabase client with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Load existing MC questions from database
    const { data: questions, error: dbError } = await supabase
      .from('case_multiple_choice')
      .select('*')
      .eq('foundation_case_id', caseId)
      .eq('step_number', parseInt(stepNumber as string))
      .order('question_number', { ascending: true });

    if (dbError) {
      console.error('[MC Load] Database error:', dbError);
      return res.status(500).json({
        success: false,
        error: 'Failed to load questions from database',
      });
    }

    console.log(`[MC Load] Found ${questions?.length || 0} questions`);

    return res.status(200).json({
      success: true,
      questions: questions || [],
      message: `Loaded ${questions?.length || 0} questions for case ${caseId}, step ${stepNumber}`,
    });
  } catch (error) {
    console.error('[MC Load] Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
