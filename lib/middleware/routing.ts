/**
 * ROUTING MIDDLEWARE
 * User-Status-basierte Navigation für Multi-Course Architecture
 *
 * FEATURES:
 * - Automatische User-Status-Erkennung (neu vs. wiederkehrend)
 * - Route-Protection und Weiterleitung
 * - Onboarding vs. Dashboard Flow-Unterscheidung
 * - navaa Guidelines Compliant
 *
 * @version 1.0.0
 * @author navaa Development Team
 */

import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

export interface UserStatus {
  isFirstTime: boolean;
  loginCount: number;
  onboardingCompleted: boolean;
  currentCourseId: string | null;
  hasActiveProgress: boolean;
}

export interface RouteConfig {
  requireAuth: boolean;
  allowedRoles?: string[];
  redirectNewUsers?: string;
  redirectReturningUsers?: string;
  fallbackRoute?: string;
}

export interface NavigationDecision {
  shouldRedirect: boolean;
  redirectTo: string;
  reason: 'new_user' | 'returning_user' | 'no_auth' | 'role_mismatch' | 'onboarding_incomplete';
}

// =============================================================================
// USER STATUS DETECTION
// =============================================================================

/**
 * Hook to get current user status for routing decisions
 */
export function useUserStatus() {
  const { user, profile, isAuthenticated, getAccessToken } = useAuth();
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserStatus() {
      if (!isAuthenticated() || !user) {
        setUserStatus(null);
        setLoading(false);
        return;
      }

      try {
        const token = await getAccessToken();
        const response = await fetch('/api/user/welcome-status', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user status');
        }

        const data = await response.json();

        setUserStatus({
          isFirstTime: data.isFirstTime,
          loginCount: data.loginCount,
          onboardingCompleted: profile?.onboarding_completed || false,
          currentCourseId: profile?.current_course_id || null,
          hasActiveProgress: data.currentCase !== null,
        });
      } catch (err) {
        console.error('Error fetching user status:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchUserStatus();
  }, [user, profile, isAuthenticated, getAccessToken]);

  return { userStatus, loading, error };
}

// =============================================================================
// ROUTE PROTECTION AND NAVIGATION
// =============================================================================

/**
 * Determine navigation decision based on user status and route config
 */
export function getNavigationDecision(
  userStatus: UserStatus | null,
  isAuthenticated: boolean,
  currentPath: string,
  config: RouteConfig,
): NavigationDecision {
  // No authentication required
  if (!config.requireAuth) {
    return { shouldRedirect: false, redirectTo: '', reason: 'no_auth' };
  }

  // User not authenticated - redirect to login
  if (!isAuthenticated || !userStatus) {
    return {
      shouldRedirect: true,
      redirectTo: '/?login=true',
      reason: 'no_auth',
    };
  }

  // New user flow
  if (userStatus.isFirstTime || !userStatus.onboardingCompleted) {
    if (config.redirectNewUsers && currentPath !== config.redirectNewUsers) {
      return {
        shouldRedirect: true,
        redirectTo: config.redirectNewUsers,
        reason: 'new_user',
      };
    }
  }

  // Returning user flow
  if (!userStatus.isFirstTime && userStatus.onboardingCompleted) {
    if (config.redirectReturningUsers && currentPath !== config.redirectReturningUsers) {
      return {
        shouldRedirect: true,
        redirectTo: config.redirectReturningUsers,
        reason: 'returning_user',
      };
    }
  }

  return { shouldRedirect: false, redirectTo: '', reason: 'no_auth' };
}

/**
 * Hook for automatic route protection and redirection
 */
export function useRouteProtection(config: RouteConfig) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { userStatus, loading } = useUserStatus();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (loading || isRedirecting) return;

    const decision = getNavigationDecision(userStatus, isAuthenticated(), router.asPath, config);

    if (decision.shouldRedirect) {
      setIsRedirecting(true);
      console.log(`Redirecting ${decision.reason}: ${router.asPath} -> ${decision.redirectTo}`);
      router.push(decision.redirectTo);
    }
  }, [userStatus, loading, router, config, isAuthenticated, isRedirecting]);

  return {
    userStatus,
    loading: loading || isRedirecting,
    isRedirecting,
  };
}

// =============================================================================
// ROUTE CONFIGURATIONS
// =============================================================================

/**
 * Predefined route configurations for common patterns
 */
export const ROUTE_CONFIGS = {
  // Public pages (no auth required)
  PUBLIC: {
    requireAuth: false,
  },

  // Dashboard - returning users only
  DASHBOARD: {
    requireAuth: true,
    redirectNewUsers: '/onboarding',
    fallbackRoute: '/dashboard',
  },

  // Onboarding - new users only
  ONBOARDING: {
    requireAuth: true,
    redirectReturningUsers: '/dashboard',
    fallbackRoute: '/onboarding',
  },

  // Course pages - authenticated users
  COURSE: {
    requireAuth: true,
    fallbackRoute: '/dashboard',
  },

  // Admin pages - admin role required
  ADMIN: {
    requireAuth: true,
    allowedRoles: ['admin', 'super_admin'],
    fallbackRoute: '/dashboard',
  },
} as const;

// =============================================================================
// NAVIGATION UTILITIES
// =============================================================================

/**
 * Get the appropriate landing page for a user
 */
export function getUserLandingPage(userStatus: UserStatus | null): string {
  if (!userStatus) {
    return '/?login=true';
  }

  // New users go to onboarding
  if (userStatus.isFirstTime || !userStatus.onboardingCompleted) {
    return '/onboarding';
  }

  // Returning users go to dashboard
  return '/dashboard';
}

/**
 * Get the next recommended action for a user
 */
export function getNextUserAction(userStatus: UserStatus | null): {
  type: 'onboarding' | 'continue_course' | 'browse_courses';
  label: string;
  href: string;
} {
  if (!userStatus) {
    return {
      type: 'onboarding',
      label: 'Jetzt starten',
      href: '/onboarding',
    };
  }

  if (userStatus.isFirstTime || !userStatus.onboardingCompleted) {
    return {
      type: 'onboarding',
      label: 'Onboarding abschließen',
      href: '/onboarding',
    };
  }

  if (userStatus.hasActiveProgress && userStatus.currentCourseId) {
    return {
      type: 'continue_course',
      label: 'Kurs fortsetzen',
      href: `/course/${userStatus.currentCourseId}`,
    };
  }

  return {
    type: 'browse_courses',
    label: 'Kurse entdecken',
    href: '/dashboard',
  };
}

const RoutingUtils = {
  useUserStatus,
  useRouteProtection,
  getNavigationDecision,
  getUserLandingPage,
  getNextUserAction,
  ROUTE_CONFIGS,
};

export default RoutingUtils;
