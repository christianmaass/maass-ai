import React, { useState, useEffect } from 'react';
import { Heading, Text } from '@ui/Typography';

interface StepWrapperProps {
  stepNumber: number;
  title: string;
  icon: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack: () => void;
  canProceed?: boolean;
  nextButtonText?: string;
}

const StepWrapper: React.FC<StepWrapperProps> = ({
  stepNumber,
  title,
  icon,
  children,
  onNext,
  onBack,
  canProceed = true,
  nextButtonText,
}) => {
  // Always show sticky navigation for clean UX
  // No scroll detection needed - sticky is always visible

  const getNextButtonText = () => {
    if (nextButtonText) return nextButtonText;
    return stepNumber === 5 ? 'Abschließen' : 'Weiter →';
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">{icon}</div>
        <Heading variant="h1" className="mb-2">
          {title}
        </Heading>
        <Text variant="small" className="text-gray-500 font-medium">
          Schritt {stepNumber} von 5
        </Text>
      </div>

      {/* Step Content */}
      <div className="mb-8">{children}</div>

      {/* Always Visible Sticky Navigation - Clean UX without redundancy */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 transition-all duration-300">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <button
              onClick={onBack}
              disabled={stepNumber === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                stepNumber === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              ← Zurück
            </button>

            <Text variant="small" className="text-gray-500 font-medium">
              Schritt {stepNumber} von 5
            </Text>

            <button
              onClick={onNext}
              disabled={!canProceed}
              className={`px-6 py-2 font-bold rounded-lg transition-colors ${
                canProceed
                  ? 'bg-[#00bfae] text-white hover:bg-[#009688]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {getNextButtonText()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepWrapper;
