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
 * ✅ Debugging - Comprehensive user status analysis
 * ✅ Testing - UnifiedGuard behavior validation
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

export default function DebugUserGuardStatus() {
  const { user, profile, isAuthenticated, authLoading } = useAuth();
  const router = useRouter();
  const [enrollmentData, setEnrollmentData] = useState<any>(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState(true);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);

  // Fetch enrollment data
  useEffect(() => {
    async function fetchEnrollments() {
      if (!user || authLoading) return;

      try {
        const response = await fetch('/api/courses', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('supabase.auth.token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setEnrollmentData(data);
        } else {
          setEnrollmentError(`API Error: ${response.status}`);
        }
      } catch (error) {
        setEnrollmentError(`Network Error: ${error}`);
      } finally {
        setEnrollmentLoading(false);
      }
    }

    fetchEnrollments();
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-navaa-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navaa-primary mx-auto mb-4"></div>
          <p className="text-navaa-text-secondary">Loading auth status...</p>
        </div>
      </div>
    );
  }

  const hasActiveEnrollments =
    enrollmentData?.courses?.some((course: any) => course.user_enrolled) || false;
  const shouldRedirectToOnboarding =
    !(profile as any)?.onboarding_completed && !hasActiveEnrollments;

  return (
    <div className="min-h-screen bg-navaa-bg-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navaa-text-primary mb-2">
              🔍 User & Guard Status Debug
            </h1>
            <p className="text-navaa-text-secondary">
              Detaillierte Analyse des User-Status und UnifiedGuard-Verhaltens
            </p>
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
              ℹ️ Diese Seite ist ungeschützt und zeigt den aktuellen User-Status für Debugging.
            </div>
          </div>

          {/* Authentication Status */}
          <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🔐 Authentication Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="mb-2">
                  <span className="font-medium">Authenticated:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-sm ${isAuthenticated() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {isAuthenticated() ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-medium">User Object:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-sm ${user ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {user ? '✅ Present' : '❌ Missing'}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-medium">Profile Object:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-sm ${profile ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {profile ? '✅ Present' : '❌ Missing'}
                  </span>
                </div>
              </div>
              <div>
                {user && (
                  <div className="text-sm text-gray-600">
                    <div>
                      <strong>User ID:</strong> {user.id}
                    </div>
                    <div>
                      <strong>Email:</strong> {user.email}
                    </div>
                    <div>
                      <strong>Created:</strong>{' '}
                      {user.created_at
                        ? new Date(user.created_at as string).toLocaleDateString()
                        : 'N/A'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Status */}
          <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">👤 Profile Status</h2>
            {profile ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-2">
                    <span className="font-medium">Onboarding Completed:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-sm ${(profile as any)?.onboarding_completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      {(profile as any)?.onboarding_completed ? '✅ Yes' : '⏳ No'}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Login Count:</span>
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {(profile as any)?.login_count || 0}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Subscription Tier:</span>
                    <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                      {(profile as any)?.subscription_tier || 'free'}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <div>
                    <strong>First Name:</strong> {(profile as any)?.firstName || 'N/A'}
                  </div>
                  <div>
                    <strong>Last Name:</strong> {(profile as any)?.lastName || 'N/A'}
                  </div>
                  <div>
                    <strong>Created:</strong>{' '}
                    {(profile as any)?.created_at
                      ? new Date((profile as any).created_at).toLocaleDateString()
                      : 'N/A'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">No profile data available</div>
            )}
          </div>

          {/* Enrollment Status */}
          <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📚 Enrollment Status</h2>
            {enrollmentLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navaa-primary mx-auto mb-2"></div>
                <p className="text-gray-500">Loading enrollments...</p>
              </div>
            ) : enrollmentError ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800">
                <strong>Error:</strong> {enrollmentError}
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <span className="font-medium">Has Active Enrollments:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-sm ${hasActiveEnrollments ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    {hasActiveEnrollments ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                {enrollmentData?.courses && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">
                      Courses ({enrollmentData.courses.length}):
                    </h3>
                    <div className="space-y-2">
                      {enrollmentData.courses.map((course: any, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 rounded border">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{course.title}</div>
                              <div className="text-sm text-gray-600">{course.slug}</div>
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-sm ${course.user_enrolled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                            >
                              {course.user_enrolled ? 'Enrolled' : 'Not Enrolled'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Routing Decision */}
          <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              🛡️ UnifiedGuard Routing Decision
            </h2>
            <div className="space-y-4">
              <div>
                <span className="font-medium">Should Redirect to Onboarding:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded text-sm ${shouldRedirectToOnboarding ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
                >
                  {shouldRedirectToOnboarding ? '🔄 Yes' : '✅ No'}
                </span>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <h3 className="font-medium text-blue-800 mb-2">Routing Logic:</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>
                    • Onboarding Completed: {(profile as any)?.onboarding_completed ? '✅' : '❌'}
                  </div>
                  <div>• Has Active Enrollments: {hasActiveEnrollments ? '✅' : '❌'}</div>
                  <div>
                    • <strong>Result:</strong>{' '}
                    {shouldRedirectToOnboarding
                      ? 'Redirect to /onboarding-new'
                      : 'Allow access to requested page'}
                  </div>
                </div>
              </div>

              {shouldRedirectToOnboarding && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <h3 className="font-medium text-yellow-800 mb-2">Why Redirect to Onboarding?</h3>
                  <div className="text-sm text-yellow-700">
                    Der User wird zu /onboarding-new weitergeleitet, weil:
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Onboarding ist nicht abgeschlossen UND</li>
                      <li>Keine aktiven Course-Enrollments vorhanden</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="text-center space-x-4">
            <button
              onClick={() => router.push('/test-unified-guard')}
              className="px-4 py-2 bg-navaa-primary text-white rounded hover:bg-navaa-primary-dark transition-colors"
            >
              🧪 Test UnifiedGuard
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              🏠 Homepage
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              🔄 Refresh
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
