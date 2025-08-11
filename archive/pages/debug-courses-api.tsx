/**
 * DEBUG: COURSES API DIRECT TEST
 * Direkte Abfrage der Courses API um Enrollment-Status zu prüfen
 *
 * @version 1.0.0
 * @author navaa Development Team
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '@layout/basic/Header';
import Footer from '@layout/basic/Footer';

export default function DebugCoursesAPI() {
  const { user, getAccessToken } = useAuth();
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testCoursesAPI() {
      if (!user) return;

      try {
        const token = await getAccessToken();
        if (!token) {
          throw new Error('No access token available');
        }
        console.log('🔍 Testing Courses API...');

        const response = await fetch('/api/courses', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Courses API Response:', data);

        setApiResponse(data);
      } catch (err) {
        console.error('❌ Courses API Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    testCoursesAPI();
  }, [user, getAccessToken]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Bitte logge dich ein.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="app" />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">🔍 Courses API Debug</h1>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Testing Courses API...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <h3 className="font-semibold text-red-800 mb-2">❌ API Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">📊 API Response Summary:</h2>
                <div className="bg-gray-50 p-4 rounded">
                  <p>
                    <strong>Total Courses:</strong> {apiResponse?.total_count || 0}
                  </p>
                  <p>
                    <strong>Courses Found:</strong> {apiResponse?.courses?.length || 0}
                  </p>
                </div>
              </div>

              {apiResponse?.courses?.map((course: any, index: number) => (
                <div key={course.id} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">
                    📚 {course.name} ({course.slug})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">🎯 Enrollment Status:</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>User Enrolled:</strong>
                          <span
                            className={`ml-2 px-2 py-1 rounded text-xs ${
                              course.user_enrolled
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {course.user_enrolled ? '✅ YES' : '❌ NO'}
                          </span>
                        </p>
                        <p>
                          <strong>Foundation Cases:</strong> {course.foundation_cases_count || 0}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">📈 Progress Data:</h4>
                      <div className="space-y-1 text-sm">
                        {course.user_progress ? (
                          <>
                            <p>
                              <strong>Progress:</strong> {course.user_progress.progress_percentage}%
                            </p>
                            <p>
                              <strong>Completed Cases:</strong>{' '}
                              {course.user_progress.completed_cases}
                            </p>
                            <p>
                              <strong>Total Cases:</strong> {course.user_progress.total_cases}
                            </p>
                            <p>
                              <strong>Last Activity:</strong>{' '}
                              {course.user_progress.last_activity_at
                                ? new Date(course.user_progress.last_activity_at).toLocaleString(
                                    'de-DE',
                                  )
                                : 'N/A'}
                            </p>
                          </>
                        ) : (
                          <p className="text-gray-500">No progress data</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">🔍 Foundation Cases:</h4>
                    <div className="text-sm">
                      {course.foundation_cases?.length > 0 ? (
                        <ul className="space-y-1">
                          {course.foundation_cases.slice(0, 3).map((fc: any) => (
                            <li key={fc.case_id}>
                              • {fc.title} (Difficulty: {fc.difficulty})
                            </li>
                          ))}
                          {course.foundation_cases.length > 3 && (
                            <li className="text-gray-500">
                              ... and {course.foundation_cases.length - 3} more
                            </li>
                          )}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No foundation cases found</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">🔧 Raw API Response:</h2>
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export async function getServerSideProps() {
  if (process.env.NODE_ENV !== 'development') {
    return { notFound: true };
  }
  return { props: {} };
}
