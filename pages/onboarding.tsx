import { useEffect } from 'react';
import { useRouter } from 'next/router';

const OnboardingRedirect: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new onboarding route
    router.replace('/tracks/strategy/onboarding');
  }, [router]);

  return (
    <div className="min-h-screen bg-navaa-bg-primary flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#009e82] mx-auto mb-4"></div>
        <p className="text-gray-600">Weiterleitung zum Onboarding...</p>
      </div>
    </div>
  );
};

export default OnboardingRedirect;
