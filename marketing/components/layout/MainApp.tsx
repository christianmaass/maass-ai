import React from 'react';
import Header from '@layout/basic/Header';
import HeroBanner from '@/marketing/sections/HeroBanner';
import CredentialsSection from '../sections/CredentialsSection';
import FAQSection from '@/marketing/sections/FAQSection';
import TargetAudienceSection from '../sections/TargetAudienceSection';
import TestimonialSection from '../sections/TestimonialSection';
import BenefitOverview from '../sections/BenefitOverview';
import StickyCTA from '@components/ui/StickyCTA';
import Footer from '@layout/basic/Footer';
import ErrorBoundary from '@layout/basic/ErrorBoundary';

export default function MainApp() {
  return (
    <div className="navaa-page navaa-bg-primary min-h-screen flex flex-col">
      <Header variant="marketing" />
      <HeroBanner />
      <CredentialsSection />
      <div id="target-audience">
        <TargetAudienceSection />
      </div>
      <ErrorBoundary level="feature">
        <div id="benefits">
          <BenefitOverview />
        </div>
      </ErrorBoundary>
      <TestimonialSection />
      {/* <MetricsSection /> */}
      <div id="faq">
        <FAQSection />
      </div>
      <Footer />
      <StickyCTA />
    </div>
  );
}
