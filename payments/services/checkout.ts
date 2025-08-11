import type Stripe from 'stripe';
import { stripe } from './stripe.service';

export interface CreateCheckoutInput {
  supabase: any; // typed Supabase client if available
  userId: string;
  userEmail?: string | null;
  planName: string;
  planDisplayName: string;
  origin: string;
}

export async function createCheckoutSession({
  supabase,
  userId,
  userEmail,
  planName,
  planDisplayName,
  origin,
}: CreateCheckoutInput): Promise<{ sessionId: string }> {
  if (!stripe) throw new Error('Stripe is not configured');

  // Plan aus DB
  const { data: plan, error: planError } = await supabase
    .from('tariff_plans')
    .select('*')
    .eq('name', planName)
    .single();
  if (planError || !plan) {
    throw new Error('Plan not found');
  }

  let priceData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData | undefined;
  if (planName === 'Plus') {
    priceData = {
      currency: 'eur',
      unit_amount: 990,
      recurring: { interval: 'month' },
      product_data: {
        name: `navaa.ai ${planDisplayName}`,
        description: '25 Cases pro Woche, erweiterte Features, Priority Support',
      },
    };
  }
  if (!priceData) {
    throw new Error('Only Plus plan is supported for Stripe checkout');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: userEmail ?? undefined,
    line_items: [{ price_data: priceData, quantity: 1 }],
    success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/preise?cancelled=true`,
    metadata: { user_id: userId, plan_name: planName, plan_id: plan.id },
    subscription_data: {
      metadata: { user_id: userId, plan_name: planName, plan_id: plan.id },
    },
  });

  return { sessionId: session.id };
}
