// TypeScript interfaces for Onboarding components

export interface MultipleChoiceOption {
  id: string;
  text: string;
  correct: boolean;
}

export interface StepContent {
  title: string;
  icon: string;
  miniCase: string;
  options: MultipleChoiceOption[];
  feedback: {
    correct: string;
    incorrect: string;
  };
  learningPoint: string;
}

export interface StepResponse {
  stepNumber: number;
  selectedOptionId: string;
  isCorrect: boolean;
  timestamp: Date;
}

export interface OnboardingState {
  currentStep: number;
  stepAnswers: StepResponse[];
  showSkipConfirm: boolean;
  isCompleted: boolean;
}

// Props interfaces for components
export interface StepComponentProps {
  stepNumber: number;
  onNext: () => void;
  onBack: () => void;
  onAnswer?: (response: StepResponse) => void;
}

export interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export interface SkipButtonProps {
  onSkip: () => void;
  showConfirm: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface FeedbackBoxProps {
  isCorrect: boolean;
  correctFeedback: string;
  incorrectFeedback: string;
  learningPoint?: string;
  show: boolean;
}

export interface MultipleChoiceProps {
  question: string;
  options: MultipleChoiceOption[];
  onAnswer: (selectedOption: MultipleChoiceOption, isCorrect: boolean) => void;
  showFeedback?: boolean;
  selectedOptionId?: string;
}
