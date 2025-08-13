import React from 'react';
import { Text } from '@ui/Typography';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center space-x-2">
      <Text as="span" variant="small" className="text-gray-900 mr-2">
        Onboarding
      </Text>
      <Text as="span" variant="small" className="text-gray-600 mr-3">
        Schritt {currentStep} von {totalSteps}
      </Text>
      <div className="flex space-x-1">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div
              key={stepNumber}
              className={`w-8 h-2 rounded-full transition-colors duration-300 ${
                isCompleted ? 'bg-[#009e82]' : isCurrent ? 'bg-[#009e82]' : 'bg-gray-200'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;
