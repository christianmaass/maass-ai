import { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient } from '../../supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabaseClient();

    // User authentifizieren
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // User-Tarif-Informationen aus der View abrufen
    const { data: tariffInfo, error: tariffError } = await supabase
      .from('user_tariff_info')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (tariffError) {
      console.error('Error fetching tariff info:', tariffError);
      
      // Fallback: Free-Tarif als Standard
      const { data: freePlan } = await supabase
        .from('tariff_plans')
        .select('*')
        .eq('name', 'Free')
        .single();

      return res.status(200).json({
        user_id: user.id,
        email: user.email,
        tariff_name: 'Free',
        tariff_display_name: 'Free',
        cases_per_week: freePlan?.cases_per_week || 5,
        cases_per_month: freePlan?.cases_per_month || 20,
        features: freePlan?.features || {},
        subscription_status: 'active',
        current_period_end: null,
        cancel_at_period_end: false,
        cases_used_this_week: 0,
        cases_used_this_month: 0
      });
    }

    return res.status(200).json(tariffInfo);

  } catch (error) {
    console.error('Error in user-tariff API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
