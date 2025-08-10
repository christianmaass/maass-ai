import {
  StepDefinition,
  TrackConfiguration,
} from '../../../../shared/step-engine/types/step-engine.types';
import Step1_Problem from '../steps/Step1_Problem';
import Step2_Structure from '../steps/Step2_Structure';
import Step3_Analysis from '../steps/Step3_Analysis';
import Step4_Synthesis from '../steps/Step4_Synthesis';
import Step5_Recommendation from '../steps/Step5_Recommendation';

// Strategy track step definitions
export const strategySteps: StepDefinition[] = [
  {
    id: 'problem_understanding',
    title: 'Problemverständnis & Zielklärung',
    icon: '🎯',
    component: Step1_Problem,
    order: 1,
    description: 'Verstehe das Problem und kläre die Ziele',
  },
  {
    id: 'structuring_hypotheses',
    title: 'Strukturierung & Hypothesenbildung',
    icon: '🏗️',
    component: Step2_Structure,
    order: 2,
    description: 'Strukturiere das Problem und bilde Hypothesen',
  },
  {
    id: 'analysis_quantification',
    title: 'Analyse & Zahlenarbeit',
    icon: '📊',
    component: Step3_Analysis,
    order: 3,
    description: 'Analysiere quantitativ und arbeite mit Zahlen',
  },
  {
    id: 'synthesis_evaluation',
    title: 'Synthetisieren & Optionen bewerten',
    icon: '⚖️',
    component: Step4_Synthesis,
    order: 4,
    description: 'Synthetisiere Erkenntnisse und bewerte Optionen',
  },
  {
    id: 'recommendation_summary',
    title: 'Empfehlung & Executive Summary',
    icon: '🎯',
    component: Step5_Recommendation,
    order: 5,
    description: 'Formuliere Empfehlungen und erstelle Executive Summary',
  },
];

// Complete strategy track configuration
export const strategyTrackConfig: TrackConfiguration = {
  trackType: 'strategy',
  trackName: 'Strategieberatung',
  steps: strategySteps,
  totalSteps: strategySteps.length,
  completionRoute: '/tracks/strategy/foundation',
};

// Export individual step configurations for flexibility
export const stepTitles = strategySteps.map((step) => step.title);
export const stepIcons = strategySteps.map((step) => step.icon);
