import React from 'react';
import StepEngine from '../step-engine/StepEngine';
import { TrackConfiguration } from '../step-engine/types/step-engine.types';

interface OnboardingContainerProps {
  trackConfig: TrackConfiguration;
  onComplete?: () => void;
}

const OnboardingContainer: React.FC<OnboardingContainerProps> = ({ trackConfig, onComplete }) => {
  const handleJourneyComplete = (allData: Record<string, any>) => {
    console.log('Onboarding completed with data:', allData);
    onComplete?.();
  };

  return (
    <div className="onboarding-container">
      <StepEngine
        trackConfig={trackConfig}
        onJourneyComplete={handleJourneyComplete}
        allowSkip={true}
      />
    </div>
  );
};

export default OnboardingContainer;
