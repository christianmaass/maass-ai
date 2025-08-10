/**
 * CHECK MY USER
 * Prüft ob der aktuell eingeloggte User die Migration erhalten hat
 *
 * @version 1.0.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface DbUserData {
  hasTrackingFields: boolean;
  userExists: boolean;
  userData?: any;
  missingFields?: string[];
}

export default function CheckMyUser() {
  const { user, profile, loading } = useAuth();
  const [dbUserData, setDbUserData] = useState<DbUserData | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);

  const checkUserInDB = useCallback(async () => {
    if (!user?.id) return;

    setChecking(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/check-user-migration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Check failed');
      }

      setDbUserData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setChecking(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id && !checking && !dbUserData) {
      checkUserInDB();
    }
  }, [user?.id, checking, dbUserData, checkUserInDB]);

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

  return (
    <div className="min-h-screen navaa-bg-primary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-navaa-text-primary mb-8">
          🔍 Check My User Migration
        </h1>

        {/* Current User Info */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">👤 Aktueller User</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Auth User:</h3>
              <div className="text-sm space-y-1">
                <div>
                  <strong>ID:</strong> {user?.id || 'Nicht verfügbar'}
                </div>
                <div>
                  <strong>Email:</strong> {user?.email || 'Nicht verfügbar'}
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Profile:</h3>
              <div className="text-sm space-y-1">
                <div>
                  <strong>Login Count:</strong> {(profile as any)?.login_count || 'undefined'}
                </div>
                <div>
                  <strong>Onboarding:</strong> {String((profile as any)?.onboarding_completed)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Database Check */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🗄️ Datenbank-Check</h2>

          {checking && (
            <div className="flex items-center text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Prüfe User in Datenbank...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <h3 className="text-red-800 font-semibold mb-2">❌ Fehler</h3>
              <p className="text-red-700">{error}</p>
              <button
                onClick={checkUserInDB}
                className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              >
                Erneut prüfen
              </button>
            </div>
          )}

          {dbUserData && (
            <div
              className={`rounded p-4 ${
                dbUserData.hasTrackingFields
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <h3
                className={`font-semibold mb-3 ${
                  dbUserData.hasTrackingFields ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {dbUserData.hasTrackingFields ? '✅ Migration erfolgreich' : '❌ Migration fehlt'}
              </h3>

              <div className="space-y-3">
                <div>
                  <strong>User existiert in DB:</strong> {dbUserData.userExists ? 'Ja' : 'Nein'}
                </div>
                <div>
                  <strong>Tracking-Felder vorhanden:</strong>{' '}
                  {dbUserData.hasTrackingFields ? 'Ja' : 'Nein'}
                </div>

                {dbUserData.userData && (
                  <div>
                    <strong>DB-Daten:</strong>
                    <pre className="text-xs bg-gray-100 p-3 rounded mt-2 overflow-auto">
                      {JSON.stringify(dbUserData.userData, null, 2)}
                    </pre>
                  </div>
                )}

                {dbUserData.missingFields && dbUserData.missingFields.length > 0 && (
                  <div>
                    <strong className="text-red-600">Fehlende Felder:</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {dbUserData.missingFields.map((field) => (
                        <span
                          key={field}
                          className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="text-center space-x-4">
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
          {dbUserData && !dbUserData.hasTrackingFields && (
            <button
              onClick={() => (window.location.href = '/fix-my-user')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              Meinen User reparieren
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
