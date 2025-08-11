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
 * ✅ Unified Guard Pattern - Testing new guard implementation
 * ✅ Loading States - Robust loading and error handling
 * ✅ Testing - Comprehensive validation of guard logic
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */

/**
 * UNIFIED GUARD TEST PAGE
 * Test page for validating UnifiedGuard functionality
 *
 * FEATURES:
 * - Test different guard configurations
 * - Validate subscription tier logic
 * - Debug routing decisions
 * - Manual testing interface
 *
 * @version 1.0.0 (Testing)
 * @author navaa Development Team
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UnifiedGuard, { UNIFIED_GUARDS } from '../components/ui/UnifiedGuard';
import { useUnifiedGuard } from '../hooks/useUnifiedGuard';

// =============================================================================
// TEST CONFIGURATIONS
// =============================================================================

const TEST_CONFIGS = {
  DASHBOARD_TEST: {
    ...UNIFIED_GUARDS.DASHBOARD,
    debugMode: true,
  },
  PREMIUM_TEST: {
    ...UNIFIED_GUARDS.PREMIUM_COURSE,
    debugMode: true,
  },
  BUSINESS_TEST: {
    ...UNIFIED_GUARDS.BUSINESS_FEATURES,
    debugMode: true,
  },
};

// =============================================================================
// TEST COMPONENTS
// =============================================================================

function GuardTestContent({ guardType }: { guardType: string }) {
  return (
    <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
      <h2 className="text-xl font-bold text-green-800 mb-2">
        ✅ {guardType} Guard Test - Zugriff gewährt!
      </h2>
      <p className="text-green-700">
        Diese Komponente wird nur angezeigt, wenn der UnifiedGuard den Zugriff erlaubt.
      </p>
    </div>
  );
}

function GuardDebugInfo({ config }: { config: any }) {
  const { user, profile } = useAuth();
  const guardResult = useUnifiedGuard(config);

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
      <h3 className="font-bold text-gray-800 mb-2">🔍 Debug Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-semibold text-gray-700 mb-1">User Status:</h4>
          <ul className="space-y-1 text-gray-600">
            <li>• Authenticated: {user ? '✅' : '❌'}</li>
            <li>• Onboarding: {(profile as any)?.onboarding_completed ? '✅' : '❌'}</li>
            <li>• Login Count: {(profile as any)?.login_count || 0}</li>
            <li>• Subscription: {(profile as any)?.subscription_tier || 'free'}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-1">Guard Result:</h4>
          <ul className="space-y-1 text-gray-600">
            <li>• Checking: {guardResult.isChecking ? '⏳' : '✅'}</li>
            <li>• Should Redirect: {guardResult.shouldRedirect ? '🔄' : '❌'}</li>
            <li>• Access Granted: {guardResult.accessGranted ? '✅' : '❌'}</li>
            <li>• Is Blocked: {guardResult.isBlocked ? '🚫' : '❌'}</li>
          </ul>
        </div>
      </div>

      {guardResult.routingDecision && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
          <strong>Routing Decision:</strong> {guardResult.routingDecision.reason}
          {guardResult.redirectTarget && <span> → {guardResult.redirectTarget}</span>}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN TEST PAGE
// =============================================================================

export default function TestUnifiedGuard() {
  const [selectedTest, setSelectedTest] = useState<keyof typeof TEST_CONFIGS>('DASHBOARD_TEST');
  const { user, profile } = useAuth();

  // This test page is intentionally unprotected to allow testing of guard behavior
  // We show the guard results without wrapping the entire page

  return (
    <div className="min-h-screen bg-navaa-bg-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navaa-text-primary mb-2">
              🛡️ UnifiedGuard Test Suite
            </h1>
            <p className="text-navaa-text-secondary">
              Test und validiere die UnifiedGuard-Funktionalität mit verschiedenen Konfigurationen.
            </p>
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              ⚠️ Diese Test-Seite ist absichtlich ungeschützt, um Guard-Verhalten zu testen.
            </div>
          </div>

          {/* User Info */}
          <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
            <h2 className="font-bold text-gray-800 mb-2">👤 Current User Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">User:</span>{' '}
                {user ? '✅ Authenticated' : '❌ Not authenticated'}
              </div>
              <div>
                <span className="font-medium">Onboarding:</span>{' '}
                {(profile as any)?.onboarding_completed ? '✅ Completed' : '❌ Pending'}
              </div>
              <div>
                <span className="font-medium">Subscription:</span>{' '}
                {(profile as any)?.subscription_tier || 'free'}
              </div>
            </div>
          </div>

          {/* Test Selection */}
          <div className="mb-6">
            <h2 className="font-bold text-gray-800 mb-3">🧪 Select Test Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(TEST_CONFIGS).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTest(key as keyof typeof TEST_CONFIGS)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    selectedTest === key
                      ? 'border-navaa-primary bg-navaa-primary bg-opacity-10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-800">
                    {key.replace('_TEST', '').replace('_', ' ')}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Required Tier: {config.requiredTier}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Debug Info */}
          <GuardDebugInfo config={TEST_CONFIGS[selectedTest]} />

          {/* Guard Test */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="font-medium text-gray-800">
                🛡️ Testing: {selectedTest.replace('_TEST', '').replace('_', ' ')} Guard
              </h3>
            </div>

            <div className="p-4">
              <UnifiedGuard config={TEST_CONFIGS[selectedTest]}>
                <GuardTestContent guardType={selectedTest.replace('_TEST', '').replace('_', ' ')} />
              </UnifiedGuard>
            </div>
          </div>

          {/* Configuration Details */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-2">⚙️ Current Configuration</h3>
            <pre className="text-xs text-gray-600 overflow-x-auto">
              {JSON.stringify(TEST_CONFIGS[selectedTest], null, 2)}
            </pre>
          </div>

          {/* Navigation */}
          <div className="mt-8 text-center">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              ← Zurück
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
