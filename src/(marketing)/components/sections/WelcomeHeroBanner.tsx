import React from 'react';
import Image from 'next/image';
import { Heading, Text } from '@ui/Typography';
import { MODULES } from '@lib/assetPaths';

interface MarketingWelcomeHeroBannerProps {
  variant?: 'dashboard' | 'onboarding';
  firstName?: string;
}

// Marketing WelcomeHeroBanner
// Public-facing variant (no personalization). Accepts the same props for compatibility but ignores them.
export default function WelcomeHeroBanner(_props: MarketingWelcomeHeroBannerProps) {
  return (
    <section className="w-full mb-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center text-left pt-8 pb-0">
        <div className="flex-1 flex flex-col items-start justify-center p-6">
          <Heading variant="h1" className="mb-3">
            Welcome to navaa
          </Heading>
          <Text variant="body" as="p" className="text-gray-700 mb-4">
            Starte jetzt deine Lernreise – verständlich, praxisnah und motivierend.
          </Text>
        </div>
        <div className="flex-1 flex items-center justify-center mt-4 md:mt-0">
          <div className="w-full max-w-lg">
            <div className="relative w-full h-48">
              <Image
                src={MODULES.onboarding}
                alt="Onboarding – Deine Lernreise beginnt"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
