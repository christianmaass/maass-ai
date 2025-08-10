/**
 * DEBUG PAGE: DIRECT ENROLLMENT QUERY
 * Direkte Datenbank-Abfrage für Enrollment-Debugging
 *
 * @version 1.0.0
 * @author navaa Development Team
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface EnrollmentData {
  id: string;
  user_id: string;
  course_id: string;
  status: string;
  progress_percentage: number;
  is_active: boolean;
  enrolled_at: string;
  last_activity_at: string | null;
}

const DebugEnrollmentDirect: React.FC = () => {
  const { user, profile, getAccessToken } = useAuth();
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollmentData = useCallback(async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Fetching enrollment data...');
      console.log('- User ID:', user.id);
      console.log('- Profile:', profile);

      const token = await getAccessToken();
      const response = await fetch('/api/debug/enrollment-direct', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch enrollment data');
      }

      console.log('✅ Enrollment data received:', data);
      setEnrollmentData(data.enrollments || []);
    } catch (err) {
      console.error('❌ Error fetching enrollment data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [user, profile, getAccessToken]);

  useEffect(() => {
    if (user) {
      fetchEnrollmentData();
    }
  }, [user, fetchEnrollmentData]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">🔒 Authentication Required</h1>
          <p className="text-gray-600">Please log in to view enrollment data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">🔍 Direct Enrollment Query Debug</h1>
            <p className="mt-2 text-gray-600">Direct database query for user enrollment data</p>
          </div>

          <div className="p-6">
            {/* User Info */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">👤 User Information</h2>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>User ID:</strong> {user.id}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Profile ID:</strong> {profile?.id || 'N/A'}
                </p>
              </div>
            </div>

            {/* Refresh Button */}
            <div className="mb-6">
              <button
                onClick={fetchEnrollmentData}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '🔄 Loading...' : '🔍 Refresh Enrollment Data'}
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Enrollment Data */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                📊 Enrollment Data ({enrollmentData.length} records)
              </h2>

              {enrollmentData.length === 0 ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">⚠️ No enrollment data found for this user</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrollmentData.map((enrollment, index) => (
                    <div key={enrollment.id} className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Enrollment #{index + 1}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p>
                            <strong>ID:</strong> {enrollment.id}
                          </p>
                          <p>
                            <strong>User ID:</strong> {enrollment.user_id}
                          </p>
                          <p>
                            <strong>Course ID:</strong> {enrollment.course_id}
                          </p>
                          <p>
                            <strong>Status:</strong>
                            <span
                              className={`ml-1 px-2 py-1 rounded text-xs ${
                                enrollment.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : enrollment.status === 'enrolled'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {enrollment.status}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p>
                            <strong>Progress:</strong> {enrollment.progress_percentage}%
                          </p>
                          <p>
                            <strong>Active:</strong> {enrollment.is_active ? '✅ Yes' : '❌ No'}
                          </p>
                          <p>
                            <strong>Enrolled:</strong>{' '}
                            {new Date(enrollment.enrolled_at).toLocaleString()}
                          </p>
                          <p>
                            <strong>Last Activity:</strong>{' '}
                            {enrollment.last_activity_at
                              ? new Date(enrollment.last_activity_at).toLocaleString()
                              : 'Never'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugEnrollmentDirect;
