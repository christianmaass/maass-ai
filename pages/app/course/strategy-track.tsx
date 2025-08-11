import React from 'react';
import { UnifiedGuard, UNIFIED_GUARDS } from '@components/ui/UnifiedGuard';
import CourseTemplate from '@components/courses/CourseTemplate';

export default function AppStrategyTrackPage() {
  return (
    <UnifiedGuard config={UNIFIED_GUARDS.COURSE}>
      <CourseTemplate courseSlug="strategy-track" />
    </UnifiedGuard>
  );
}
