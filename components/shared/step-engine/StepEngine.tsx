import React, { useState, useCallback } from 'react';
import { StepEngineProps, StepEngineState } from './types/step-engine.types';

const StepEngine: React.FC<StepEngineProps> = ({
  trackConfig,
  onStepComplete,
  onJourneyComplete,
  allowSkip = false,
  initialStep = 0,
}) => {
  const [state, setState] = useState<StepEngineState>({
    currentStepIndex: initialStep,
    stepData: {},
    isCompleted: false,
    canSkip: allowSkip,
  });

  const currentStep = trackConfig.steps[state.currentStepIndex];
  const isFirstStep = state.currentStepIndex === 0;
  const isLastStep = state.currentStepIndex === trackConfig.steps.length - 1;

  const handleNext = useCallback(() => {
    if (isLastStep) {
      setState((prev) => ({ ...prev, isCompleted: true }));
      onJourneyComplete?.(state.stepData);
    } else {
      setState((prev) => ({
        ...prev,
        currentStepIndex: prev.currentStepIndex + 1,
      }));
    }
  }, [isLastStep, onJourneyComplete, state.stepData]);

  const handleBack = useCallback(() => {
    if (!isFirstStep) {
      setState((prev) => ({
        ...prev,
        currentStepIndex: prev.currentStepIndex - 1,
      }));
    }
  }, [isFirstStep]);

  const handleStepComplete = useCallback(
    (data: any) => {
      const stepId = currentStep.id;
      setState((prev) => ({
        ...prev,
        stepData: {
          ...prev.stepData,
          [stepId]: data,
        },
      }));
      onStepComplete?.(stepId, data);
    },
    [currentStep.id, onStepComplete],
  );

  if (state.isCompleted) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {trackConfig.trackName} abgeschlossen!
        </h2>
        <p className="text-gray-600">Alle Schritte erfolgreich durchlaufen.</p>
      </div>
    );
  }

  if (!currentStep) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Fehler: Schritt nicht gefunden</p>
      </div>
    );
  }

  const StepComponent = currentStep.component;

  return (
    <div className="step-engine">
      <StepComponent
        onNext={handleNext}
        onBack={handleBack}
        onComplete={handleStepComplete}
        stepData={state.stepData[currentStep.id]}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
      />
    </div>
  );
};

export default StepEngine;
