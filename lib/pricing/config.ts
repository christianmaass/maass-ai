import { FlatAccessStrategy } from './strategies/flatAccess';
import { PerTrackStrategy } from './strategies/perTrack';
import type {
  FlatAccessConfig,
  PerTrackConfig,
  PlanDetails,
  PricingStrategy,
  StrategyType,
} from './types';

// Select active strategy here (isolated switch)
export const ACTIVE_STRATEGY: StrategyType = 'flat_access';

// Flat access example
const flatPlan: PlanDetails = {
  id: 'flat-access',
  name: 'NAVAA All Access',
  description: 'Zugang zu allen Lernpfaden',
  price: { amount: 1999, currency: 'EUR' },
  interval: 'month',
};

const flatConfig: FlatAccessConfig = {
  plan: flatPlan,
};

// Per-track example config
const perTrackPlan: PlanDetails = {
  id: 'per-track',
  name: 'Pay per Track',
  description: 'Zahle pro Lernpfad',
  price: { amount: 0, currency: 'EUR' }, // Display-only; actual price per track below
  interval: 'one_time',
};

const perTrackConfig: PerTrackConfig = {
  default: { amount: 599, currency: 'EUR' },
  byTrack: {
    'strategy': { amount: 899, currency: 'EUR' },
    'foundation': { amount: 499, currency: 'EUR' },
  },
};

export function buildStrategy(): PricingStrategy {
  if (ACTIVE_STRATEGY === 'per_track') {
    return new PerTrackStrategy(perTrackConfig, perTrackPlan);
  }
  return new FlatAccessStrategy(flatConfig);
}
