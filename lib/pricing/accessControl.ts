// Pricing Access-Control shim (isolated, no core coupling)
// This module centralizes decisions about whether a user can access a track,
// independently from pricing strategy selection. Replace internals without affecting callers.

export interface AccessDecision {
  allowed: boolean;
  reason?: string;
}

export async function canAccessTrack(userId: string | null, _trackId: string): Promise<AccessDecision> {
  // Placeholder: allow access for authenticated users for now.
  // Later integrate with entitlements/purchases without changing call sites.
  if (!userId) return { allowed: false, reason: 'NOT_AUTHENTICATED' };
  return { allowed: true };
}
