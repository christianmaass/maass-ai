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
 * ✅ Smart Routing - Redirect to homepage for unified routing logic
 * ✅ Dashboard Logic - Use CourseGrid + WelcomeHeroBanner pattern
 * ✅ No Marketing Fallbacks - Never show marketing to logged-in users
 * ✅ Enrollment Status - Respect active enrollments for navigation
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Dashboard Route - Redirects to Homepage Smart Routing
 *
 * This route exists to preserve existing links to /dashboard
 * but redirects to / where the smart routing logic handles
 * proper user flow based on enrollment and onboarding status.
 *
 * NAVAA Guidelines: Maintain backward compatibility while
 * simplifying architecture to single routing system.
 */
export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to homepage - smart routing will handle the rest
    router.replace('/');
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Weiterleitung zum Dashboard...</p>
      </div>
    </div>
  );
}
