import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/shared/ui/Button';
import { CourseCard } from '@/shared/ui/components/course-card';
import { CredentialCard } from '@/shared/ui/components/credential-card';
import { Icon } from '@/shared/ui/components/Icon';

export default function Home() {
  return (
    <div className="bg-navaa-warm-beige">
      {/* Hero Section */}
      <section className="relative bg-navaa-warm-beige pt-16 lg:pt-24 overflow-hidden flex items-end">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-end justify-between">
          {/* Left side - Text content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left z-10 pb-16 lg:pb-24">
            <h1 className="text-4xl lg:text-5xl font-bold text-navaa-gray-900 mb-6">
              navaa - Learn to Solve Strategic Challenges Yourself
            </h1>

            <p className="text-xl text-navaa-gray-700 mb-8 max-w-2xl mx-auto lg:mx-0">
              <span className="text-navaa-accent font-bold">AI Accelerated Enablement:</span> navaa
              befähigt Unternehmer und Führungskräfte, strategische Herausforderungen eigenständig
              zu lösen - und spart teure Beratung, wo sie nicht gebraucht wird.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-navaa-accent hover:bg-navaa-accent/90 text-white px-8 py-3 text-lg"
                >
                  Jetzt einschreiben
                </Button>
              </Link>

              <Link href="/catalog">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-navaa-gray-600 text-navaa-gray-700 hover:bg-navaa-gray-700 hover:text-navaa-warm-beige px-8 py-3 text-lg"
                >
                  Kurse entdecken
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side - Hero image */}
          <div className="relative w-full lg:w-1/2 h-[400px] lg:h-[500px]">
            <Image
              src="/images/navaa-herobanner.png"
              alt="Navaa Hero Banner"
              fill={true}
              priority={true}
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ objectFit: 'contain', objectPosition: 'bottom' }}
            />
          </div>
        </div>
      </section>

      {/* Credential Section */}
      <section className="py-8 bg-navaa-warm-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center md:justify-items-stretch">
            <CredentialCard
              icon={<Icon name="lightbulb" />}
              title="Personalisierte Lernpfade"
              description="Maßgeschneiderte Lerninhalte basierend auf deinen Zielen"
            />
            <CredentialCard
              icon={<Icon name="book" />}
              title="KI-Analyse deiner Denkprozesse"
              description="Detailliertes Feedback zu deiner strategischen Herangehensweise"
            />
            <CredentialCard
              icon={<Icon name="lightning" />}
              title="Externe Beratungskosten sparen"
              description="Entwickle interne Kompetenzen statt teure Berater zu beauftragen"
            />
          </div>
        </div>
      </section>

      {/* Kursauswahl Section */}
      <section className="py-16 bg-navaa-warm-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-navaa-gray-900 mb-4">
                navaa entwickelt <span className="text-navaa-accent">Führungskräfte</span> gezielt
                weiter
              </h2>
              <p className="text-navaa-gray-700 max-w-2xl">
                Personalisierte Lernpfade und Skill Tracks - passgenau für deine strategischen
                Herausforderungen und Karriereziele
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="p-3 rounded-full border border-navaa-gray-300 hover:border-navaa-accent hover:text-navaa-accent transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button className="p-3 rounded-full border border-navaa-gray-300 hover:border-navaa-accent hover:text-navaa-accent transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <CourseCard
              title="The Strategy Track"
              description="Strategisches Denken & Executive Decision Making für Führungskräfte, die komplexe Geschäftsentscheidungen treffen müssen."
              imageUrl="/images/courses/strategy-track.png"
              buttonText="Mehr erfahren"
              href="/tracks/strategy"
            />
            <CourseCard
              title="The Product Manager Track"
              description="Produktstrategie & Stakeholder Management für Product Leader in dynamischen Märkten."
              imageUrl="/images/courses/po-track.png"
              buttonText="Mehr erfahren"
              href="/tracks/product-manager"
            />
            <CourseCard
              title="The CFO Track"
              description="Finanzielle Führung & Strategische Entscheidungsfindung für Finance Leader der nächsten Generation."
              imageUrl="/images/courses/cfo-track.png"
              buttonText="Mehr erfahren"
              href="/tracks/cfo"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
