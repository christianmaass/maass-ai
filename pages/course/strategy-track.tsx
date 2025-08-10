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
 * ✅ Course Template - Uses reusable CourseTemplate component
 * ✅ UnifiedGuard - Proper route protection
 * ✅ Strategy Track - Specific implementation for Strategy Track course
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */

/**
 * STRATEGY TRACK COURSE PAGE
 *
 * Course template page for the Strategy Track course.
 * Uses the reusable CourseTemplate component with Strategy Track data.
 *
 * FEATURES:
 * - UnifiedGuard protection for authenticated users
 * - CourseTemplate with strategy-track slug
 * - Enrollment and progress tracking
 * - Navigation to Foundation Cases
 *
 * @version 1.0.0 (Strategy Track Template)
 * @author navaa Development Team
 */

import React from 'react';
import { UnifiedGuard, UNIFIED_GUARDS } from '../../components/ui/UnifiedGuard';
import CourseTemplate from '../../components/courses/CourseTemplate';

// =============================================================================
// STRATEGY TRACK CONTENT COMPONENT
// =============================================================================

function StrategyTrackContent() {
  return <CourseTemplate courseSlug="strategy-track" />;
}

// =============================================================================
// MAIN COMPONENT WITH GUARD PROTECTION
// =============================================================================

export default function StrategyTrackPage() {
  return (
    <UnifiedGuard config={UNIFIED_GUARDS.COURSE}>
      <StrategyTrackContent />
    </UnifiedGuard>
  );
}
