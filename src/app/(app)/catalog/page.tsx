import { createServerClient } from '@/lib/db';
import { CourseCard } from '@/shared/ui/components/course-card';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'Guten Morgen';
  if (hour >= 11 && hour < 17) return 'Guten Tag';
  if (hour >= 17 && hour < 22) return 'Guten Abend';
  return 'Eine produktive Nacht';
};

export default async function CatalogPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const rawFirstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Benutzer';
  const firstName = rawFirstName.charAt(0).toUpperCase() + rawFirstName.slice(1).toLowerCase();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <h1 className="text-3xl lg:text-4xl font-bold text-navaa-gray-900 mb-2">
        {getGreeting()}, {firstName}
      </h1>
      <p className="text-xl text-navaa-gray-700 mb-24">
        Bereit für den nächsten Schritt? Wähle einen Kurs aus oder lerne in deinem letzten Modul
        weiter.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
        <CourseCard
          title="The Strategy Track"
          description="Strategisches Denken & Executive Decision Making für Führungskräfte."
          imageUrl="/images/courses/strategy-track.png"
          buttonText="Kurs starten"
          href="/tracks/strategy"
        />
        <CourseCard
          title="The Product Manager Track"
          description="Produktstrategie & Stakeholder Management."
          imageUrl="/images/courses/po-track.png"
          buttonText="Kurs starten"
          href="/tracks/product-manager"
        />
        <CourseCard
          title="The CFO Track"
          description="Finanzielle Führung & Strategische Entscheidungsfindung."
          imageUrl="/images/courses/cfo-track.png"
          buttonText="Kurs starten"
          href="/tracks/cfo"
        />
      </div>
    </div>
  );
}
