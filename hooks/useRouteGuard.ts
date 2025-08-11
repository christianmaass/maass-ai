/**
 * ROUTE GUARD HOOK
 * Simplified React Hook für automatische Route-Protection
 *
 * USAGE:
 * - useRouteGuard(ROUTE_CONFIGS.DASHBOARD) - für Dashboard-Seiten
 * - useRouteGuard(ROUTE_CONFIGS.ONBOARDING) - für Onboarding-Seiten
 * - useRouteGuard(ROUTE_CONFIGS.COURSE) - für Kurs-Seiten
 *
 * @version 1.0.0
 * @author navaa Development Team
 */

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
 * ✅ Redirect Loop Prevention - Automatic loop detection
 * ✅ Enrollment Status - Check hasActiveEnrollments for routing
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@contexts/AuthContext';

// =============================================================================
// SIMPLIFIED ROUTE GUARD
// =============================================================================

export interface RouteGuardConfig {
  requireAuth: boolean;
  newUserRedirect?: string;
  returningUserRedirect?: string;
}

export function useRouteGuard(config: RouteGuardConfig) {
  const router = useRouter();
  const { user, profile, isAuthenticated, loading: authLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [userStatus, setUserStatus] = useState<{
    isFirstTime: boolean;
    onboardingCompleted: boolean;
  } | null>(null);

  useEffect(() => {
    async function checkRouteAccess() {
      // Wait for auth to be ready
      if (authLoading) return;

      // No auth required - allow access
      if (!config.requireAuth) {
        setIsChecking(false);
        return;
      }

      // Not authenticated - redirect to login
      if (!isAuthenticated() || !user) {
        router.push('/?login=true');
        return;
      }

      try {
        // Enhanced user status detection with enrollment check
        // Match the logic from homepage for consistency
        const status = {
          isFirstTime: !profile || (profile as any)?.login_count <= 1,
          onboardingCompleted: (profile as any)?.onboarding_completed || false,
        };

        setUserStatus(status);

        // Check for active enrollments (same logic as homepage)
        let hasActiveEnrollments = false;
        try {
          const response = await fetch('/api/courses', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('supabase.auth.token')}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            hasActiveEnrollments =
              data.courses?.some((course: any) => course.user_enrolled) || false;
            console.log('🎯 RouteGuard - hasActiveEnrollments:', hasActiveEnrollments);
          }
        } catch (error) {
          console.error('RouteGuard enrollment check failed:', error);
          // Continue without enrollment data on error
        }

        // Apply routing rules (same logic as homepage)
        // User should go to onboarding ONLY if: no onboarding completed AND no active enrollments
        const shouldRedirectToOnboarding = !status.onboardingCompleted && !hasActiveEnrollments;

        console.log('🎯 RouteGuard routing decision:');
        console.log('- onboardingCompleted:', status.onboardingCompleted);
        console.log('- hasActiveEnrollments:', hasActiveEnrollments);
        console.log('- shouldRedirectToOnboarding:', shouldRedirectToOnboarding);

        if (
          shouldRedirectToOnboarding &&
          config.newUserRedirect &&
          router.asPath !== config.newUserRedirect
        ) {
          console.log('✅ Redirecting to onboarding:', config.newUserRedirect);
          router.push(config.newUserRedirect);
          return;
        }

        if (
          !shouldRedirectToOnboarding &&
          config.returningUserRedirect &&
          router.asPath !== config.returningUserRedirect
        ) {
          console.log('✅ Redirecting to dashboard:', config.returningUserRedirect);
          router.push(config.returningUserRedirect);
          return;
        }
      } catch (error) {
        console.error('Route guard error:', error);
        // On error, allow access but log the issue
      }

      setIsChecking(false);
    }

    checkRouteAccess();
  }, [authLoading, isAuthenticated, user, profile, router, config]);

  return {
    isChecking: authLoading || isChecking,
    userStatus,
    isAuthenticated: isAuthenticated(),
  };
}

// =============================================================================
// PREDEFINED CONFIGURATIONS
// =============================================================================

export const ROUTE_GUARDS = {
  PUBLIC: {
    requireAuth: false,
  },

  DASHBOARD: {
    requireAuth: true,
    newUserRedirect: '/app/onboarding',
  },

  ONBOARDING: {
    requireAuth: true,
    returningUserRedirect: '/app',
  },

  COURSE: {
    requireAuth: true,
  },
} as const;

export default useRouteGuard;
