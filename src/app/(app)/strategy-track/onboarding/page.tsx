import {
  HeroBannerWithImage,
  StepOverview,
  CriteriaScorecard,
  CTAButton,
  ProgressBar,
} from '@/shared/ui';
import { DynamicBreadcrumb } from '@/shared/ui/components/dynamic-breadcrumb';
import { STRATEGY_ONBOARDING_STEPS } from '@/config/onboarding-steps.config';

export default function StrategyOnboardingPage() {
  const progressData = {
    total_steps: 5,
    current_step: 0,
  };

  const steps = STRATEGY_ONBOARDING_STEPS;

  const criteria = [
    {
      name: 'Problemstrukturierung & Klarheit',
      description: 'Wie gehst du an ein komplexes Problem heran?',
    },
    {
      name: 'Analytische Exzellenz & Faktenorientierung',
      description: 'Wie sicher bist du im Umgang mit Fakten?',
    },
    {
      name: 'Wirtschaftliches & strategisches Denken',
      description: 'Verstehst du den Business-Kontext?',
    },
    {
      name: 'Empfehlung & Entscheidungskompetenz',
      description: 'Triffst du eine klare Entscheidung?',
    },
    {
      name: 'Kommunikation & Executive Presence',
      description: 'Kannst du überzeugen?',
    },
  ];

  return (
    <div className="min-h-screen bg-navaa-warm-beige">
      {/* Breadcrumb and Progress Bar */}
      <div className="bg-navaa-warm-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <DynamicBreadcrumb basePath="/strategy-track" activeColor="text-navaa-accent" />
            <ProgressBar data={progressData} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div>
        {/* Hero Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <HeroBannerWithImage
              title="Strategiearbeit ist wie Sport: Beherrsche die Methodik, meistere den Wettbewerb."
              text="Schritt für Schritt trainiert, sitzt diese Methodik im Blut – und macht dich schneller, klarer und überzeugender in jeder strategischen Situation."
              imageUrl="/images/strategy-tennis.png"
              imageAlt="Strategy Tennis Illustration"
            />
          </div>
        </section>

        {/* Five Steps Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StepOverview title="Die 5 Schritte der Fallbearbeitung" steps={steps} />
          </div>
        </section>

        {/* MBB Criteria Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CriteriaScorecard
              title="Deine Performance, transparent bewertet"
              text="Wir bewerten deine Fallbearbeitung anhand der Kriterien, die auch Top-Beratungen wie McKinsey, BCG und Bain nutzen. So siehst du genau, wo du stehst und wo du dich verbessern kannst."
              criteria={criteria}
            />
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <CTAButton
              text="Starte das Training"
              targetUrl="/strategy-track/onboarding/verstehen"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
