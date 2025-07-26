import { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient } from '../../supabaseClient';

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

    console.log('DEBUG: Starting assign-free-plan API for user:', user.id);
    
    // Free Plan ID holen
    const { data: freePlan, error: planError } = await supabase
      .from('tariff_plans')
      .select('id')
      .eq('name', 'Free')
      .single();

    console.log('DEBUG: Free plan query result:', { freePlan, planError });

    if (planError || !freePlan) {
      console.error('Error fetching free plan:', planError);
      return res.status(500).json({ 
        error: 'Free plan not found',
        debug: { planError, freePlan }
      });
    }

    // User Subscription für Free Plan erstellen/aktualisieren
    const { data: subscription, error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: user.id,
        tariff_plan_id: freePlan.id,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 Jahr
        cancel_at_period_end: false,
        cancelled_at: null,
        stripe_subscription_id: null,
        stripe_customer_id: null
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (subscriptionError) {
      console.error('Error creating/updating subscription:', subscriptionError);
      return res.status(500).json({ error: 'Failed to assign free plan' });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Free plan successfully assigned',
      subscription 
    });

  } catch (error) {
    console.error('Error in assign-free-plan API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
