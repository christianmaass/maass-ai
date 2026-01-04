import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/shared/ui/Button';
import { CredentialCard } from '@/shared/ui/components/credential-card';
import { Icon } from '@/shared/ui/components/Icon';
import { WhoThisIsForSection } from '@/components/WhoThisIsForSection';

export default function Home() {
  return (
    <div className="bg-navaa-warm-beige">
      {/* Hero Section */}
      <section className="relative bg-navaa-warm-beige pt-16 lg:pt-24 overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            {/* Left side */}
            <div className="w-full lg:w-1/2 text-left z-10 lg:translate-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-navaa-gray-900 mb-6">
                Using AI to think better – not to think less
              </h1>

              <p className="text-xl text-navaa-gray-700 mb-8">
                An experimental training ground for strategic thinking and decision-making.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-start">
                <a href="mailto:christian@christianmaass.com">
                  <Button
                    size="lg"
                    className="text-white px-8 py-3 text-lg bg-[#42A5F5] hover:bg-[#1E88E5] transition-colors"
                  >
                    Request access
                  </Button>
                </a>
              </div>
            </div>

            {/* Right side */}
            <div className="relative w-full lg:w-1/2 h-[400px] lg:h-[500px] self-end">
              <Image
                src="/images/navaa-herobanner.png"
                alt="Better decisions under uncertainty"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain object-bottom"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Credential Section */}
      <section className="py-8 bg-navaa-warm-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center md:justify-items-stretch items-start">
            <CredentialCard
              icon={<Icon name="lightbulb" />}
              title="Make your thinking explicit."
              description="Assumptions, trade-offs, and decisions must be visible — not implied."
            />
            <CredentialCard
              icon={<Icon name="book" />}
              title="Slow down before you decide."
              description="Clarity comes from structure, not speed."
            />
            <CredentialCard
              icon={<Icon name="lightning" />}
              title="Own the final judgment."
              description="AI challenges your reasoning — responsibility remains yours."
            />
          </div>
        </div>
      </section>

      {/* Problem, Prinzip, Arbeitsweise Section */}
      <section id="why-navaa" className="py-16 bg-navaa-warm-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-4xl font-bold text-navaa-gray-900 mb-4">
              The thinking behind navaa
            </h2>
            <p className="text-xl text-navaa-gray-700">
              A structured way to sharpen strategic thinking with AI — without outsourcing judgment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 justify-items-center">
            {/* Problem */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden w-full max-w-sm">
              <div className="relative aspect-square bg-blue-600">
                <Image
                  src="/images/ai-risk-outsource-thinking.png"
                  alt="The AI Risk - Outsource thinking"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 384px"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-navaa-gray-900 mb-3">
                  Problem
                </h3>
                <p className="text-navaa-gray-700 leading-relaxed">
                  AI makes answers cheap – but often weakens one's own thinking.
                  Judgment is silently outsourced.
                </p>
              </div>
            </div>

            {/* Prinzip */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden w-full max-w-sm">
              <div className="relative aspect-square bg-purple-600">
                <Image
                  src="/images/ai-opportunity-sharpen-thinking.png"
                  alt="The AI Opportunity - Sharpen your thinking"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 384px"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-navaa-gray-900 mb-3">
                  Solution
                </h3>
                <p className="text-navaa-gray-700 leading-relaxed">
                  navaa exists as a counterpoint, leveraging AI to sharpen real-world thinking and judgment.
                </p>
              </div>
            </div>

            {/* Arbeitsweise */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden w-full max-w-sm">
              <div className="relative aspect-square bg-gray-700">
                <Image
                  src="/images/consulting-mind.png"
                  alt="The Consulting Mind"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 384px"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-navaa-gray-900 mb-3">
                  Application
                </h3>
                <p className="text-navaa-gray-700 leading-relaxed">
                  You work on problems like a consultant:
                  clarify the question, create structure, test assumptions, weigh options –
                  AI serves as a sparring partner, not as a replacement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For Section */}
      <WhoThisIsForSection />

    </div>
  );
}
