/**
 * COURSE GRID COMPONENT
 * Kursübersicht für Dashboard und Onboarding
 *
 * FEATURES:
 * - Responsive Grid-Layout
 * - CourseCard-Integration
 * - Loading und Error States
 * - Unterscheidung neue/wiederkehrende User
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
 * ✅ Course Display - Grid layout with enrollment status
 * ✅ API Integration - Courses API with enrollment data
 * ✅ Loading States - Mock data fallback for stability
 * ✅ User Experience - Clear course selection and navigation
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */
import React, { useEffect, useState } from 'react';
import { Heading, Text } from '../ui/Typography';
import { useRouter } from 'next/router';
import CourseCard from './CourseCard';
import { Course, CourseWithEnrollment } from '../../types/courses';
import { useAuth } from '../../contexts/AuthContext';

// =============================================================================
// TYPES
// =============================================================================

interface CourseGridProps {
  variant?: 'onboarding' | 'dashboard';
  maxCourses?: number;
  showEnrollmentStatus?: boolean;
}

// =============================================================================
// LOADING COMPONENT
// =============================================================================

function CourseGridSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-3"></div>
          <div className="h-3 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="flex justify-between items-center">
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function CourseGrid({
  variant = 'dashboard',
  maxCourses,
  showEnrollmentStatus = true,
}: CourseGridProps) {
  const router = useRouter();
  const { session } = useAuth();
  const [courses, setCourses] = useState<CourseWithEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses with fallback to mock data (StrictMode-safe)
  useEffect(() => {
    let isMounted = true;
    const ac = new AbortController();

    async function fetchCourses() {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }

        const response = await fetch('/api/courses', {
          method: 'GET',
          headers,
          signal: ac.signal,
        });

        if (response.ok) {
          const data = await response.json();
          let coursesData = data.courses || data;

          if (!Array.isArray(coursesData)) {
            console.warn('API response is not an array, using mock data');
            throw new Error('Invalid API response format');
          }

          if (maxCourses) {
            coursesData = coursesData.slice(0, maxCourses);
          }

          if (isMounted) setCourses(coursesData);
        } else {
          console.warn('API failed, using mock data');
          const mockCourses = [
            {
              id: 'strategy-track',
              slug: 'strategy-track',
              name: 'Strategy Track',
              description: 'Lerne strategisches Denken durch praxisnahe Business Cases',
              difficulty_level: 6,
              estimated_duration_hours: 12,
              foundation_cases_count: 12,
              user_enrolled: false,
              prerequisites: [],
              is_active: true,
              sort_order: 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              foundation_cases: Array.from({ length: 12 }, (_, i) => ({
                case_id: `case-${i + 1}`,
                title: `Foundation Case ${i + 1}`,
                difficulty: i + 1,
                sequence_order: i + 1,
              })),
            },
          ];

          let coursesData = mockCourses;
          if (maxCourses) {
            coursesData = mockCourses.slice(0, maxCourses);
          }

          if (isMounted) setCourses(coursesData);
        }
      } catch (err: any) {
        if (ac.signal.aborted) return; // component unmounted or route change
        console.error('Error fetching courses:', err);
        const mockCourses = [
          {
            id: 'strategy-track',
            slug: 'strategy-track',
            name: 'Strategy Track',
            description: 'Lerne strategisches Denken durch praxisnahe Business Cases',
            difficulty_level: 6,
            estimated_duration_hours: 12,
            foundation_cases_count: 12,
            user_enrolled: false,
            prerequisites: [],
            is_active: true,
            sort_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            foundation_cases: [],
          },
        ];
        if (isMounted) setCourses(mockCourses);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchCourses();

    return () => {
      isMounted = false;
      ac.abort();
    };
  }, [maxCourses, session?.access_token]);

  // Handle course selection
  const handleCourseClick = (course: CourseWithEnrollment) => {
    router.push(`/app/course/${course.slug}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Heading variant="h1" className="mb-2 text-navaa-text-primary">
            {variant === 'onboarding' ? 'Wähle deinen ersten Kurs' : 'Verfügbare Kurse'}
          </Heading>
          <Text variant="small" className="text-navaa-text-secondary">
            Lade Kurse...
          </Text>
        </div>
        <CourseGridSkeleton />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-6xl mb-4">⚠️</div>
        <Heading variant="h1" className="mb-2 text-navaa-text-primary">
          Fehler beim Laden
        </Heading>
        <Text variant="small" className="text-navaa-text-secondary mb-6">
          {error}
        </Text>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  // Empty state
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📚</div>
        <Heading variant="h1" className="mb-2 text-navaa-text-primary">
          Keine Kurse verfügbar
        </Heading>
        <Text variant="small" className="text-navaa-text-secondary">
          Derzeit sind keine Kurse verfügbar. Schau später wieder vorbei!
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <Heading variant="h1" className="mb-2 text-navaa-text-primary">
          {variant === 'onboarding' ? 'Wähle deinen ersten Kurs' : 'Verfügbare Kurse'}
        </Heading>
        <Text variant="body" as="p" className="text-navaa-text-secondary leading-relaxed">
          {variant === 'onboarding'
            ? 'Starte deine Lernreise mit einem unserer Kurse'
            : `${courses.length} ${courses.length === 1 ? 'Kurs' : 'Kurse'} verfügbar`}
        </Text>
      </div>

      {/* Course Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onClick={() => handleCourseClick(course)}
            showEnrollmentStatus={showEnrollmentStatus}
          />
        ))}
      </div>

      {/* Call to Action for Onboarding */}
      {variant === 'onboarding' && (
        <div className="text-center mt-8">
          <p className="text-sm text-navaa-text-secondary mb-4">
            Du kannst jederzeit weitere Kurse hinzufügen
          </p>
          <button
            onClick={() => router.push('/app')}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Alle Kurse ansehen →
          </button>
        </div>
      )}
    </div>
  );
}
