/**
 * UnifiedGuard (UI wrapper)
 * Migrated from components/ui/UnifiedGuard.tsx
 */
import React from 'react';
import { useUnifiedGuard, UNIFIED_GUARDS } from '@hooks/useUnifiedGuard';

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

function UnifiedGuard({
  config,
  children,
  loadingComponent: LoadingComponent = DefaultLoadingComponent,
  errorComponent: ErrorComponent = DefaultErrorComponent,
  upgradeComponent: UpgradeComponent = DefaultUpgradeComponent,
}: UnifiedGuardProps) {
  const { isChecking, routingDecision, shouldRedirect, accessGranted, isBlocked } =
    useUnifiedGuard(config);

  if (isChecking) return <LoadingComponent />;

  if (isBlocked && routingDecision) {
    return <ErrorComponent reason={routingDecision.reason} />;
  }

  if (routingDecision?.reason === 'insufficient_subscription_tier') {
    return <UpgradeComponent requiredTier={config.requiredTier} />;
  }

  if (shouldRedirect) return <LoadingComponent />;

  if (accessGranted) return <>{children}</>;

  return <LoadingComponent />;
}

// Re-export named for convenience alongside default
export default UnifiedGuard;
export { UNIFIED_GUARDS, UnifiedGuard };
