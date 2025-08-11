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
 * ✅ Reusable Template - Works for all course types
 * ✅ Central Data - Uses centralized course data from data/courses.ts
 * ✅ Responsive Design - Mobile-first approach with Tailwind CSS
 * ✅ User Experience - Clear course information and enrollment flow
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */

/**
 * COURSE TEMPLATE COMPONENT
 *
 * Reusable template for all course pages. Displays course information,
 * features, learning objectives, and enrollment options.
 *
 * FEATURES:
 * - Uses centralized course data from data/courses.ts
 * - Responsive hero section with course image
 * - Feature highlights and learning objectives
 * - Enrollment status and progress tracking
 * - Foundation Cases preview
 * - Prerequisites and course metadata
 *
 * USAGE:
 * <CourseTemplate courseSlug="strategy-track" />
 *
 * @version 1.0.0 (Reusable Course Template)
 * @author navaa Development Team
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Heading, Text } from '../ui/Typography';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getCourseBySlug, CourseMetadata } from '../../data/courses';
import { getModulesByCourse, getMockUserProgress } from '../../data/modules';
import { useAuth } from '../../contexts/AuthContext';
import { getSupabaseClient } from '../../supabaseClient';
import Header from '@layout/basic/Header';
import Footer from '@layout/basic/Footer';
import OnboardingHeader from '../tracks/strategy/onboarding/OnboardingHeader';
import OnboardingLayout from '../tracks/strategy/onboarding/OnboardingLayout';
import ContextPanel from '../tracks/strategy/onboarding/ContextPanel';
import ModuleGrid from './ModuleGrid';
import OnboardingContainer from '../tracks/strategy/onboarding/OnboardingContainer';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface CourseTemplateProps {
  courseSlug: string;
}

interface EnrollmentStatus {
  isEnrolled: boolean;
  progress?: {
    completedCases: number;
    totalCases: number;
    progressPercentage: number;
  };
}

// =============================================================================
// HERO SECTION COMPONENT
// =============================================================================

interface CourseHeroProps {
  course: CourseMetadata;
  enrollmentStatus: EnrollmentStatus;
  onEnroll: () => void;
  onStartCourse: () => void;
  userProgress?: {
    onboardingCompleted: boolean;
    foundationCasesCompleted: number;
    foundationCasesTotal: number;
    expertCasesUnlocked: boolean;
  };
  onStartOnboarding?: () => void;
  onStartExpert?: () => void;
}

function CourseHero({
  course,
  enrollmentStatus,
  onEnroll,
  onStartCourse,
  userProgress,
  onStartOnboarding,
  onStartExpert,
}: CourseHeroProps) {
  return (
    <div className="bg-navaa-warm-beige">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-0">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Course Info (70%) */}
          <div className="lg:col-span-7">
            {/* Status/Difficulty badges removed intentionally */}

            <Heading variant="display" className="mb-4">
              {course.title}
            </Heading>

            <Text variant="body" className="text-gray-600 mb-6">
              {course.longDescription || course.description}
            </Text>

            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-8">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {course.foundationCasesCount} Cases
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ~{course.estimatedHours} Stunden
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                </svg>
                {course.targetGroup}
              </div>
            </div>

            {/* Enrollment Actions */}
            <div className="flex items-center space-x-4">
              {enrollmentStatus.isEnrolled ? (
                <div className="flex items-center space-x-4">
                  {(() => {
                    const onboardingDone = userProgress?.onboardingCompleted;
                    const foundationDone =
                      (userProgress?.foundationCasesCompleted ?? 0) >=
                      (userProgress?.foundationCasesTotal ?? Infinity);
                    if (!onboardingDone) {
                      return (
                        <button
                          onClick={onStartOnboarding}
                          className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Onboarding starten
                        </button>
                      );
                    }
                    if (!foundationDone) {
                      return (
                        <button
                          onClick={onStartCourse}
                          className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Foundation Cases bearbeiten
                        </button>
                      );
                    }
                    return (
                      <button
                        onClick={onStartExpert}
                        className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Expert Cases bearbeiten
                      </button>
                    );
                  })()}
                  {enrollmentStatus.progress && (
                    <div className="text-sm text-gray-600">
                      Fortschritt: {enrollmentStatus.progress.completedCases}/
                      {enrollmentStatus.progress.totalCases} Cases (
                      {enrollmentStatus.progress.progressPercentage}%)
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onEnroll}
                  disabled={course.status !== 'live'}
                  className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {course.status === 'live' ? 'Jetzt einschreiben' : 'Bald verfügbar'}
                </button>
              )}
            </div>
          </div>

          {course.slug !== 'strategy-track' && (
            <div className="hidden lg:block lg:col-span-5">
              {course.image && (
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-sm">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-contain bg-white"
                    sizes="(min-width: 1024px) 560px, 100vw"
                    priority
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// FEATURES SECTION COMPONENT
// =============================================================================

interface FeaturesSectionProps {
  course: CourseMetadata;
}

function FeaturesSection({ course }: FeaturesSectionProps) {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <Heading variant="h1" className="mb-6 text-gray-900">
            Was du lernen wirst
          </Heading>
          <Text variant="body" as="p" className="text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Strategisch denken, wenn es darauf ankommt – und handeln, bevor es zu spät ist: Lerne
            komplexe Probleme in klare Handlungsoptionen zu übersetzen, Entscheidungen zu treffen,
            die langfristig wirken und strategische Initiativen ins Ziel zu bringen, statt in
            Präsentationen zu versanden
          </Text>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Features */}
          <div>
            <Heading variant="h2" className="mb-6">
              📚 Kursinhalte
            </Heading>
            <ul className="space-y-3">
              {course.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-800 leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Learning Objectives */}
          <div>
            <Heading variant="h2" className="mb-6">
              🎯 Lernziele
            </Heading>
            <ul className="space-y-3">
              {course.learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prerequisites */}
          <div>
            <Heading variant="h2" className="mb-6">
              ✅ Voraussetzungen
            </Heading>
            <ul className="space-y-3">
              {course.prerequisites.map((prerequisite, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{prerequisite}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function CourseTemplate({ courseSlug }: CourseTemplateProps) {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [course, setCourse] = useState<CourseMetadata | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<EnrollmentStatus>({
    isEnrolled: false,
  });
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<{ current: number; total: number }>({
    current: 1,
    total: 5,
  });
  const [loading, setLoading] = useState(true);
  const userProgress = getMockUserProgress(courseSlug);

  useEffect(() => {
    let canceled = false;
    const loadCourseData = async () => {
      try {
        // Load static course data synchronously and render immediately
        const courseData = getCourseBySlug(courseSlug);
        if (courseData && !canceled) {
          setCourse(courseData);
          setLoading(false); // Optimistic render; do not block on enrollment
        }

        // Fetch enrollment asynchronously if user is logged in
        if (user) {
          const supabase = getSupabaseClient();
          const { data: session } = await supabase.auth.getSession();
          const token = session?.session?.access_token;
          if (token) {
            const response = await fetch('/api/courses', {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            if (!canceled) {
              if (response.ok) {
                const data = await response.json();
                const courseWithEnrollment = data.courses?.find((c: any) => c.slug === courseSlug);
                if (courseWithEnrollment) {
                  setEnrollmentStatus({
                    isEnrolled: courseWithEnrollment.user_enrolled || false,
                    progress: courseWithEnrollment.progress
                      ? {
                          completedCases: courseWithEnrollment.progress.completedCases || 0,
                          totalCases: courseWithEnrollment.foundationCasesCount || 0,
                          progressPercentage: courseWithEnrollment.progress.progressPercentage || 0,
                        }
                      : undefined,
                  });
                } else {
                  setEnrollmentStatus({ isEnrolled: false });
                }
              } else {
                console.error('Failed to load enrollment status');
                setEnrollmentStatus({ isEnrolled: false });
              }
            }
          } else if (!canceled) {
            setEnrollmentStatus({ isEnrolled: false });
          }
        } else if (!canceled) {
          setEnrollmentStatus({ isEnrolled: false });
        }
      } catch (error) {
        console.error('Error loading course data:', error);
        if (!canceled) setEnrollmentStatus({ isEnrolled: false });
      }
    };

    loadCourseData();
    return () => {
      canceled = true;
    };
  }, [courseSlug, user]);

  const handleEnroll = async () => {
    if (!course) return;

    try {
      // TODO: Implement enrollment API call
      console.log(`Enrolling in ${course.title}`);
      setEnrollmentStatus({ isEnrolled: true });
    } catch (error) {
      console.error('Enrollment failed:', error);
    }
  };

  const handleStartCourse = () => {
    if (!course) return;

    // Navigate to Foundation Cases
    if (course.slug === 'strategy-track') {
      router.push('/foundation/cases');
    } else {
      // For other courses, navigate to their specific foundation cases
      router.push(`/courses/${course.slug}/foundation`);
    }
  };

  const handleStartOnboarding = () => {
    // open inline onboarding in this page
    setShowOnboarding(true);
  };

  const handleStartExpert = () => {
    if (!course) return;
    // navigate to expert cases route aligned with ModuleGrid
    router.push(`/tracks/${course.slug}/expert`);
  };

  // Memoized handler passed to OnboardingContainer to keep stable identity
  const handleOnboardingStepChange = useCallback((current: number, total: number) => {
    setOnboardingStep({ current, total });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-navaa-warm-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Kurs wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-navaa-warm-beige flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Kurs nicht gefunden</h1>
          <p className="text-gray-600 mb-6">Der angeforderte Kurs konnte nicht gefunden werden.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Zurück zum Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navaa-warm-beige">
      <Header variant="app" />

      {/* Hide hero when onboarding is active */}
      {!showOnboarding && (
        <CourseHero
          course={course}
          enrollmentStatus={enrollmentStatus}
          onEnroll={handleEnroll}
          onStartCourse={handleStartCourse}
          userProgress={userProgress}
          onStartOnboarding={handleStartOnboarding}
          onStartExpert={handleStartExpert}
        />
      )}

      {showOnboarding ? (
        <>
          <OnboardingHeader
            onBackToCourse={() => setShowOnboarding(false)}
            currentStep={onboardingStep.current}
            totalSteps={onboardingStep.total}
          />
          <OnboardingLayout
            onboardingFirstOnMobile={true}
            left={<ContextPanel />}
            right={
              <OnboardingContainer
                hideHeader
                onBackToCourse={() => setShowOnboarding(false)}
                onStepChange={handleOnboardingStepChange}
              />
            }
          />
        </>
      ) : (
        <ModuleGrid
          courseSlug={courseSlug}
          modules={getModulesByCourse(courseSlug)}
          userProgress={userProgress}
          onOpenOnboarding={() => setShowOnboarding(true)}
        />
      )}

      {!showOnboarding && <Footer />}
    </div>
  );
}
