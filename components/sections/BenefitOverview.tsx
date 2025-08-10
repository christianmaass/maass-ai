/**
 * 🚀 NAVAA.AI DEVELOPMENT STANDARDS
 *
 * This file follows navaa.ai development guidelines:
 * 📋 CONTRIBUTING.md - Contribution standards and workflow
 * 📚 docs/navaa-development-guidelines.md - Complete development standards
 *
 * KEY STANDARDS FOR THIS FILE:
 * ✅ Stability First - Never change working features without clear reason
 * ✅ Brand Consistency - navaa orange, beige backgrounds, proper typography
 * ✅ Mobile-First - Responsive design with proper breakpoints
 * ✅ Clean Code - TypeScript, semantic HTML, accessibility
 * ✅ Hero Section - Split layout with brand messaging and visual
 * ✅ CTA Optimization - Primary/secondary button hierarchy
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */
import React from 'react';
import Image from 'next/image';
import ResultCard from '../ui/ResultCard';
import { Heading, Text } from '../ui/Typography';

// BenefitOverview.tsx - Hero/USP Section
// Displays navaa value proposition with brand messaging and visual
export default function BenefitOverview() {
  const steps = [
    {
      number: '1.',
      icon: '🎯',
      title: 'Lösen',
      description: 'Stelle dich echten Entscheidungssituationen – angepasst an dein Level.',
    },
    {
      number: '2.',
      icon: '🤖',
      title: 'Feedback erhalten',
      description:
        'Erhalte gezielte KI-Rückmeldung zu deinem Denkprozess – und klare Tipps zur Verbesserung.',
    },
    {
      number: '3.',
      icon: '📈',
      title: 'Fortschritt reflektieren',
      description:
        'Verstehe Muster, verfolge deine Entwicklung – und triff Entscheidungen souveräner.',
    },
  ];

  return (
    <section className="w-full px-6 py-16 bg-navaa-bg-primary">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text-Block (links) */}
          <div className="space-y-8">
            {/* Section-Headline */}
            <Heading variant="h1" className="text-navaa-text-primary leading-tight">
              <span className="text-navaa-orange">
                Denk nicht härter, denk smarter -<br />
                mit System
              </span>
            </Heading>
            <Text variant="body" as="p" className="leading-relaxed text-navaa-text-primary">
              Echte Herausforderungen. Klare Rückmeldung. Sichtbarer Fortschritt.
            </Text>

            {/* 3-Schritte Liste */}
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-navaa-orange/10 rounded-lg flex items-center justify-center text-lg">
                      {step.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <Heading variant="h2" className="mb-1 text-navaa-text-primary">
                      <span className="text-[#009e82]">{step.number}</span> {step.title}
                    </Heading>
                    <Text variant="body" as="p" className="text-gray-600 leading-relaxed">
                      {step.description}
                    </Text>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA-Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#009e82] text-white font-bold rounded-xl shadow-lg hover:bg-[#007a66] transition-colors text-lg"
              >
                Jetzt loslegen
              </a>
            </div>
          </div>

          {/* Visual-Block (rechts) */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg lg:max-w-xl">
              {/* Hero-Visual Container */}
              <div className="relative w-full h-[350px] lg:h-[450px] flex items-center justify-center">
                {/* Hero Visual - navaa-lernansatz.png */}
                <div className="absolute inset-0 left-8 lg:left-12">
                  <Image
                    src="/assets/navaa-lernansatz.png"
                    alt="navaa Lernansatz"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority
                  />
                </div>

                {/* Result Card Overlay */}
                <div className="absolute -bottom-12 -left-12 lg:-bottom-16 lg:-left-16">
                  <ResultCard progress={35} className="transform scale-90 lg:scale-100" />
                </div>
              </div>

              {/* Dekorative Elemente */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-navaa-orange rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-navaa-primary rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
