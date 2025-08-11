/**
 * COURSE PAGE
 * Dedizierte Kursseite für Multi-Course Architecture
 *
 * FEATURES:
 * - Kursbeschreibung und Aufbau
 * - Foundation Cases-Übersicht
 * - Start/Fortsetzen-CTA
 * - Progress-Tracking
 * - Navigation zurück zu Dashboard/Onboarding
 *
 * @version 1.0.0
 * @author navaa Development Team
 */

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
 * ✅ Dynamic Routing - Proper slug handling and validation
 * ✅ Course Enrollment - Integration with enrollment API
 * ✅ Progress Tracking - User progress and completion status
 * ✅ Loading States - Robust loading and error handling
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import {
  ArrowLeftIcon,
  PlayIcon,
  BookOpenIcon,
  ClockIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

// =============================================================================
// TYPES
// =============================================================================

interface FoundationCase {
  case_id: string;
  title: string;
  difficulty: number;
  sequence_order: number;
  description?: string;
}

interface CourseData {
  id: string;
  name: string;
  slug: string;
  description: string;
  difficulty_level: number;
  estimated_duration_hours: number;
  foundation_cases: FoundationCase[];
  foundation_cases_count: number;
  user_enrolled: boolean;
  user_progress?: {
    completed_cases: number;
    total_cases: number;
    progress_percentage: number;
    current_case_id?: string;
  };
}

// =============================================================================
// DIFFICULTY HELPERS
// =============================================================================

function getDifficultyColor(difficulty: number): string {
  if (difficulty <= 3) return 'text-green-600 bg-green-50 border-green-200';
  if (difficulty <= 7) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  return 'text-red-600 bg-red-50 border-red-200';
}

function getDifficultyLabel(difficulty: number): string {
  if (difficulty <= 3) return 'Einsteiger';
  if (difficulty <= 7) return 'Fortgeschritten';
  return 'Experte';
}

// =============================================================================
// FOUNDATION CASE COMPONENT
// =============================================================================

function FoundationCaseCard({
  foundationCase,
  isCompleted,
  isCurrent,
}: {
  foundationCase: FoundationCase;
  isCompleted: boolean;
  isCurrent: boolean;
}) {
  const difficultyColor = getDifficultyColor(foundationCase.difficulty);

  return (
    <div
      className={`
      border rounded-lg p-4 transition-all duration-200
      ${isCurrent ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'}
      ${isCompleted ? 'border-green-300 bg-green-50' : ''}
      hover:shadow-md
    `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {isCompleted ? (
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            ) : (
              <div
                className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold
                ${isCurrent ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-500'}
              `}
              >
                {foundationCase.sequence_order}
              </div>
            )}
          </div>
          <div>
            <h3 className={`font-semibold ${isCurrent ? 'text-blue-900' : 'text-gray-900'}`}>
              {foundationCase.title}
            </h3>
            {foundationCase.description && (
              <p className="text-sm text-gray-600 mt-1">{foundationCase.description}</p>
            )}
          </div>
        </div>

        {/* Difficulty chip removed intentionally */}
      </div>

      {isCurrent && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="text-sm text-blue-700 font-medium">📍 Aktueller Case</p>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN COURSE PAGE COMPONENT
// =============================================================================

function CoursePageContent() {
  const router = useRouter();
  const { slug } = router.query;
  const { user, getAccessToken } = useAuth();

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  const CACHE_KEY = 'coursesCache_v1';

  // Lightweight perf helpers
  const perf = typeof window !== 'undefined' ? window.performance : null;
  const mark = useCallback(
    (name: string) => {
      try {
        perf?.mark(name);
      } catch {
        /* noop */
      }
    },
    [perf],
  );
  const measure = useCallback(
    (name: string, start: string, end?: string) => {
      try {
        if (!perf) return;
        if (end) perf.mark(end);
        perf.measure(name, start, end);
        const entries = perf.getEntriesByName(name);
        const last = entries[entries.length - 1];
        if (last) console.log(`⏱️ ${name}: ${Math.round(last.duration)} ms`);
      } catch {
        /* noop */
      }
    },
    [perf],
  );

  const readCache = useCallback((): any | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const writeCache = useCallback((payload: any) => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), ...payload }));
    } catch {
      // ignore
    }
  }, []);

  // Fetch course data with sessionStorage SWR-like cache
  useEffect(() => {
    let canceled = false;
    if (!slug) return;

    const cache = readCache();
    if (cache?.courses) {
      const cachedCourse = cache.courses.find((c: any) => c.slug === slug);
      if (cachedCourse) {
        setCourseData(cachedCourse);
        setLoading(false); // render instantly from cache
        mark('course_cached_paint');
        measure('course.cached.first_paint', 'course_cached_paint');
      }
    }

    const fetchAndUpdate = async () => {
      try {
        mark('course_access_fetch_start');
        const token = await getAccessToken();
        if (!token) throw new Error('No access token available');

        // 1) Fast access check for this course only
        const accessRes = await fetch(`/api/courses/${slug}/access`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!accessRes.ok) {
          const errorText = await accessRes.text();
          throw new Error(
            `Access API Error ${accessRes.status}: ${accessRes.statusText} - ${errorText}`,
          );
        }

        const accessPayload = await accessRes.json();
        measure('course.access.ttfb', 'course_access_fetch_start', 'course_access_fetch_end');
        const accessCourse = accessPayload?.course;

        if (!canceled) {
          if (!accessCourse) {
            setError('Kurs nicht gefunden');
            setLoading(false);
          } else {
            // Upsert into session cache (courses array) for consistency with dashboard
            const existing = readCache();
            const prevCourses: any[] = existing?.courses || [];
            const idx = prevCourses.findIndex((c: any) => c.slug === accessCourse.slug);
            const nextCourses = [...prevCourses];
            if (idx >= 0) nextCourses[idx] = accessCourse;
            else nextCourses.push(accessCourse);
            writeCache({ courses: nextCourses });

            setCourseData(accessCourse);
            setError(null);
            setLoading(false);
            mark('course_access_paint');
            measure(
              'course.access.first_paint',
              'course_access_fetch_start',
              'course_access_paint',
            );
          }
        }
      } catch (err) {
        if (!canceled) {
          console.error('Error fetching course:', err);
          setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
          setLoading(false);
        }
      }
    };

    // Always refresh in background; if no cache, this will control first paint
    fetchAndUpdate();

    return () => {
      canceled = true;
    };
  }, [slug, getAccessToken, readCache, writeCache, mark, measure]);

  // Handle course enrollment
  const handleEnrollment = async () => {
    if (!courseData || enrolling) return;

    setEnrolling(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('No access token available');
      }

      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_id: courseData.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Enrollment API Error Details:');
        console.error('Status:', response.status);
        console.error('StatusText:', response.statusText);
        console.error('Response:', result);
        console.error('Course ID:', courseData.id);

        // Handle "already enrolled" case gracefully
        if (result.message && result.message.includes('already enrolled')) {
          console.log('ℹ️ User already enrolled - updating frontend state');
          // Update frontend to reflect enrollment status
          setCourseData({
            ...courseData,
            user_enrolled: true,
            user_progress: {
              completed_cases: 0,
              total_cases: 12, // Strategy Track has 12 foundation cases
              progress_percentage: 0,
            },
          });
          setEnrolling(false);
          return; // Don't throw error, just update state
        }

        throw new Error(result.message || 'Enrollment failed');
      }

      // Update course data with successful enrollment
      setCourseData({
        ...courseData,
        user_enrolled: true,
        user_progress: {
          completed_cases: result.enrollment.progress.completed_cases,
          total_cases: result.enrollment.progress.total_cases,
          progress_percentage: result.enrollment.progress.progress_percentage,
        },
      });

      console.log('✅ Successfully enrolled:', result.message);
    } catch (err) {
      console.error('❌ Enrollment error:', err);
      setError(err instanceof Error ? err.message : 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  // Handle start/continue course
  const handleStartCourse = () => {
    if (!courseData) return;

    if (courseData.user_progress?.current_case_id) {
      // Continue current case
      router.push(`/foundation/case/${courseData.user_progress.current_case_id}`);
    } else {
      // Start first case
      const firstCase = courseData.foundation_cases.sort(
        (a, b) => a.sequence_order - b.sequence_order,
      )[0];

      if (firstCase) {
        router.push(`/foundation/case/${firstCase.case_id}`);
      } else {
        router.push('/foundation-cases');
      }
    }
  };

  // Error state
  if (error || !courseData) {
    if (error) {
      return (
        <div className="min-h-screen navaa-bg-primary flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-navaa-text-primary mb-2">Kurs nicht gefunden</h1>
            <p className="text-navaa-text-secondary mb-6">{error}</p>
            <button
              onClick={() => router.push('/app')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Zurück zum Dashboard
            </button>
          </div>
        </div>
      );
    }
    // Optimistic skeleton when no data yet but no error
    return (
      <div className="min-h-screen navaa-bg-primary">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-blue-700 hover:text-blue-800 mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Zurück
          </button>
          <div className="animate-pulse">
            <div className="h-8 w-2/3 bg-gray-200 rounded mb-3" />
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-4 bg-white">
                  <div className="h-5 w-3/4 bg-gray-200 rounded mb-3" />
                  <div className="h-4 w-full bg-gray-100 rounded mb-2" />
                  <div className="h-4 w-5/6 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen navaa-bg-primary">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Zurück
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-navaa-text-primary mb-2">{courseData.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {courseData.estimated_duration_hours}h
                </div>
                <div className="flex items-center">
                  <BookOpenIcon className="h-4 w-4 mr-1" />
                  {courseData.foundation_cases_count} Cases
                </div>
              </div>
            </div>

            <div className="text-right">
              {courseData.user_enrolled ? (
                <div className="space-y-2">
                  <div className="text-sm text-green-600 font-medium">✅ Eingeschrieben</div>
                  {courseData.user_progress && (
                    <div className="text-sm text-gray-600">
                      {courseData.user_progress.completed_cases} /{' '}
                      {courseData.user_progress.total_cases} Cases
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-600">Noch nicht eingeschrieben</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Kursbeschreibung</h2>
              <p className="text-gray-700 leading-relaxed">{courseData.description}</p>
            </div>

            {/* Foundation Cases */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">
                Foundation Cases ({courseData.foundation_cases_count})
              </h2>
              <div className="space-y-3">
                {courseData.foundation_cases
                  .sort((a, b) => a.sequence_order - b.sequence_order)
                  .map((foundationCase) => (
                    <FoundationCaseCard
                      key={foundationCase.case_id}
                      foundationCase={foundationCase}
                      isCompleted={false} // TODO: Get from user progress
                      isCurrent={
                        courseData.user_progress?.current_case_id === foundationCase.case_id
                      }
                    />
                  ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            {courseData.user_enrolled && courseData.user_progress && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="font-semibold mb-4">Dein Fortschritt</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Abgeschlossen</span>
                    <span>
                      {courseData.user_progress.completed_cases} /{' '}
                      {courseData.user_progress.total_cases}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${courseData.user_progress.progress_percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {courseData.user_progress.progress_percentage}% abgeschlossen
                  </div>
                </div>
              </div>
            )}

            {/* Action Card */}
            <div className="bg-white rounded-lg border p-6">
              {!courseData.user_enrolled ? (
                <div className="space-y-4">
                  <h3 className="font-semibold">Kurs starten</h3>
                  <p className="text-sm text-gray-600">
                    Schreibe dich ein, um mit den Foundation Cases zu beginnen.
                  </p>
                  <button
                    onClick={handleEnrollment}
                    disabled={enrolling}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {enrolling ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Einschreibung...
                      </>
                    ) : (
                      <>
                        <PlayIcon className="h-4 w-4 mr-2" />
                        Jetzt einschreiben
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-semibold">
                    {courseData.user_progress?.current_case_id ? 'Fortsetzen' : 'Starten'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {courseData.user_progress?.current_case_id
                      ? 'Setze deinen aktuellen Case fort.'
                      : 'Beginne mit dem ersten Foundation Case.'}
                  </p>
                  <button
                    onClick={handleStartCourse}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <PlayIcon className="h-4 w-4 mr-2" />
                    {courseData.user_progress?.current_case_id ? 'Fortsetzen' : 'Starten'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// EXPORTED COMPONENT WITH ROUTE GUARD
// =============================================================================

export default function CoursePage() {
  return <CoursePageContent />;
}

// Legacy route: permanently redirect to new app route with correct three-card layout
export async function getServerSideProps(context: { params?: { slug?: string } }) {
  const slug = context.params?.slug || '';
  return {
    redirect: {
      destination: `/app/course/${slug}`,
      permanent: true,
    },
  };
}
