import { buildStrategy } from './config';
import type { Money, PlanDetails } from './types';

let _strategy = buildStrategy();

export function getActiveStrategyType() {
  return _strategy.type;
}

export function reloadPricingStrategy() {
  // Allows hot reload if config changes at runtime (dev only)
  _strategy = buildStrategy();
}

export async function getPlanDetails(): Promise<PlanDetails> {
  return Promise.resolve(_strategy.getPlanDetails());
}

export async function getPriceForTrack(trackId: string): Promise<Money> {
  return Promise.resolve(_strategy.getPriceForTrack(trackId));
}
