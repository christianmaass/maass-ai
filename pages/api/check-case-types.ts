import { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient } from '@supabaseClient';

// API to check available case types
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabaseClient();

    // Check case_types table
    const { data: caseTypes, error: caseTypesError } = await supabase
      .from('case_types')
      .select('*');

    if (caseTypesError) {
      return res.status(500).json({
        error: 'Failed to fetch case types',
        details: caseTypesError
      });
    }

    // Check cases table structure
    const { data: cases, error: casesError } = await supabase
      .from('cases')
      .select('*')
      .limit(1);

    return res.status(200).json({
      case_types: caseTypes,
      case_types_count: caseTypes?.length || 0,
      cases_sample: cases,
      cases_error: casesError
    });

  } catch (error) {
    console.error('Check error:', error);
    return res.status(500).json({
      error: 'Check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
