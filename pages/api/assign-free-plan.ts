import { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient } from '@supabaseClient';
import { assignFreePlan } from '@payments/services/freePlan';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabaseClient();

    // User authentifizieren
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized - please log in' });
    }

    const subscription = await assignFreePlan({ supabase, userId: user.id });

    return res.status(200).json({
      success: true,
      message: 'Free plan successfully assigned',
      subscription,
    });
  } catch (error) {
    console.error('Error in assign-free-plan API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
