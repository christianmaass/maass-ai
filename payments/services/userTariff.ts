interface SupabaseLike {
  from: (table: string) => any;
}

export interface GetUserTariffInput {
  supabase: SupabaseLike;
  userId: string;
}

export async function getUserTariff({ supabase, userId }: GetUserTariffInput) {
  const { data: tariffInfo, error: tariffError } = await (supabase as any)
    .from('user_tariff_info')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (tariffError) {
    // Fallback auf Free Plan
    const { data: freePlan } = await (supabase as any)
      .from('tariff_plans')
      .select('*')
      .eq('name', 'Free')
      .single();

    return {
      user_id: userId,
      email: null,
      tariff_name: 'Free',
      tariff_display_name: 'Free',
      cases_per_week: freePlan?.cases_per_week || 5,
      cases_per_month: freePlan?.cases_per_month || 20,
      features: freePlan?.features || {},
      subscription_status: 'active',
      current_period_end: null,
      cancel_at_period_end: false,
      cases_used_this_week: 0,
      cases_used_this_month: 0,
    };
  }

  return tariffInfo;
}
