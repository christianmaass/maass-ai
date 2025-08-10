/**
 * NEW ONBOARDING PAGE
 * Multi-Course Onboarding mit CourseGrid
 *
 * FEATURES:
 * - Willkommens-Message für neue User
 * - CourseGrid für Kursauswahl
 * - OnboardingGuard für Route-Protection
 * - Navigation zu gewähltem Kurs
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
 * ✅ Onboarding Flow - Clear user guidance and progress tracking
 * ✅ User Segmentation - New vs. returning user detection
 * ✅ CTA Optimization - Prominent links to structured onboarding
 * ✅ EdTech Best Practices - Minimal friction, clear next steps
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { UnifiedGuard, UNIFIED_GUARDS } from '../components/ui/UnifiedGuard';
import CourseGrid from '../components/courses/CourseGrid';
import UnifiedHeader from '../components/layout/UnifiedHeader';
import Footer from '../components/layout/Footer';
import WelcomeHeroBanner from '../components/sections/WelcomeHeroBanner';
import { useAuth } from '../contexts/AuthContext';

// =============================================================================
// MAIN ONBOARDING COMPONENT
// =============================================================================

function OnboardingContent() {
  const { profile } = useAuth();
  const firstName = profile?.firstName || 'User';

  return (
    <div className="min-h-screen navaa-bg-primary">
      <UnifiedHeader variant="app" />
      <WelcomeHeroBanner variant="onboarding" firstName={firstName} />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Strategy Track Onboarding Link */}
        <div className="mb-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-3">🚀 Strategy Track Onboarding</h2>
            <p className="text-blue-100 mb-4">
              Starte mit unserem strukturierten Onboarding für den Strategy Track
            </p>
            <Link
              href="/tracks/strategy/onboarding"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-lg"
            >
              📚 Strategy Track Onboarding starten
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Course Selection */}
        <CourseGrid variant="onboarding" maxCourses={6} showEnrollmentStatus={false} />

        {/* Getting Started Tips */}
        <div className="mt-12 bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">💡 So funktioniert&apos;s</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto font-bold">
                1
              </div>
              <h3 className="font-medium">Kurs wählen</h3>
              <p className="text-sm text-gray-600">Klicke auf einen Kurs, der dich interessiert</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto font-bold">
                2
              </div>
              <h3 className="font-medium">Einschreiben</h3>
              <p className="text-sm text-gray-600">Schreibe dich kostenlos in den Kurs ein</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto font-bold">
                3
              </div>
              <h3 className="font-medium">Cases lösen</h3>
              <p className="text-sm text-gray-600">Arbeite dich durch die Foundation Cases</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto font-bold">
                4
              </div>
              <h3 className="font-medium">Fortschritt verfolgen</h3>
              <p className="text-sm text-gray-600">Sieh deinen Lernfortschritt im Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// =============================================================================
// EXPORTED COMPONENT WITH ROUTE GUARD
// =============================================================================

export default function OnboardingNew() {
  const router = useRouter();

  // Development bypass: ?dev=true allows direct access
  // Remove this in production after development is complete
  const isDevelopmentMode = router.query.dev === 'true';

  // Ensure router is ready before checking query params
  if (!router.isReady) {
    return (
      <div className="min-h-screen bg-navaa-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navaa-primary mx-auto mb-4"></div>
          <p className="text-navaa-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (isDevelopmentMode) {
    return <OnboardingContent />;
  }

  return (
    <UnifiedGuard config={UNIFIED_GUARDS.ONBOARDING}>
      <OnboardingContent />
    </UnifiedGuard>
  );
}
