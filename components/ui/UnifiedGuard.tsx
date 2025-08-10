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
 * ✅ Loading States - Robust loading and error handling
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */

/**
 * UNIFIED GUARD COMPONENT
 * Subscription-aware wrapper component for automatic route protection
 *
 * FEATURES:
 * - Smart routing based on user status and enrollments
 * - Subscription tier enforcement (free/paid/business)
 * - Consistent logic across all protected routes
 * - Customizable loading and error states
 *
 * USAGE:
 * <UnifiedGuard config={UNIFIED_GUARDS.DASHBOARD}>
 *   <DashboardContent />
 * </UnifiedGuard>
 *
 * @version 2.0.0 (Unified Guard Migration)
 * @author navaa Development Team
 */

import React from 'react';
import { useUnifiedGuard, UNIFIED_GUARDS } from '../../hooks/useUnifiedGuard';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface UnifiedGuardConfig {
  requireAuth: boolean;
  requiredTier: 'free' | 'paid' | 'business';
  newUserRedirect?: string;
  returningUserRedirect?: string;
  upgradeRedirect?: string;
  allowOnError?: boolean;
  debugMode?: boolean;
}

interface UnifiedGuardProps {
  config: UnifiedGuardConfig;
  children: React.ReactNode;
  loadingComponent?: React.ComponentType;
  errorComponent?: React.ComponentType<{ reason: string }>;
  upgradeComponent?: React.ComponentType<{ requiredTier: string; currentTier?: string }>;
}

// =============================================================================
// DEFAULT COMPONENTS
// =============================================================================

function DefaultLoadingComponent() {
  return (
    <div className="min-h-screen bg-navaa-bg-primary flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navaa-primary mx-auto mb-4"></div>
        <p className="text-navaa-text-secondary">Lade Seite...</p>
      </div>
    </div>
  );
}

function DefaultErrorComponent({ reason }: { reason: string }) {
  return (
    <div className="min-h-screen bg-navaa-bg-primary flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-navaa-text-primary mb-4">Zugriff nicht möglich</h1>
        <p className="text-navaa-text-secondary mb-6">
          Es ist ein Fehler beim Überprüfen der Zugriffsberechtigung aufgetreten.
        </p>
        <p className="text-sm text-navaa-text-muted">Fehlergrund: {reason}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-navaa-primary text-white rounded hover:bg-navaa-primary-dark transition-colors"
        >
          Seite neu laden
        </button>
      </div>
    </div>
  );
}

function DefaultUpgradeComponent({
  requiredTier,
  currentTier,
}: {
  requiredTier: string;
  currentTier?: string;
}) {
  return (
    <div className="min-h-screen bg-navaa-bg-primary flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-navaa-primary text-6xl mb-4">💎</div>
        <h1 className="text-2xl font-bold text-navaa-text-primary mb-4">Upgrade erforderlich</h1>
        <p className="text-navaa-text-secondary mb-6">
          Für diesen Bereich benötigen Sie ein {requiredTier === 'paid' ? 'Premium' : 'Business'}
          -Abonnement.
        </p>
        {currentTier && (
          <p className="text-sm text-navaa-text-muted mb-4">
            Ihr aktueller Plan:{' '}
            {currentTier === 'free' ? 'Kostenlos' : currentTier === 'paid' ? 'Premium' : 'Business'}
          </p>
        )}
        <button
          onClick={() => (window.location.href = `/upgrade/${requiredTier}`)}
          className="px-6 py-3 bg-navaa-primary text-white rounded-lg hover:bg-navaa-primary-dark transition-colors font-medium"
        >
          Jetzt upgraden
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function UnifiedGuard({
  config,
  children,
  loadingComponent: LoadingComponent = DefaultLoadingComponent,
  errorComponent: ErrorComponent = DefaultErrorComponent,
  upgradeComponent: UpgradeComponent = DefaultUpgradeComponent,
}: UnifiedGuardProps) {
  const { isChecking, routingDecision, shouldRedirect, accessGranted, isBlocked } =
    useUnifiedGuard(config);

  // Show loading while checking route access
  if (isChecking) {
    return <LoadingComponent />;
  }

  // Show error if access is blocked
  if (isBlocked && routingDecision) {
    return <ErrorComponent reason={routingDecision.reason} />;
  }

  // Show upgrade prompt for insufficient subscription
  if (routingDecision?.reason === 'insufficient_subscription_tier') {
    return <UpgradeComponent requiredTier={config.requiredTier} />;
  }

  // Redirect is handled by the hook, show loading during redirect
  if (shouldRedirect) {
    return <LoadingComponent />;
  }

  // Access granted - render children
  if (accessGranted) {
    return <>{children}</>;
  }

  // Fallback - should not happen, but show loading for safety
  return <LoadingComponent />;
}

// =============================================================================
// UNIFIED GUARD - THE ONLY GUARD COMPONENT
// =============================================================================

// NOTE: No convenience wrappers! Use UnifiedGuard directly with config:
// <UnifiedGuard config={UNIFIED_GUARDS.ONBOARDING}>...</UnifiedGuard>
// <UnifiedGuard config={UNIFIED_GUARDS.DASHBOARD}>...</UnifiedGuard>
// <UnifiedGuard config={UNIFIED_GUARDS.COURSE}>...</UnifiedGuard>

// Export for backward compatibility and easy migration
export { UnifiedGuard, UNIFIED_GUARDS };
