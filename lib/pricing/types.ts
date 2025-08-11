// Isolated pricing domain types (no coupling to app logic)

export type Currency = 'EUR' | 'USD';

export interface Money {
  amount: number; // in minor units (e.g. cents)
  currency: Currency;
}

export interface PlanDetails {
  id: string;
  name: string;
  description?: string;
  price: Money;
  interval?: 'one_time' | 'month' | 'year';
}

export interface PricingContext {
  // Optional context to inform strategy decisions without hard-coupling
  userId?: string;
  trackId?: string;
}

export interface PricingStrategy {
  readonly type: StrategyType;
  getPlanDetails(ctx?: PricingContext): Promise<PlanDetails> | PlanDetails;
  getPriceForTrack(trackId: string, ctx?: PricingContext): Promise<Money> | Money;
}

export type StrategyType = 'flat_access' | 'per_track';

export interface PerTrackConfig {
  default: Money;
  byTrack: Record<string, Money>; // trackId -> price
}

export interface FlatAccessConfig {
  plan: PlanDetails;
}
