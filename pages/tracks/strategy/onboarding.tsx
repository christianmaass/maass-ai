import React from 'react';
import Image from 'next/image';
import OnboardingContainer from '../../../components/tracks/strategy/onboarding/OnboardingContainer';

const OnboardingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-navaa-bg-primary">
      {/* Simple Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <Image
              src="/assets/navaa-logo.png"
              alt="navaa"
              width={120}
              height={32}
              className="h-8 w-auto"
              priority
            />
            <span className="ml-3 text-lg font-semibold text-gray-900">Onboarding</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <OnboardingContainer />
      </div>
    </div>
  );
};

export default OnboardingPage;
