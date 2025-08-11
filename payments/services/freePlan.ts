export interface AssignFreePlanInput {
  supabase: any; // typed Supabase client if available
  userId: string;
}

export async function assignFreePlan({ supabase, userId }: AssignFreePlanInput) {
  // Free Plan ID holen
  const { data: freePlan, error: planError } = await supabase
    .from('tariff_plans')
    .select('id')
    .eq('name', 'Free')
    .single();

  if (planError || !freePlan) {
    throw new Error('Free plan not found');
  }

  const { data: subscription, error: subscriptionError } = await supabase
    .from('user_subscriptions')
    .upsert(
      {
        user_id: userId,
        tariff_plan_id: freePlan.id,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        cancel_at_period_end: false,
        cancelled_at: null,
        stripe_subscription_id: null,
        stripe_customer_id: null,
      },
      { onConflict: 'user_id' },
    )
    .select()
    .single();

  if (subscriptionError) {
    throw new Error('Failed to assign free plan');
  }

  return subscription;
}
