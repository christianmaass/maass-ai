/**
 * PROFILE REFRESH PAGE
 * Erzwingt Neuladen der User-Profile-Daten nach Migration
 *
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function RefreshProfile() {
  const { refreshProfile, profile, loading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshed, setRefreshed] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshProfile();
      setRefreshed(true);
      // Kurz warten, dann zur Debug-Seite weiterleiten
      setTimeout(() => {
        window.location.href = '/debug-user-status';
      }, 2000);
    } catch (error) {
      console.error('Profile refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen navaa-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Lade Auth-Daten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen navaa-bg-primary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-navaa-text-primary mb-8">🔄 Profile Refresh</h1>

        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Nach Migration: Profile Refresh</h2>
          <p className="text-gray-700 mb-6">
            Nach der Datenbank-Migration müssen die Profile-Daten im Frontend neu geladen werden, um
            die neuen User-Tracking-Felder zu erhalten.
          </p>

          {!refreshed ? (
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              {refreshing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Profile wird aktualisiert...
                </div>
              ) : (
                'Profile Refresh ausführen'
              )}
            </button>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-green-800 font-semibold mb-2">
                ✅ Profile erfolgreich aktualisiert!
              </h3>
              <p className="text-green-700 mb-4">
                Die Profile-Daten wurden neu geladen. Du wirst automatisch zur Debug-Seite
                weitergeleitet...
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => (window.location.href = '/debug-user-status')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Debug-Seite öffnen
                </button>
                <button
                  onClick={() => (window.location.href = '/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Dashboard testen
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Current Profile Data */}
        <div className="bg-gray-50 rounded-lg border p-6">
          <h3 className="font-semibold mb-4">📋 Aktuelle Profile-Daten</h3>
          <pre className="text-sm bg-white p-4 rounded border overflow-auto">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center space-x-4">
          <button
            onClick={() => (window.location.href = '/debug-user-status')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
          >
            Debug User Status
          </button>
          <button
            onClick={() => (window.location.href = '/test-schema-check')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
          >
            Schema Check
          </button>
        </div>
      </div>
    </div>
  );
}
