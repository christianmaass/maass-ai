import { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient } from '../../supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user_id, case_id, response_text, time_spent_seconds } = req.body;

    if (!user_id || !case_id || !response_text) {
      return res.status(400).json({ error: 'user_id, case_id, and response_text are required' });
    }

    const supabase = getSupabaseClient();

    // User Response speichern
    const { data: savedResponse, error: saveError } = await supabase
      .from('user_responses')
      .insert({
        user_id,
        case_id,
        response_text,
        time_spent_seconds: time_spent_seconds || null
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving response:', saveError);
      return res.status(500).json({ error: 'Failed to save response' });
    }

    res.status(200).json({
      response: savedResponse,
      message: 'Response saved successfully'
    });

  } catch (error) {
    console.error('Error submitting response:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
