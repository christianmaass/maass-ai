import { FlatAccessConfig, Money, PlanDetails, PricingContext, PricingStrategy } from '@lib/pricing/types';

export class FlatAccessStrategy implements PricingStrategy {
  readonly type = 'flat_access' as const;
  private config: FlatAccessConfig;

  constructor(config: FlatAccessConfig) {
    this.config = config;
  }

  getPlanDetails(_ctx?: PricingContext): PlanDetails {
    return this.config.plan;
  }

  getPriceForTrack(_trackId: string, _ctx?: PricingContext): Money {
    // Flat access: price is the same regardless of track; expose plan price
    return this.config.plan.price;
  }
}
