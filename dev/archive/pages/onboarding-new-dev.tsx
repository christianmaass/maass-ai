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
 * ✅ Development Route - Temporary route for development purposes
 * ✅ Clean Code - Reuse existing components and logic
 * ✅ Documentation - Clear purpose and removal instructions
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */

/**
 * ONBOARDING-NEW DEVELOPMENT ROUTE
 *
 * TEMPORARY DEVELOPMENT ROUTE - REMOVE BEFORE PRODUCTION
 *
 * This is a development-only route that bypasses the UnifiedGuard
 * to allow direct access to the onboarding-new page during development.
 *
 * Usage: http://localhost:3000/onboarding-new-dev
 *
 * TODO: Remove this file before production deployment
 *
 * @version 1.0.0 (Development Only)
 * @author navaa Development Team
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CourseGrid from '../../../components/courses/CourseGrid';
import Header from '@layout/basic/Header';
import Footer from '@layout/basic/Footer';
import WelcomeHeroBanner from '../../../components/sections/WelcomeHeroBanner';
import { useAuth } from '../../../contexts/AuthContext';

// =============================================================================
// ONBOARDING CONTENT COMPONENT (Same as onboarding-new.tsx)
// =============================================================================

function OnboardingContent() {
  const { profile } = useAuth();
  const firstName = profile?.firstName || 'dort';

  return (
    <div className="min-h-screen bg-navaa-bg-primary">
      <Header variant="app" />
      <WelcomeHeroBanner variant="onboarding" firstName={firstName} />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Strategy Track Onboarding Link */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Strategy Track - Strukturiertes Onboarding
              </h2>
              <p className="text-gray-600 mb-4">
                Beginne deine Lernreise mit unserem geführten Onboarding-Prozess. Du wirst Schritt
                für Schritt durch die wichtigsten Konzepte geführt.
              </p>
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Interaktive Lernmodule
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ~15 Minuten
                </span>
              </div>
            </div>
            <div>
              <Link
                href="/tracks/strategy/onboarding"
                className="inline-flex items-center px-6 py-3 bg-navaa-primary text-white font-semibold rounded-lg hover:bg-navaa-primary/90 transition-colors"
              >
                Onboarding starten
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </div>

        {/* Course Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Verfügbare Kurse</h2>
          <CourseGrid variant="onboarding" />
        </div>

        {/* Getting Started Tips */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">So startest du durch</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-navaa-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Kurs auswählen</h3>
                <p className="text-gray-600 text-sm">
                  Wähle einen Kurs aus, der zu deinen Lernzielen passt.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-navaa-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Einschreiben</h3>
                <p className="text-gray-600 text-sm">
                  Klicke auf &quot;Einschreiben&quot; um Zugang zu den Kursinhalten zu erhalten.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-navaa-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Cases bearbeiten</h3>
                <p className="text-gray-600 text-sm">
                  Arbeite dich durch die praxisnahen Business Cases.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-navaa-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Fortschritt verfolgen</h3>
                <p className="text-gray-600 text-sm">
                  Verfolge deinen Lernfortschritt im Dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT - DEVELOPMENT ONLY
// =============================================================================

export default function OnboardingNewDev() {
  return (
    <div>
      {/* Development Warning Banner */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Development Mode:</strong> This is a development-only route. Remove before
              production.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <OnboardingContent />
    </div>
  );
}
