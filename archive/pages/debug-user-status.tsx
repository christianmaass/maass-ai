/**
 * DEBUG USER STATUS
 * Debug-Seite um User-Status und Profile-Daten zu analysieren
 *
 * @version 1.0.0
 */

import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function DebugUserStatus() {
  const router = useRouter();
  const { user, profile, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen navaa-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Lade User-Daten...</p>
        </div>
      </div>
    );
  }

  const userStatus = {
    isFirstTime: !profile || (profile as any)?.login_count <= 1,
    onboardingCompleted: (profile as any)?.onboarding_completed || false,
  };

  const isNewUser = userStatus.isFirstTime || !userStatus.onboardingCompleted;

  return (
    <div className="min-h-screen navaa-bg-primary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-navaa-text-primary mb-8">🔍 User Status Debug</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Auth Status */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">🔐 Auth Status</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Authenticated:</span>
                <span className={isAuthenticated() ? 'text-green-600' : 'text-red-600'}>
                  {isAuthenticated() ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Loading:</span>
                <span>{loading ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span>User Object:</span>
                <span>{user ? 'Present' : 'Null'}</span>
              </div>
              <div className="flex justify-between">
                <span>Profile Object:</span>
                <span>{profile ? 'Present' : 'Null'}</span>
              </div>
            </div>
          </div>

          {/* User Object */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">👤 User Object</h2>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>

          {/* Profile Object */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">📋 Profile Object</h2>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </div>

          {/* User Status Calculation */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">🧮 Status Calculation</h2>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded">
                <h3 className="font-medium mb-2">Raw Values:</h3>
                <div className="text-sm space-y-1">
                  <div>profile: {profile ? 'exists' : 'null'}</div>
                  <div>login_count: {(profile as any)?.login_count || 'undefined'}</div>
                  <div>onboarding_completed: {String((profile as any)?.onboarding_completed)}</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded">
                <h3 className="font-medium mb-2">Calculated Status:</h3>
                <div className="text-sm space-y-1">
                  <div>
                    isFirstTime: <span className="font-mono">{String(userStatus.isFirstTime)}</span>
                  </div>
                  <div>
                    onboardingCompleted:{' '}
                    <span className="font-mono">{String(userStatus.onboardingCompleted)}</span>
                  </div>
                  <div className="font-semibold mt-2">
                    isNewUser:{' '}
                    <span
                      className={`font-mono ${isNewUser ? 'text-orange-600' : 'text-green-600'}`}
                    >
                      {String(isNewUser)}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`p-3 rounded ${isNewUser ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'}`}
              >
                <h3 className="font-medium mb-2">Routing Decision:</h3>
                <div className="text-sm">
                  {isNewUser ? (
                    <div className="text-orange-700">
                      🚀 User wird als <strong>neuer User</strong> erkannt
                      <br />→ Weiterleitung zu <code>/onboarding-new</code>
                    </div>
                  ) : (
                    <div className="text-green-700">
                      ✅ User wird als <strong>wiederkehrender User</strong> erkannt
                      <br />→ Bleibt auf <code>/dashboard</code>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <div className="space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push('/onboarding-new')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
            >
              Onboarding
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  if (process.env.NODE_ENV !== 'development') {
    return { notFound: true };
  }
  return { props: {} };
}
