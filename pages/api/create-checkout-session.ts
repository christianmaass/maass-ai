import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../lib/stripe';
import { getSupabaseClient } from '../../supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!stripe) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'Stripe is not configured. Check STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.',
      );
    }
    return res.status(500).json({ error: 'Stripe is not configured' });
  }

  try {
    const { planName, planDisplayName } = req.body;

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

    // Plan-Details aus der Datenbank holen
    const { data: plan, error: planError } = await supabase
      .from('tariff_plans')
      .select('*')
      .eq('name', planName)
      .single();

    if (planError || !plan) {
      console.error('Error fetching plan:', planError);
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Für MVP: Feste Preise definieren (später aus Datenbank)
    let priceData;
    if (planName === 'Plus') {
      priceData = {
        currency: 'eur',
        unit_amount: 990, // 9.90 EUR in Cent
        recurring: {
          interval: 'month',
        },
        product_data: {
          name: `navaa.ai ${planDisplayName}`,
          description: '25 Cases pro Woche, erweiterte Features, Priority Support',
        },
      };
    } else {
      return res.status(400).json({ error: 'Only Plus plan is supported for Stripe checkout' });
    }

    // Stripe Checkout Session erstellen
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: user.email,
      line_items: [
        {
          price_data: priceData,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/preise?cancelled=true`,
      metadata: {
        user_id: user.id,
        plan_name: planName,
        plan_id: plan.id,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          plan_name: planName,
          plan_id: plan.id,
        },
      },
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({
      error: 'Failed to create checkout session',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
