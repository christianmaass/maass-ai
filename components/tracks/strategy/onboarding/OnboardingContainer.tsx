import React, { useEffect, useState } from 'react';
import ProgressIndicator from './ProgressIndicator';
import OnboardingContextHeader from './layout/OnboardingContextHeader';
import SkipButton from './SkipButton';
import Step1_Problem from './steps/Step1_Problem';
import Step2_Structure from './steps/Step2_Structure';
import Step3_Analysis from './steps/Step3_Analysis';
import Step4_Synthesis from './steps/Step4_Synthesis';
import Step5_Recommendation from './steps/Step5_Recommendation';
import { StepComponentProps } from './types/onboarding.types';

// Step Components Mapping
const stepComponents: Record<number, React.FC<StepComponentProps>> = {
  1: Step1_Problem,
  2: Step2_Structure,
  3: Step3_Analysis,
  4: Step4_Synthesis,
  5: Step5_Recommendation,
};

import CompletionScreen from './CompletionScreen';

const CompletionScreenWrapper: React.FC<{ onRestart: () => void }> = ({ onRestart }) => (
  <CompletionScreen onRestart={onRestart} />
);

interface OnboardingContainerProps {
  onBackToCourse?: () => void;
  hideHeader?: boolean;
  onStepChange?: (currentStep: number, totalSteps: number) => void;
}

const OnboardingContainer: React.FC<OnboardingContainerProps> = ({
  onBackToCourse,
  hideHeader = false,
  onStepChange,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showSkipConfirm, setShowSkipConfirm] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const totalSteps = 5;

  useEffect(() => {
    if (onStepChange) onStepChange(currentStep, totalSteps);
  }, [currentStep, totalSteps, onStepChange]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setShowSkipConfirm(true);
  };

  const confirmSkip = () => {
    setIsCompleted(true);
    setShowSkipConfirm(false);
  };

  const cancelSkip = () => {
    setShowSkipConfirm(false);
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setIsCompleted(false);
    setShowSkipConfirm(false);
  };

  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <CompletionScreenWrapper onRestart={handleRestart} />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Full-width header under site header */}
      {!hideHeader && (
        <OnboardingContextHeader
          onBackToCourse={onBackToCourse}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      )}

      {/* Main Content container */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Action Row: Back to course + Skip (right) */}
        {!hideHeader && (
          <div className="flex items-center justify-end gap-3 mb-6">
            {onBackToCourse && (
              <button
                type="button"
                onClick={onBackToCourse}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50"
              >
                Zurück zum Kurs
              </button>
            )}
            <SkipButton
              onSkip={handleSkip}
              showConfirm={showSkipConfirm}
              onConfirm={confirmSkip}
              onCancel={cancelSkip}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 min-h-[500px] mb-16">
          {(() => {
            const StepComponent = stepComponents[currentStep];
            if (StepComponent) {
              return (
                <StepComponent stepNumber={currentStep} onNext={handleNext} onBack={handleBack} />
              );
            }
            // Fallback für unbekannte Steps
            return (
              <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Schritt {currentStep} nicht gefunden
                </h2>
                <p className="text-gray-600">Dieser Schritt ist noch nicht implementiert.</p>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default OnboardingContainer;
