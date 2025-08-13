/**
 * TEST ROUTING MIDDLEWARE
 * Test-Seite für User-Status-basierte Navigation
 *
 * FEATURES:
 * - User-Status-Anzeige
 * - Route-Guard-Testing
 * - Navigation-Decision-Preview
 *
 * @version 1.0.0
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { UnifiedGuard, UNIFIED_GUARDS } from '@ui/UnifiedGuard';

// =============================================================================
// MOCK USER STATUS FOR TESTING
// =============================================================================

interface UserStatusDisplay {
  isFirstTime: boolean;
  loginCount: number;
  onboardingCompleted: boolean;
  currentCourseId: string | null;
  hasActiveProgress: boolean;
}

function UserStatusCard({ status }: { status: UserStatusDisplay | null }) {
  if (!status) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="font-semibold text-red-800 mb-2">❌ Nicht authentifiziert</h3>
        <p className="text-red-600">User ist nicht eingeloggt</p>
      </div>
    );
  }

  const userType =
    status.isFirstTime || !status.onboardingCompleted ? 'Neuer User' : 'Wiederkehrender User';
  const bgColor = status.isFirstTime
    ? 'bg-blue-50 border-blue-200'
    : 'bg-green-50 border-green-200';
  const textColor = status.isFirstTime ? 'text-blue-800' : 'text-green-800';

  return (
    <div className={`${bgColor} border rounded-lg p-4`}>
      <h3 className={`font-semibold ${textColor} mb-3`}>👤 {userType}</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Erstes Mal:</span>
          <span className={status.isFirstTime ? 'text-blue-600 font-semibold' : 'text-gray-600'}>
            {status.isFirstTime ? 'Ja' : 'Nein'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Login Count:</span>
          <span className="font-mono">{status.loginCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Onboarding:</span>
          <span className={status.onboardingCompleted ? 'text-green-600' : 'text-orange-600'}>
            {status.onboardingCompleted ? 'Abgeschlossen' : 'Ausstehend'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Aktueller Kurs:</span>
          <span className="font-mono text-xs">{status.currentCourseId || 'Keiner'}</span>
        </div>
        <div className="flex justify-between">
          <span>Aktiver Fortschritt:</span>
          <span className={status.hasActiveProgress ? 'text-green-600' : 'text-gray-600'}>
            {status.hasActiveProgress ? 'Ja' : 'Nein'}
          </span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// NAVIGATION RECOMMENDATIONS
// =============================================================================

function NavigationRecommendations({ status }: { status: UserStatusDisplay | null }) {
  if (!status) return null;

  const isNewUser = status.isFirstTime || !status.onboardingCompleted;

  const recommendations = [
    {
      condition: isNewUser,
      title: '🚀 Neuer User Flow',
      description: 'User sollte zum Onboarding weitergeleitet werden',
      route: '/onboarding',
      color: 'bg-blue-50 border-blue-200 text-blue-800',
    },
    {
      condition: !isNewUser && status.hasActiveProgress,
      title: '📚 Kurs fortsetzen',
      description: 'User hat aktiven Fortschritt und sollte zum Kurs',
      route: `/course/${status.currentCourseId || 'strategy-track'}`,
      color: 'bg-green-50 border-green-200 text-green-800',
    },
    {
      condition: !isNewUser && !status.hasActiveProgress,
      title: '🎯 Dashboard',
      description: 'User sollte zum Dashboard für Kursauswahl',
      route: '/dashboard',
      color: 'bg-purple-50 border-purple-200 text-purple-800',
    },
  ];

  const activeRecommendation = recommendations.find((r) => r.condition);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800">🧭 Navigation-Empfehlung</h3>
      {activeRecommendation && (
        <div className={`${activeRecommendation.color} border rounded-lg p-4`}>
          <h4 className="font-semibold mb-2">{activeRecommendation.title}</h4>
          <p className="text-sm mb-3">{activeRecommendation.description}</p>
          <div className="flex items-center justify-between">
            <code className="bg-white bg-opacity-50 px-2 py-1 rounded text-xs">
              {activeRecommendation.route}
            </code>
            <button
              onClick={() => (window.location.href = activeRecommendation.route)}
              className="bg-white bg-opacity-50 hover:bg-opacity-75 px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              Testen →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN TEST COMPONENT
// =============================================================================

function TestRoutingContent() {
  const { user, profile, isAuthenticated } = useAuth();
  const [userStatus, setUserStatus] = useState<UserStatusDisplay | null>(null);
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
        const response = await fetch('/api/user/welcome-status');
        if (!response.ok) throw new Error('API Error');

        const data = await response.json();

        setUserStatus({
          isFirstTime: data.isFirstTime,
          loginCount: data.loginCount,
          onboardingCompleted: profile?.onboarding_completed || false,
          currentCourseId: profile?.current_course_id || null,
          hasActiveProgress: data.currentCase !== null,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchUserStatus();
  }, [user, profile, isAuthenticated]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Lade User-Status...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen navaa-bg-primary p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navaa-text-primary mb-2">
            🧪 Routing Middleware Test
          </h1>
          <p className="text-navaa-text-secondary">Test der User-Status-basierten Navigation</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* User Status */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-navaa-text-primary">📊 User Status</h2>
            <UserStatusCard status={userStatus} />

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">⚠️ Fehler</h3>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Navigation Recommendations */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-navaa-text-primary">🎯 Navigation</h2>
            <NavigationRecommendations status={userStatus} />
          </div>
        </div>

        {/* Route Guard Testing */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-navaa-text-primary">
            🛡️ Route Guard Status
          </h2>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-600 mb-2">
              Diese Seite ist mit <code>DashboardGuard</code> geschützt.
            </p>
            <p className="text-sm text-green-600">
              ✅ Zugriff gewährt - Route Guard funktioniert korrekt!
            </p>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => (window.location.href = '/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => (window.location.href = '/onboarding')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
          >
            Onboarding
          </button>
          <button
            onClick={() => (window.location.href = '/test-course-card')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
          >
            Course Cards
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// EXPORTED COMPONENT WITH ROUTE GUARD
// =============================================================================

export default function TestRouting() {
  return (
    <UnifiedGuard config={UNIFIED_GUARDS.DASHBOARD}>
      <TestRoutingContent />
    </UnifiedGuard>
  );
}
