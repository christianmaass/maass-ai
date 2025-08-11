/**
 * 🚀 NAVAA.AI DEVELOPMENT STANDARDS
 *
 * This file follows navaa.ai development guidelines:
 * 📋 CONTRIBUTING.md - Contribution standards and workflow
 * 📚 docs/navaa-development-guidelines.md - Complete development standards
 *
 * KEY STANDARDS FOR THIS FILE:
 * ✅ Stability First - Never change working features without clear reason
 * ✅ DRY Principle - Single source of truth for course data
 * ✅ Type Safety - Comprehensive TypeScript interfaces
 * ✅ Extensibility - Easy to add new courses and metadata
 * ✅ Consistency - Same data structure across all components
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */

/**
 * CENTRAL COURSE DATA DEFINITION
 *
 * Single source of truth for all course information across:
 * - Marketing pages (TargetAudienceSection)
 * - Dashboard course listings
 * - Course template pages
 * - Navigation and routing
 *
 * @version 1.0.0 (Centralized Course Data)
 * @author navaa Development Team
 */

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface CourseMetadata {
  id: number;
  slug: string;
  title: string;
  shortTitle?: string;
  image: string;
  description: string;
  targetGroup: string;

  // Extended metadata for course templates
  longDescription?: string;
  difficulty: number; // 1-10 scale
  estimatedHours: number;
  foundationCasesCount: number;

  // Status and availability
  status: 'live' | 'coming-soon' | 'beta';
  isActive: boolean;

  // Course template data
  features: string[];
  learningObjectives: string[];
  prerequisites: string[];

  // Navigation and routing
  templateRoute: string;
  onboardingRoute?: string;
}

import { CATALOG } from '../lib/assetPaths';

// =============================================================================
// COURSE DATA DEFINITIONS
// =============================================================================

export const COURSES: CourseMetadata[] = [
  {
    id: 1,
    slug: 'strategy-track',
    title: 'The Strategy Track',
    shortTitle: 'Strategy Track',
    image: CATALOG.strategy,
    description: 'Strategisches Denken & Executive Decision Making',
    longDescription:
      'Trainiere strategisches Denken an realen Business-Szenarien. Lerne, komplexe Entscheidungen klar zu treffen, Prioritäten zu setzen und strategische Initiativen wirksam umzusetzen – selbst unter Zeitdruck und mit unvollständigen Informationen.',
    targetGroup: 'Für Führungskräfte & Berater',
    difficulty: 6,
    estimatedHours: 40,
    foundationCasesCount: 12,
    status: 'live',
    isActive: true,
    features: [
      '12 praxisnahe Business Cases',
      'Interaktive Entscheidungsszenarien',
      'Strategische Frameworks & Tools',
      'Executive Decision Making',
      'Stakeholder Management',
    ],
    learningObjectives: [
      'Strategische Denkweise entwickeln',
      'Komplexe Entscheidungen strukturiert treffen',
      'Business Cases systematisch analysieren',
      'Stakeholder-Perspektiven berücksichtigen',
      'Strategische Initiativen erfolgreich umsetzen',
    ],
    prerequisites: [
      'Grundlegende Managementerfahrung',
      'Interesse an strategischen Fragestellungen',
      'Bereitschaft für interaktive Lernformate',
    ],
    templateRoute: '/app/course/strategy-track',
    onboardingRoute: '/tracks/strategy/onboarding',
  },
  {
    id: 2,
    slug: 'product-manager-track',
    title: 'The Product Manager Track',
    shortTitle: 'Product Manager Track',
    image: CATALOG.po,
    description: 'Produktstrategie & Stakeholder Management',
    longDescription:
      'Meistere die Kunst des Product Managements. Von der Produktvision bis zur erfolgreichen Markteinführung - entwickle die Fähigkeiten eines erfolgreichen Product Managers.',
    targetGroup: 'Für Product Manager & POs',
    difficulty: 5,
    estimatedHours: 35,
    foundationCasesCount: 10,
    status: 'coming-soon',
    isActive: false,
    features: [
      'Produktstrategie entwickeln',
      'Stakeholder Management',
      'Agile Produktentwicklung',
      'User Research & Validation',
      'Go-to-Market Strategien',
    ],
    learningObjectives: [
      'Produktvisionen entwickeln und kommunizieren',
      'Stakeholder erfolgreich managen',
      'Datengetriebene Produktentscheidungen treffen',
      'Agile Entwicklungsprozesse optimieren',
      'Erfolgreiche Produktlaunches durchführen',
    ],
    prerequisites: [
      'Grundkenntnisse in Produktentwicklung',
      'Erfahrung mit agilen Methoden',
      'Analytisches Denkvermögen',
    ],
    templateRoute: '/app/course/product-manager-track',
  },
  {
    id: 3,
    slug: 'cfo-track',
    title: 'The CFO Track',
    shortTitle: 'CFO Track',
    image: CATALOG.cfo,
    description: 'Financial Leadership & Strategische Finanzplanung',
    longDescription:
      'Entwickle die Fähigkeiten eines modernen CFOs. Von strategischer Finanzplanung bis zu Investor Relations - meistere die Herausforderungen der Finanzführung.',
    targetGroup: 'Für Finance-Führungskräfte',
    difficulty: 8,
    estimatedHours: 45,
    foundationCasesCount: 15,
    status: 'coming-soon',
    isActive: false,
    features: [
      'Strategische Finanzplanung',
      'Investor Relations',
      'Risk Management',
      'Financial Modeling',
      'M&A Transaktionen',
    ],
    learningObjectives: [
      'Strategische Finanzpläne entwickeln',
      'Investoren erfolgreich managen',
      'Risiken identifizieren und bewerten',
      'Komplexe Finanzmodelle erstellen',
      'M&A-Prozesse erfolgreich durchführen',
    ],
    prerequisites: [
      'Fundierte Finanzexpertise',
      'Führungserfahrung im Finance-Bereich',
      'Verständnis für Unternehmensstrategie',
    ],
    templateRoute: '/app/course/cfo-track',
  },
  {
    id: 4,
    slug: 'communication-track',
    title: 'Communication Track',
    shortTitle: 'Communication Track',
    image: CATALOG.communication,
    description: 'Effektive Kommunikation & Präsentationstechniken',
    longDescription:
      'Meistere die Kunst der effektiven Kommunikation. Von überzeugenden Präsentationen bis zu schwierigen Gesprächen - entwickle deine Kommunikationsfähigkeiten.',
    targetGroup: 'Für alle Führungsebenen',
    difficulty: 4,
    estimatedHours: 25,
    foundationCasesCount: 8,
    status: 'coming-soon',
    isActive: false,
    features: [
      'Überzeugende Präsentationen',
      'Schwierige Gespräche führen',
      'Storytelling Techniken',
      'Nonverbale Kommunikation',
      'Konflikte lösen',
    ],
    learningObjectives: [
      'Überzeugende Präsentationen halten',
      'Schwierige Gespräche erfolgreich führen',
      'Storytelling für Business einsetzen',
      'Körpersprache bewusst nutzen',
      'Konflikte konstruktiv lösen',
    ],
    prerequisites: [
      'Grundlegende Führungserfahrung',
      'Bereitschaft für praktische Übungen',
      'Offenheit für Feedback',
    ],
    templateRoute: '/course/communication-track',
  },
  {
    id: 5,
    slug: 'hard-decisions-track',
    title: 'Hard Decisions Track',
    shortTitle: 'Hard Decisions Track',
    image: CATALOG.hardDecisions,
    description: 'Schwierige Entscheidungen & Krisenmanagement',
    longDescription:
      'Lerne, auch in schwierigen Situationen die richtigen Entscheidungen zu treffen. Von Krisenmanagement bis zu ethischen Dilemmata - entwickle deine Entscheidungskompetenz.',
    targetGroup: 'Für Entscheidungsträger',
    difficulty: 9,
    estimatedHours: 50,
    foundationCasesCount: 18,
    status: 'coming-soon',
    isActive: false,
    features: [
      'Krisenmanagement',
      'Ethische Entscheidungen',
      'Entscheidung unter Unsicherheit',
      'Change Management',
      'Stakeholder-Konflikte',
    ],
    learningObjectives: [
      'Krisen erfolgreich managen',
      'Ethische Dilemmata lösen',
      'Unter Unsicherheit entscheiden',
      'Veränderungsprozesse führen',
      'Komplexe Stakeholder-Konflikte lösen',
    ],
    prerequisites: [
      'Umfangreiche Führungserfahrung',
      'Erfahrung mit schwierigen Situationen',
      'Hohe Stressresistenz',
    ],
    templateRoute: '/course/hard-decisions-track',
  },
  {
    id: 6,
    slug: 'ki-manager-track',
    title: 'KI Manager Track',
    shortTitle: 'KI Manager Track',
    image: CATALOG.kiManager,
    description: 'KI-Leadership & Digitale Transformation',
    longDescription:
      'Führe dein Unternehmen erfolgreich in das KI-Zeitalter. Von KI-Strategien bis zu ethischen Überlegungen - entwickle die Kompetenzen eines modernen Tech-Leaders.',
    targetGroup: 'Für Tech-Führungskräfte',
    difficulty: 7,
    estimatedHours: 40,
    foundationCasesCount: 14,
    status: 'coming-soon',
    isActive: false,
    features: [
      'KI-Strategien entwickeln',
      'Digitale Transformation',
      'Tech-Team Leadership',
      'KI-Ethik & Governance',
      'Innovation Management',
    ],
    learningObjectives: [
      'KI-Strategien erfolgreich entwickeln',
      'Digitale Transformationen führen',
      'Tech-Teams effektiv leiten',
      'KI-Ethik in Unternehmen etablieren',
      'Innovationsprozesse optimieren',
    ],
    prerequisites: [
      'Technisches Grundverständnis',
      'Führungserfahrung im Tech-Bereich',
      'Interesse an KI und Digitalisierung',
    ],
    templateRoute: '/course/ki-manager-track',
  },
  {
    id: 7,
    slug: 'negotiation-track',
    title: 'Negotiation Track',
    shortTitle: 'Negotiation Track',
    image: CATALOG.negotiation,
    description: 'Verhandlungsführung & Konfliktlösung',
    longDescription:
      'Meistere die Kunst der erfolgreichen Verhandlung. Von Win-Win-Lösungen bis zu schwierigen Verhandlungspartnern - entwickle deine Verhandlungskompetenz.',
    targetGroup: 'Für Verhandlungsführer',
    difficulty: 6,
    estimatedHours: 30,
    foundationCasesCount: 12,
    status: 'coming-soon',
    isActive: false,
    features: [
      'Win-Win Verhandlungen',
      'Schwierige Verhandlungspartner',
      'Verhandlungspsychologie',
      'Internationale Verhandlungen',
      'Konfliktlösung',
    ],
    learningObjectives: [
      'Win-Win-Lösungen entwickeln',
      'Schwierige Verhandlungen meistern',
      'Verhandlungspsychologie verstehen',
      'Kulturelle Unterschiede berücksichtigen',
      'Konflikte konstruktiv lösen',
    ],
    prerequisites: [
      'Grundlegende Verhandlungserfahrung',
      'Kommunikationsfähigkeiten',
      'Interesse an Psychologie',
    ],
    templateRoute: '/course/negotiation-track',
  },
];

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const getActiveCourses = (): CourseMetadata[] => {
  return COURSES.filter((course) => course.isActive);
};

export const getLiveCourses = (): CourseMetadata[] => {
  return COURSES.filter((course) => course.status === 'live');
};

export const getCourseBySlug = (slug: string): CourseMetadata | undefined => {
  return COURSES.find((course) => course.slug === slug);
};

export const getCourseById = (id: number): CourseMetadata | undefined => {
  return COURSES.find((course) => course.id === id);
};

// =============================================================================
// LEGACY COMPATIBILITY
// =============================================================================

// For compatibility with existing TargetAudienceSection
export const getTargetAudienceCourses = () => {
  return COURSES.map((course) => ({
    id: course.id,
    title: course.title,
    image: course.image,
    description: course.description,
    targetGroup: course.targetGroup,
  }));
};
