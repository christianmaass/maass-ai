/**
 * 🚀 NAVAA.AI DEVELOPMENT STANDARDS
 *
 * This file follows navaa.ai development guidelines:
 * 📋 CONTRIBUTING.md - Contribution standards and workflow
 * 📚 docs/navaa-development-guidelines.md - Complete development standards
 *
 * KEY STANDARDS FOR THIS FILE:
 * ✅ Stability First - Never change working features without clear reason
 * ✅ Security First - JWT authentication, RLS compliance
 * ✅ Unified Guard Pattern - Single guard for routing logic
 * ✅ Smart Routing - Central routing decisions, no conflicts
 * ✅ Subscription Awareness - Support for free/paid/business tiers
 * ✅ Error Handling - Robust fallback and logging
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */

/**
 * UNIFIED GUARD HOOK
 * Subscription-aware React Hook für automatische Route-Protection
 *
 * FEATURES:
 * - Smart routing based on user status and enrollments
 * - Subscription tier enforcement (free/paid/business)
 * - Consistent logic with homepage routing
 * - Robust error handling and fallbacks
 *
 * USAGE:
 * const { isChecking, shouldRedirect, redirectTarget } = useUnifiedGuard({
 *   requireAuth: true,
 *   requiredTier: 'paid'
 * });
 *
 * @version 2.0.0 (Unified Guard Migration)
 * @author navaa Development Team
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface UnifiedGuardConfig {
  // Authentication
  requireAuth: boolean;

  // Subscription
  requiredTier: 'free' | 'paid' | 'business';

  // Custom Redirects (optional)
  newUserRedirect?: string;
  returningUserRedirect?: string;
  upgradeRedirect?: string;

  // Behavior
  allowOnError?: boolean;
  debugMode?: boolean;
}

interface RoutingFactors {
  // Authentication
  isAuthenticated: boolean;
  user: any;

  // User Status
  onboarding_completed: boolean;
  hasActiveEnrollments: boolean;
  login_count: number;

  // Subscription (Future-Ready)
  subscription_tier: 'free' | 'paid' | 'business' | null;
  subscription_status: 'active' | 'expired' | 'trial' | null;

  // Route Context
  currentRoute: string;
  requiredTier: 'free' | 'paid' | 'business';
}

interface RoutingDecision {
  action: 'allow' | 'redirect' | 'block';
  target?: string;
  reason: string;
}

// =============================================================================
// SUBSCRIPTION TIER LOGIC
// =============================================================================

const TIER_HIERARCHY = {
  free: 0,
  paid: 1,
  business: 2,
};

function hasSubscriptionAccess(userTier: string | null, requiredTier: string): boolean {
  const userLevel = TIER_HIERARCHY[userTier as keyof typeof TIER_HIERARCHY] || 0;
  const requiredLevel = TIER_HIERARCHY[requiredTier as keyof typeof TIER_HIERARCHY] || 0;
  return userLevel >= requiredLevel;
}

// =============================================================================
// ROUTING DECISION ENGINE
// =============================================================================

function calculateRoutingDecision(
  factors: RoutingFactors,
  config: UnifiedGuardConfig,
): RoutingDecision {
  const {
    currentRoute,
    requiredTier,
    isAuthenticated,
    onboarding_completed,
    hasActiveEnrollments,
    subscription_tier,
  } = factors;

  // Treat explicit course navigation as course intent to avoid overzealous onboarding redirects
  // Examples: /courses/strategy-track, /courses/<slug>, /tracks/strategy
  const routePathOnly = currentRoute.split('?')[0] || currentRoute;
  const isCourseIntent =
    routePathOnly.startsWith('/course') || // actual course route in this app
    routePathOnly.startsWith('/courses') || // future-proof alias
    routePathOnly === '/tracks/strategy' ||
    routePathOnly.startsWith('/tracks/strategy');

  // 1. Authentication Check (highest priority)
  if (config.requireAuth && !isAuthenticated) {
    return {
      action: 'redirect',
      target: '/?login=true',
      reason: 'authentication_required',
    };
  }

  // 2. Onboarding Check (second priority)
  // User should go to onboarding ONLY if: no onboarding completed AND no active enrollments
  const shouldRedirectToOnboarding = !onboarding_completed && !hasActiveEnrollments;

  // Do not force onboarding if user explicitly navigates to a course page.
  // In that case, proceed to subscription/tier checks first.
  if (
    shouldRedirectToOnboarding &&
    !isCourseIntent &&
    config.newUserRedirect &&
    currentRoute !== config.newUserRedirect
  ) {
    return {
      action: 'redirect',
      target: config.newUserRedirect,
      reason: 'needs_onboarding',
    };
  }

  // 3. Subscription Tier Check (third priority)
  if (!hasSubscriptionAccess(subscription_tier, requiredTier)) {
    const upgradeTarget = config.upgradeRedirect || `/upgrade/${requiredTier}`;
    return {
      action: 'redirect',
      target: upgradeTarget,
      reason: 'insufficient_subscription_tier',
    };
  }

  // 4. Returning User Redirect (if configured)
  if (
    !shouldRedirectToOnboarding &&
    config.returningUserRedirect &&
    currentRoute !== config.returningUserRedirect
  ) {
    // Only redirect if user is on onboarding page but should be on dashboard
    if (currentRoute === '/onboarding-new' || currentRoute === '/onboarding') {
      return {
        action: 'redirect',
        target: config.returningUserRedirect,
        reason: 'returning_user_redirect',
      };
    }
  }

  // 5. Allow Access
  return {
    action: 'allow',
    reason: 'access_granted',
  };
}

// =============================================================================
// MAIN HOOK
// =============================================================================

export function useUnifiedGuard(config: UnifiedGuardConfig) {
  const router = useRouter();
  const { user, profile, session, isAuthenticated, authLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [routingDecision, setRoutingDecision] = useState<RoutingDecision | null>(null);

  useEffect(() => {
    async function checkRouteAccess() {
      try {
        // Wait for auth to be ready
        if (authLoading) return;

        // Debug logging
        if (config.debugMode) {
          console.log('🛡️ UnifiedGuard - Starting route check:', {
            currentRoute: router.asPath,
            requireAuth: config.requireAuth,
            requiredTier: config.requiredTier,
            user: !!user,
            profile: !!profile,
          });
        }

        // No auth required - allow access immediately
        if (!config.requireAuth) {
          setRoutingDecision({ action: 'allow', reason: 'no_auth_required' });
          setIsChecking(false);
          return;
        }

        // Not authenticated - redirect to login
        if (!isAuthenticated() || !user) {
          const decision = {
            action: 'redirect' as const,
            target: '/?login=true',
            reason: 'authentication_required',
          };
          setRoutingDecision(decision);
          setIsChecking(false);
          router.push(decision.target);
          return;
        }

        // Get user status
        const userStatus = {
          onboarding_completed: (profile as any)?.onboarding_completed || false,
          login_count: (profile as any)?.login_count || 0,
        };

        // Check for active enrollments (same logic as homepage)
        let hasActiveEnrollments = false;
        try {
          // Build headers with JWT token (navaa Guidelines compliant)
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };

          if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`;
          }

          const response = await fetch('/api/courses', {
            method: 'GET',
            headers,
          });

          if (response.ok) {
            const data = await response.json();
            hasActiveEnrollments =
              data.courses?.some((course: any) => course.user_enrolled) || false;
          }
        } catch (error) {
          console.error('UnifiedGuard enrollment check failed:', error);
          if (!config.allowOnError) {
            // Fail safe - allow access on API error unless explicitly configured otherwise
            hasActiveEnrollments = false;
          }
        }

        // Get subscription info (placeholder for future implementation)
        const subscription_tier = (profile as any)?.subscription_tier || 'free';
        const subscription_status = (profile as any)?.subscription_status || 'active';

        // Build routing factors
        const factors: RoutingFactors = {
          isAuthenticated: true,
          user,
          onboarding_completed: userStatus.onboarding_completed,
          hasActiveEnrollments,
          login_count: userStatus.login_count,
          subscription_tier,
          subscription_status,
          currentRoute: router.asPath,
          requiredTier: config.requiredTier,
        };

        // Calculate routing decision
        const decision = calculateRoutingDecision(factors, config);
        setRoutingDecision(decision);

        // Debug logging
        if (config.debugMode) {
          // Derive debug-only helpers to verify course-intent logic
          const routePathOnly = (factors.currentRoute.split('?')[0] ||
            factors.currentRoute) as string;
          const debugIsCourseIntent =
            routePathOnly.startsWith('/course') ||
            routePathOnly.startsWith('/courses') ||
            routePathOnly === '/tracks/strategy' ||
            routePathOnly.startsWith('/tracks/strategy');
          const debugShouldRedirectToOnboarding =
            !factors.onboarding_completed && !factors.hasActiveEnrollments;

          console.log('🛡️ UnifiedGuard - Routing decision:', {
            factors,
            derived: {
              routePathOnly,
              isCourseIntent: debugIsCourseIntent,
              shouldRedirectToOnboarding: debugShouldRedirectToOnboarding,
            },
            decision,
            config,
          });
        }

        // Execute redirect if needed
        if (decision.action === 'redirect' && decision.target) {
          router.push(decision.target);
        }

        setIsChecking(false);
      } catch (error) {
        console.error('UnifiedGuard error:', error);

        if (config.allowOnError) {
          setRoutingDecision({ action: 'allow', reason: 'error_fallback' });
        } else {
          setRoutingDecision({ action: 'block', reason: 'error_occurred' });
        }

        setIsChecking(false);
      }
    }

    checkRouteAccess();
  }, [
    authLoading,
    user,
    profile,
    router,
    router.asPath,
    config,
    isAuthenticated,
    session?.access_token,
  ]);

  return {
    isChecking,
    routingDecision,
    shouldRedirect: routingDecision?.action === 'redirect',
    redirectTarget: routingDecision?.target,
    accessGranted: routingDecision?.action === 'allow',
    isBlocked: routingDecision?.action === 'block',
  };
}

// =============================================================================
// PREDEFINED CONFIGURATIONS
// =============================================================================

export const UNIFIED_GUARDS = {
  DASHBOARD: {
    requireAuth: true,
    requiredTier: 'free' as const,
    newUserRedirect: '/onboarding-new',
    returningUserRedirect: '/',
    allowOnError: true,
    debugMode: process.env.NODE_ENV === 'development',
  },

  ONBOARDING: {
    requireAuth: true,
    requiredTier: 'free' as const,
    returningUserRedirect: '/',
    allowOnError: true,
    debugMode: process.env.NODE_ENV === 'development',
  },

  COURSE: {
    requireAuth: true,
    requiredTier: 'free' as const,
    newUserRedirect: '/onboarding-new',
    allowOnError: true,
    debugMode: process.env.NODE_ENV === 'development',
  },

  PREMIUM_COURSE: {
    requireAuth: true,
    requiredTier: 'paid' as const,
    newUserRedirect: '/onboarding-new',
    upgradeRedirect: '/upgrade/paid',
    allowOnError: false,
    debugMode: process.env.NODE_ENV === 'development',
  },

  BUSINESS_FEATURES: {
    requireAuth: true,
    requiredTier: 'business' as const,
    newUserRedirect: '/onboarding-new',
    upgradeRedirect: '/upgrade/business',
    allowOnError: false,
    debugMode: process.env.NODE_ENV === 'development',
  },
};

export default useUnifiedGuard;
