import { ReactComponentElement } from 'react';

// Core step definition interface
export interface StepDefinition {
  id: string;
  title: string;
  icon: string;
  component: React.ComponentType<StepProps>;
  order: number;
  description?: string;
}

// Props that each step component receives
export interface StepProps {
  onNext: () => void;
  onBack: () => void;
  onComplete: (data: any) => void;
  stepData?: any;
  isFirstStep: boolean;
  isLastStep: boolean;
}

// Track configuration interface
export interface TrackConfiguration {
  trackType: string;
  trackName: string;
  steps: StepDefinition[];
  totalSteps: number;
  completionRoute?: string;
}

// Step engine state
export interface StepEngineState {
  currentStepIndex: number;
  stepData: Record<string, any>;
  isCompleted: boolean;
  canSkip: boolean;
}

// Step engine props
export interface StepEngineProps {
  trackConfig: TrackConfiguration;
  onStepComplete?: (stepId: string, data: any) => void;
  onJourneyComplete?: (allData: Record<string, any>) => void;
  allowSkip?: boolean;
  initialStep?: number;
}

// Progress indicator props
export interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles?: string[];
  variant?: 'default' | 'compact';
}
