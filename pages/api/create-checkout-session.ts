import { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient } from '../../supabaseClient';
import { createCheckoutSession } from '@payments/services/checkout';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planName, planDisplayName } = req.body as { planName?: string; planDisplayName?: string };
    if (!planName || !planDisplayName) {
      return res.status(400).json({ error: 'Plan name and display name are required' });
    }

    const supabase = getSupabaseClient();

    // User authentifizieren
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized - please log in' });
    }

    const { sessionId } = await createCheckoutSession({
      supabase,
      userId: user.id,
      userEmail: user.email ?? null,
      planName,
      planDisplayName,
      origin: String(req.headers.origin || ''),
    });

    return res.status(200).json({ sessionId });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({
      error: 'Failed to create checkout session',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
