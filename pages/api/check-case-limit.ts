import { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient } from '../../supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabaseClient();

    // Get Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No valid authorization header' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // User authentifizieren mit Token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
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
      // Fallback: Free-Tarif Limits
      return res.status(200).json({
        canCreateCase: true, // Für Fallback erlauben wir erstmal
        casesUsedThisWeek: 0,
        casesLimitWeek: 5,
        casesUsedThisMonth: 0,
        casesLimitMonth: 20,
        tariffName: 'Free',
        resetDate: getNextWeekReset()
      });
    }

    // Prüfen ob User Cases erstellen kann
    const canCreateCase = checkCaseLimits(tariffInfo);

    return res.status(200).json({
      canCreateCase,
      casesUsedThisWeek: tariffInfo.cases_used_this_week || 0,
      casesLimitWeek: tariffInfo.cases_per_week || 5,
      casesUsedThisMonth: tariffInfo.cases_used_this_month || 0,
      casesLimitMonth: tariffInfo.cases_per_month || 20,
      tariffName: tariffInfo.tariff_name,
      resetDate: getNextWeekReset(),
      upgradeRequired: !canCreateCase
    });

  } catch (error) {
    console.error('Error in check-case-limit API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function checkCaseLimits(tariffInfo: any): boolean {
  // Unbegrenzte Tarife (Business, Bildungsträger)
  if (tariffInfo.cases_per_week === -1 || tariffInfo.cases_per_month === -1) {
    return true;
  }

  // Wöchentliches Limit prüfen
  const weeklyLimitReached = (tariffInfo.cases_used_this_week || 0) >= (tariffInfo.cases_per_week || 5);
  
  // Monatliches Limit prüfen (falls definiert)
  const monthlyLimitReached = tariffInfo.cases_per_month && 
    (tariffInfo.cases_used_this_month || 0) >= tariffInfo.cases_per_month;

  // User kann Case erstellen, wenn beide Limits nicht erreicht sind
  return !weeklyLimitReached && !monthlyLimitReached;
}

function getNextWeekReset(): string {
  const now = new Date();
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + (1 + 7 - now.getDay()) % 7);
  return nextMonday.toLocaleDateString('de-DE');
}
