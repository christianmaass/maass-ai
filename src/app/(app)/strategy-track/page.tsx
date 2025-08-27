import { HeroBannerWithImage, CTAButton } from '@/shared/ui';
import { DynamicBreadcrumb } from '@/shared/ui/components/dynamic-breadcrumb';
import Image from 'next/image';

export default function StrategyTrackPage() {
  return (
    <div className="min-h-screen bg-navaa-warm-beige">
      {/* Breadcrumb */}
      <div className="bg-navaa-warm-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <DynamicBreadcrumb basePath="/strategy-track" activeColor="text-navaa-accent" />
        </div>
      </div>

      {/* Main Content */}
      <div>
        {/* Hero Section */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <HeroBannerWithImage
              title="Strategiearbeit ist wie Sport: Beherrsche die Methodik, meistere den Wettbewerb."
              text="Schritt für Schritt trainiert, sitzt diese Methodik im Blut – und macht dich schneller, klarer und überzeugender in jeder strategischen Situation. [Vorname], damit starten wir jetzt!"
              imageUrl="/images/strategy-tennis.png"
              imageAlt="Strategy Tennis Illustration"
            />
          </div>
        </section>

        {/* Track Modules Section - Placeholder for future implementation */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left mb-12">
              <h2 className="text-3xl font-bold text-navaa-gray-900 mb-4">
                Einführung in die Strategieberatung
              </h2>
              <p className="text-xl text-navaa-gray-700 max-w-3xl">
                In diesen drei Modulen lernst du die absoluten Basics: In welchen Schritt gehe ich
                vor? Wie werden die Schritt bewertet? Was sind wiederkehrende Muster?
              </p>
            </div>

            {/* Module Cards - Future TrackModuleCatalog component */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {/* Onboarding Module */}
              <div
                className="bg-white shadow-md hover:shadow-lg transition-all duration-200 flex flex-col"
                style={{ borderRadius: '0.75rem', overflow: 'hidden' }}
              >
                {/* Module Image */}
                <div className="relative aspect-square w-full">
                  <Image
                    src="/images/einführung-strategy-5-steps.png"
                    alt="5-Schritte-Fahrplan visual"
                    fill={true}
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6 text-center flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-semibold text-navaa-gray-900 mb-2">
                    <span className="text-navaa-accent font-bold">1.</span> Der 5-Schritte-Fahrplan:
                    Systematisch zur Empfehlung
                  </h3>
                  <p className="text-navaa-gray-600 text-sm mb-6">
                    Lerne die 5 Grundschritte der strategischen Fallbearbeitung kennen und wende sie
                    in der Praxis an.
                  </p>
                  <CTAButton text="Modul starten" targetUrl="/strategy-track/onboarding" />
                </div>
              </div>

              {/* Module 2 */}
              <div
                className="bg-white shadow-md hover:shadow-lg transition-all duration-200 flex flex-col"
                style={{ borderRadius: '0.75rem', overflow: 'hidden' }}
              >
                {/* Module Image */}
                <div className="relative aspect-square w-full">
                  <Image
                    src="/images/einführung-strategy-werkzeuge.png"
                    alt="Basis-Typologie visual"
                    fill={true}
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6 text-center flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-semibold text-navaa-gray-900 mb-2">
                    <span className="text-navaa-accent font-bold">2.</span> Die Basis-Typologie:
                    Erkenne den Falltyp, wähle das Werkzeug
                  </h3>
                  <p className="text-navaa-gray-600 text-sm mb-6">
                    Bald verfügbar: Vertiefte strategische Konzepte und komplexe Case Studies.
                  </p>
                </div>
              </div>

              {/* Module 3 */}
              <div
                className="bg-white shadow-md hover:shadow-lg transition-all duration-200 flex flex-col"
                style={{ borderRadius: '0.75rem', overflow: 'hidden' }}
              >
                {/* Module Image */}
                <div className="relative aspect-square w-full">
                  <Image
                    src="/images/einführung-strategy-bewertung.png"
                    alt="Bewertung visual"
                    fill={true}
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6 text-center flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-semibold text-navaa-gray-900 mb-2">
                    <span className="text-navaa-accent font-bold">3.</span> Logik, Klarheit, Impact:
                    So misst navaa den Erfolg
                  </h3>
                  <p className="text-navaa-gray-600 text-sm mb-6">
                    Verinnerliche, worauf es ankommt, um zu persönlich zu wachsen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
