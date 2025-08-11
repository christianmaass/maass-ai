import React from 'react';
import AppLayout from '@layout/basic/AppLayout';
import { UnifiedGuard, UNIFIED_GUARDS } from '../../components/ui/UnifiedGuard';
import WelcomeHeroBanner from '@/marketing/sections/WelcomeHeroBanner';
import CourseGrid from '../../components/courses/CourseGrid';
import { useAuth } from '../../contexts/AuthContext';

function OnboardingContent() {
  const { profile } = useAuth();
  const firstName = profile?.firstName || 'User';

  return (
    <div className="navaa-container px-6 py-8">
      <WelcomeHeroBanner variant="onboarding" firstName={firstName} />
      <div className="mt-8">
        <CourseGrid variant="onboarding" maxCourses={6} showEnrollmentStatus={false} />
      </div>
    </div>
  );
}

export default function AppOnboardingPage() {
  return (
    <AppLayout>
      <UnifiedGuard config={UNIFIED_GUARDS.ONBOARDING}>
        <OnboardingContent />
      </UnifiedGuard>
    </AppLayout>
  );
}
