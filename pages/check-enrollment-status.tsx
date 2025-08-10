/**
 * ENROLLMENT STATUS CHECKER
 * Direkte Datenbank-Prüfung für User-Enrollment
 *
 * @version 1.0.0
 * @author navaa Development Team
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UnifiedHeader from '../components/layout/UnifiedHeader';
import Footer from '../components/layout/Footer';

interface EnrollmentData {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  is_active: boolean;
  status: string;
  progress_percentage: number;
  last_activity_at: string;
  course_name?: string;
  course_slug?: string;
}

export default function CheckEnrollmentStatus() {
  const { user, getAccessToken } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkEnrollments() {
      if (!user) return;

      try {
        const token = await getAccessToken();
        if (!token) {
          throw new Error('No access token available');
        }

        const response = await fetch('/api/debug/check-enrollments', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        setEnrollments(data.enrollments || []);
      } catch (err) {
        console.error('Error checking enrollments:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    checkEnrollments();
  }, [user, getAccessToken]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Bitte logge dich ein, um deine Einschreibungen zu prüfen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader variant="app" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">🔍 Enrollment Status Check</h1>

          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">User Information:</h2>
            <div className="bg-gray-50 p-4 rounded">
              <p>
                <strong>User ID:</strong> {user.id}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Prüfe Einschreibungen...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <h3 className="font-semibold text-red-800 mb-2">❌ Fehler:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                📚 Deine Einschreibungen ({enrollments.length}):
              </h2>

              {enrollments.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                  <p className="text-yellow-800">
                    ⚠️ Keine Einschreibungen gefunden. Du bist aktuell in keinem Kurs
                    eingeschrieben.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {enrollment.course_name || 'Unbekannter Kurs'}
                          </h3>
                          <p className="text-gray-600">Slug: {enrollment.course_slug || 'N/A'}</p>
                          <p className="text-gray-600">Course ID: {enrollment.course_id}</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                enrollment.is_active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {enrollment.is_active ? '✅ Aktiv' : '❌ Inaktiv'}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              {enrollment.status}
                            </span>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600">
                              <strong>Progress:</strong> {enrollment.progress_percentage}%
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Eingeschrieben:</strong>{' '}
                              {new Date(enrollment.enrolled_at).toLocaleString('de-DE')}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Letzte Aktivität:</strong>{' '}
                              {new Date(enrollment.last_activity_at).toLocaleString('de-DE')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
