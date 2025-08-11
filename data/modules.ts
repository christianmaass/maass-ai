/**
 * 🚀 NAVAA.AI DEVELOPMENT STANDARDS
 *
 * This file follows navaa.ai development guidelines:
 * 📋 CONTRIBUTING.md - Contribution standards and workflow
 * 📚 docs/navaa-development-guidelines.md - Complete development standards
 *
 * KEY STANDARDS FOR THIS FILE:
 * ✅ Stability First - Never change working features without clear reason
 * ✅ Central Data - Centralized module data management
 * ✅ Module System - 3-Modul-Architektur Datenstruktur
 * ✅ Type Safety - Full TypeScript interface definitions
 * ✅ Extensibility - Easy to add new courses and modules
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */

/**
 * COURSE MODULES DATA
 *
 * Centralized data for all course modules in the 3-module architecture.
 * Each course has: Onboarding, Foundation Cases, Expert Cases.
 *
 * STRUCTURE:
 * - Onboarding: Methodology and approach learning
 * - Foundation Cases: 10-12 structured cases for assessment
 * - Expert Cases: GPT-generated personalized challenges
 *
 * @version 1.0.0 (3-Module Architecture)
 * @author navaa Development Team
 */

import { ModuleData } from '@components/courses/ModuleCard';

// =============================================================================
// STRATEGY TRACK MODULES
// =============================================================================

export const STRATEGY_TRACK_MODULES: ModuleData[] = [
  {
    id: 'strategy-onboarding',
    title: 'Start Onboarding',
    description:
      'In diesem Modul lernest du die navaa Methodik kennen, um strategische Herausforderungen meistern zu können. Es dauert nur wenige Miunten, dann geht es direkt mit den ersten richtigen Fällen los.',
    type: 'onboarding',
    status: 'available',
    estimatedTime: '5-10 Minuten',
    icon: '🎓',
    features: [
      'Fallstudienmethodik verstehen',
      'Einführung in die strategische Denkweise',
      'Erste Übungen absolvieren',
    ],
  },
  {
    id: 'strategy-foundation',
    title: 'Foundation Cases',
    description:
      'Baue dein strategisches Fundament auf: Bearbeite 10–12 strukturierte Cases mit wachsender Komplexität. Erkenne Muster, schärfe deine Analyse und trainiere Entscheidungen unter Druck – mit präzisem Feedback zu deinen Stärken und Entwicklungsfeldern.',
    type: 'foundation',
    status: 'locked',
    estimatedTime: '8–10 Stunden',
    icon: '📊',
    features: [
      '10–12 Business Cases mit klarer Struktur',
      'Progressiver Anstieg der Schwierigkeit',
      'Detailliertes, umsetzbares Feedback',
    ],
  },
  {
    id: 'strategy-expert',
    title: 'Expert Cases',
    description:
      'Spiele in der obersten Liga: Meistere personalisierte Herausforderungen, die exakt zu deinen Zielen passen. Minimalstrukturierte, realistische Gesprächssituationen fordern dich heraus, deine strategische Denk- und Handlungskraft unter Beweis zu stellen.',
    type: 'expert',
    status: 'locked',
    estimatedTime: 'Individuell',
    icon: '🎯',
    features: [
      'GPT-generierte, maßgeschneiderte Cases',
      'Individuell auf dein Profil zugeschnitten',
      'Simulation echter High-Stakes-Situationen',
    ],
  },
];

// =============================================================================
// MODULE UTILITIES
// =============================================================================

/**
 * Get modules for a specific course
 */
export function getModulesByCourse(courseSlug: string): ModuleData[] {
  switch (courseSlug) {
    case 'strategy-track':
      return STRATEGY_TRACK_MODULES;
    default:
      console.warn(`No modules found for course: ${courseSlug}`);
      return [];
  }
}

/**
 * Get a specific module by ID
 */
export function getModuleById(moduleId: string): ModuleData | null {
  // Search in all course modules
  const allModules = [
    ...STRATEGY_TRACK_MODULES,
    // Add other course modules here when available
  ];

  return allModules.find((module) => module.id === moduleId) || null;
}

/**
 * Get module by course and type
 */
export function getModuleByType(
  courseSlug: string,
  moduleType: ModuleData['type'],
): ModuleData | null {
  const modules = getModulesByCourse(courseSlug);
  return modules.find((module) => module.type === moduleType) || null;
}

// =============================================================================
// MOCK USER PROGRESS (for development/testing)
// =============================================================================

export const MOCK_USER_PROGRESS = {
  'strategy-track': {
    onboardingCompleted: false,
    foundationCasesCompleted: 0,
    foundationCasesTotal: 12,
    expertCasesUnlocked: false,
  },
};

/**
 * Get mock user progress for development
 */
export function getMockUserProgress(courseSlug: string) {
  return (
    MOCK_USER_PROGRESS[courseSlug as keyof typeof MOCK_USER_PROGRESS] || {
      onboardingCompleted: false,
      foundationCasesCompleted: 0,
      foundationCasesTotal: 12,
      expertCasesUnlocked: false,
    }
  );
}
