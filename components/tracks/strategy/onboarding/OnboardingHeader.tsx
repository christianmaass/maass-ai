import React from 'react';
import ProgressIndicator from './ProgressIndicator';

interface OnboardingHeaderProps {
  onBackToCourse?: () => void;
  currentStep: number;
  totalSteps: number;
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  onBackToCourse,
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          {onBackToCourse && (
            <button
              type="button"
              onClick={onBackToCourse}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Zur Kursübersicht
            </button>
          )}
          <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
        </div>
      </div>
    </div>
  );
};

export default OnboardingHeader;
