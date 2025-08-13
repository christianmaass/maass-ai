/**
 * 🚀 NAVAA.AI DEVELOPMENT STANDARDS
 *
 * This file follows navaa.ai development guidelines:
 * 📋 CONTRIBUTING.md - Contribution standards and workflow
 * 📚 docs/navaa-development-guidelines.md - Complete development standards
 *
 * KEY STANDARDS FOR THIS FILE:
 * ✅ Stability First - Never change working features without clear reason
 * ✅ Security First - JWT authentication, RLS compliance
 * ✅ Welcome Banner - Personalized user experience
 * ✅ User Segmentation - Different content for onboarding vs dashboard
 * ✅ Responsive Design - 50% height, mobile-optimized
 * ✅ Branding - Consistent navaa visual identity
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */
import React from 'react';
import Image from 'next/image';
import { getTimeOfDayGreeting, formatGreeting } from '@lib/greeting';
import { Heading, Text } from '@ui/Typography';
import { MODULES } from '@lib/assetPaths';

interface WelcomeHeroBannerProps {
  variant: 'dashboard' | 'onboarding';
  firstName?: string;
}

// WelcomeHeroBanner.tsx
// Smaller hero banner for dashboard and onboarding pages with personalized welcome
export default function WelcomeHeroBanner({ variant, firstName = 'User' }: WelcomeHeroBannerProps) {
  const isDashboard = variant === 'dashboard';
  const greeting = formatGreeting(getTimeOfDayGreeting(new Date()), firstName);

  return (
    <section className="w-full mb-6">
      {/* 50% height of main hero banner - using pt-8 pb-0 instead of pt-16 pb-0 */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center text-left pt-8 pb-0">
        <div className="flex-1 flex flex-col items-start justify-center p-6">
          {isDashboard ? (
            // Dashboard: Welcome back message with motivational stats
            <div>
              {/* Styleguide Exception: Personal greeting size restored to pre-standardization (smaller than homepage hero) */}
              <Heading variant="display" className="mb-6 text-4xl md:text-5xl leading-tight">
                {greeting}!
              </Heading>
              {/* Motivational Stats removed for lean UI */}
              {/* Motivational CTA */}
              <Text variant="body" as="p" className="text-gray-700 mb-4">
                Bereit für den nächsten Schritt? Wähle einen Kurs aus oder lerne in deinem letzten
                Modul weiter.
              </Text>
            </div>
          ) : (
            // Onboarding: Welcome + journey message
            <div>
              <Heading variant="h1" className="mb-2">
                Welcome <span className="text-[#009e82]">{firstName}</span>!
              </Heading>
              <Heading variant="h2">
                Your learning journey is about to start <span className="text-[#009e82]">NOW</span>!
              </Heading>
            </div>
          )}
        </div>

        {!isDashboard && (
          <div className="flex-1 flex items-center justify-center mt-4 md:mt-0">
            <div className="w-full max-w-lg">
              <div className="relative w-full h-48">
                <Image
                  src={MODULES.onboarding}
                  alt="Onboarding - Deine Lernreise beginnt"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
