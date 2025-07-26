import React from 'react';
import UnifiedHeader from './UnifiedHeader';
import HeroBanner from './HeroBanner';
import TargetAudienceSection from './TargetAudienceSection';
import TestimonialSection from './TestimonialSection';
import CredentialsSection from './CredentialsSection';
// import MetricsSection from './MetricsSection'; // Auskommentiert - Metriken noch nicht verfügbar
import BenefitOverview from './BenefitOverview';
import FAQSection from './FAQSection';
import StickyCTA from './StickyCTA';
import Footer from './Footer';


const MainApp: React.FC = () => {
  return (
    <div>
      <UnifiedHeader variant="marketing" />

      <HeroBanner />
      <CredentialsSection />
      <TargetAudienceSection />
      <BenefitOverview />
      <TestimonialSection />
      {/* <MetricsSection /> */} {/* Auskommentiert - Metriken noch nicht verfügbar */}
      <FAQSection />
      <Footer />
      <StickyCTA />
    </div>
  );
};

export default MainApp;
