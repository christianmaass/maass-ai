import { Money, PerTrackConfig, PlanDetails, PricingContext, PricingStrategy } from '@lib/pricing/types';

export class PerTrackStrategy implements PricingStrategy {
  readonly type = 'per_track' as const;
  private config: PerTrackConfig;
  private plan: PlanDetails;

  constructor(config: PerTrackConfig, plan: PlanDetails) {
    this.config = config;
    this.plan = plan;
  }

  getPlanDetails(_ctx?: PricingContext): PlanDetails {
    // Plan metadata (e.g., name "Pay per Track") separate from per-track price
    return this.plan;
  }

  getPriceForTrack(trackId: string, _ctx?: PricingContext): Money {
    return this.config.byTrack[trackId] ?? this.config.default;
  }
}
