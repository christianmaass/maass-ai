import React from 'react';
import Link from 'next/link';
import { Heading, Text } from '@ui/Typography';
import Image from 'next/image';
import LearnLoopImg from '@marketing/assets/navaa-learn-loop.png';

// HeroBanner.tsx
// Main landing page hero section
export default function HeroBanner() {
  return (
    <section className="w-full bg-gradient-to-b from-[#f6f4f0] to-[#f2efea] mb-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center text-left pt-16 pb-0">
        <div className="flex-1 flex flex-col items-start justify-center p-6">
          <Heading
            variant="display"
            className="mb-6 text-5xl md:text-6xl lg:text-7xl leading-tight"
          >
            navaa - Learn to Solve it Yourself
          </Heading>
          <Text variant="body" as="p" className="text-gray-700 mb-8 leading-relaxed max-w-2xl">
            <span className="font-bold text-[#009e82]">AI Accelerated Enablement:</span> navaa
            befähigt Unternehmer und Führungskräfte, strategische Herausforderungen eigenständig zu
            lösen - und spart teure Beratung, wo sie nicht gebraucht wird.
          </Text>

          <Link
            href="/chat"
            className="inline-flex items-center px-8 py-4 bg-[#009e82] text-white font-bold rounded-xl shadow-lg hover:bg-[#007a66] transition-colors text-lg"
          >
            <span className="mr-2">🚀</span>
            Für die Testphase bewerben
          </Link>

          {/* Trust indicators */}
          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="text-green-500 mr-1">✓</span>
              Kostenlose Testphase
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-1">✓</span>
              Keine Kreditkarte erforderlich
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-1">✓</span>
              Sofortiger Zugang
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center mt-8 md:mt-0">
          <div className="w-full max-w-2xl">
            <Image
              src={LearnLoopImg}
              alt="Der navaa Lern-Loop - Analyse, Strukturierung, Reflexion und Personalisierte Weiterentwicklung"
              width={1024}
              height={576}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
