/**
 * User profile helpers
 *
 * Normalizes handling of temporary/test account expiration.
 * Safe to use across UI and APIs.
 */
import type { UserProfile } from '../contexts/AuthContext';

/**
 * Returns true if the profile has an expiresAt set and it is in the past.
 * - If expiresAt is undefined/null, this returns false (treated as non-expiring).
 */
export function isExpired(
  profile?: Pick<UserProfile, 'expiresAt'> | null,
  now: Date = new Date(),
): boolean {
  if (!profile?.expiresAt) return false;
  const exp = new Date(profile.expiresAt).getTime();
  if (Number.isNaN(exp)) return false; // be conservative: invalid date => not expired
  return exp <= now.getTime();
}

/**
 * Convenience: active if not expired.
 */
export function isActiveProfile(
  profile?: Pick<UserProfile, 'expiresAt'> | null,
  now: Date = new Date(),
): boolean {
  return !isExpired(profile, now);
}
