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
 * ✅ Module System - 3-Modul-Architektur Layout
 * ✅ Responsive Design - Mobile-first approach with Tailwind CSS
 * ✅ User Experience - Clear module progression visualization
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */

/**
 * MODULE GRID COMPONENT
 *
 * Layout component for displaying the 3-module architecture.
 * Manages the grid layout and module progression logic.
 *
 * FEATURES:
 * - 3-column responsive grid (mobile: 1 col, tablet: 2 cols, desktop: 3 cols)
 * - Module progression logic (unlock sequence)
 * - navaa-guideline-conform spacing and design
 * - Integration with CourseTemplate
 *
 * @version 1.0.0 (3-Module Architecture)
 * @author navaa Development Team
 */

import React from 'react';
import { useRouter } from 'next/router';
import ModuleCard, { ModuleData } from './ModuleCard';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface ModuleGridProps {
  courseSlug: string;
  modules: ModuleData[];
  userProgress?: {
    onboardingCompleted: boolean;
    foundationCasesCompleted: number;
    foundationCasesTotal: number;
    expertCasesUnlocked: boolean;
  };
  onOpenOnboarding?: () => void;
}

// =============================================================================
// MODULE GRID COMPONENT
// =============================================================================

export default function ModuleGrid({
  courseSlug,
  modules,
  userProgress,
  onOpenOnboarding,
}: ModuleGridProps) {
  const router = useRouter();

  const getModulePath = (module: ModuleData): string | null => {
    switch (module.type) {
      case 'onboarding':
        return `/app/onboarding`;
      case 'foundation':
        return `/app/foundation`;
      case 'expert':
        return `/tracks/${courseSlug}/expert`;
      default:
        return null;
    }
  };

  // Calculate module status based on user progress
  const getModuleStatus = (module: ModuleData): ModuleData['status'] => {
    if (!userProgress) return 'available'; // Default for demo

    switch (module.type) {
      case 'onboarding':
        if (userProgress.onboardingCompleted) return 'completed';
        return 'available';

      case 'foundation':
        if (!userProgress.onboardingCompleted) return 'locked';
        if (userProgress.foundationCasesCompleted === userProgress.foundationCasesTotal)
          return 'completed';
        if (userProgress.foundationCasesCompleted > 0) return 'in-progress';
        return 'available';

      case 'expert':
        if (!userProgress.expertCasesUnlocked) return 'locked';
        return 'available';

      default:
        return 'available';
    }
  };

  // Calculate progress for each module
  const getModuleProgress = (module: ModuleData) => {
    if (!userProgress) return undefined;

    switch (module.type) {
      case 'onboarding':
        return userProgress.onboardingCompleted
          ? {
              current: 1,
              total: 1,
              percentage: 100,
            }
          : undefined;

      case 'foundation':
        if (userProgress.foundationCasesCompleted > 0) {
          return {
            current: userProgress.foundationCasesCompleted,
            total: userProgress.foundationCasesTotal,
            percentage: Math.round(
              (userProgress.foundationCasesCompleted / userProgress.foundationCasesTotal) * 100,
            ),
          };
        }
        return undefined;

      case 'expert':
        // TODO: Implement expert cases progress tracking
        return undefined;

      default:
        return undefined;
    }
  };

  // Handle module click navigation
  const handleModuleClick = (module: ModuleData) => {
    const status = getModuleStatus(module);

    if (status === 'locked') {
      return; // Do nothing for locked modules
    }

    // Open onboarding inline when requested
    if (module.type === 'onboarding' && onOpenOnboarding) {
      onOpenOnboarding();
      return;
    }

    // Navigate based on module type
    const path = getModulePath(module);
    if (path) {
      router.push(path);
    } else {
      console.warn(`Unknown module type: ${module.type}`);
    }
  };

  // Prepare modules with calculated status and progress
  const modulesWithStatus = modules.map((module) => ({
    ...module,
    status: getModuleStatus(module),
    progress: getModuleProgress(module),
  }));

  return (
    <div className="py-16 bg-navaa-warm-beige">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header removed per request */}

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modulesWithStatus.map((module, index) => (
            <div
              key={module.id}
              className="relative h-full"
              onMouseEnter={() => {
                const path = getModulePath(module);
                if (path) router.prefetch(path);
              }}
            >
              {/* Connection Arrow (desktop only) */}
              {index < modulesWithStatus.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              <ModuleCard module={module} onClick={() => handleModuleClick(module)} />
            </div>
          ))}
        </div>

        {/* Progress Summary removed per UX request */}
      </div>
    </div>
  );
}
