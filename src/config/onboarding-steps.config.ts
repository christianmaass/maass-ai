/**
 * Configuration for Strategy Track onboarding steps
 * Centralizes step data including URLs, titles, and metadata
 */

export interface OnboardingStep {
  id: string;
  number: number;
  title: string;
  description: string;
  url: string;
  image_url: string;
}

/**
 * Strategy Track onboarding steps configuration
 * Used across onboarding pages and components
 */
export const STRATEGY_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'verstehen',
    number: 1,
    title: 'Verstehen',
    description: 'Problem & Ziel klären',
    url: '/strategy-track/onboarding/verstehen',
    image_url: '/images/strategy-onboarding/verstehen-visual.png',
  },
  {
    id: 'strukturieren',
    number: 2,
    title: 'Strukturieren',
    description: 'Hypothesen aufstellen',
    url: '/strategy-track/onboarding/strukturieren',
    image_url: '/images/strategy-onboarding/strukturieren-visual.png',
  },
  {
    id: 'analysieren',
    number: 3,
    title: 'Analysieren',
    description: 'Fakten schaffen',
    url: '/strategy-track/onboarding/analysieren',
    image_url: '/images/strategy-onboarding/analysieren-visual.png',
  },
  {
    id: 'bewerten',
    number: 4,
    title: 'Bewerten',
    description: 'Optionen verdichten',
    url: '/strategy-track/onboarding/bewerten',
    image_url: '/images/strategy-onboarding/bewerten-visual.png',
  },
  {
    id: 'empfehlen',
    number: 5,
    title: 'Empfehlen',
    description: 'Entscheidung auf den Punkt bringen',
    url: '/strategy-track/onboarding/empfehlen',
    image_url: '/images/strategy-onboarding/empfehlen-visual.png',
  },
];

/**
 * Get a specific onboarding step by ID
 */
export function getOnboardingStepById(id: string): OnboardingStep | undefined {
  return STRATEGY_ONBOARDING_STEPS.find((step) => step.id === id);
}

/**
 * Get the next step in the onboarding sequence
 */
export function getNextOnboardingStep(currentId: string): OnboardingStep | undefined {
  const currentIndex = STRATEGY_ONBOARDING_STEPS.findIndex((step) => step.id === currentId);
  if (currentIndex === -1 || currentIndex === STRATEGY_ONBOARDING_STEPS.length - 1) {
    return undefined;
  }
  return STRATEGY_ONBOARDING_STEPS[currentIndex + 1];
}

/**
 * Get the previous step in the onboarding sequence
 */
export function getPreviousOnboardingStep(currentId: string): OnboardingStep | undefined {
  const currentIndex = STRATEGY_ONBOARDING_STEPS.findIndex((step) => step.id === currentId);
  if (currentIndex <= 0) {
    return undefined;
  }
  return STRATEGY_ONBOARDING_STEPS[currentIndex - 1];
}
