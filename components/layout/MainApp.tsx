/**
 * 🚀 NAVAA.AI DEVELOPMENT STANDARDS
 *
 * This file follows navaa.ai development guidelines:
 * 📋 CONTRIBUTING.md - Contribution standards and workflow
 * 📚 docs/navaa-development-guidelines.md - Complete development standards
 *
 * KEY STANDARDS FOR THIS FILE:
 * ✅ Stability First - Never change working features without clear reason
 * ✅ Security First - JWT authentication, RLS compliance
 * ✅ Main App Layout - Core application structure and routing
 * ✅ Component Composition - Proper layout and header integration
 * ✅ Responsive Design - Mobile-first approach
 * ✅ Performance - Optimized rendering and state management
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */
import React from 'react';
import UnifiedHeader from './UnifiedHeader';
import HeroBanner from '../sections/HeroBanner';
import TargetAudienceSection from '../sections/TargetAudienceSection';
import TestimonialSection from '../sections/TestimonialSection';
import CredentialsSection from '../sections/CredentialsSection';
// import MetricsSection from './MetricsSection'; // Auskommentiert - Metriken noch nicht verfügbar
import BenefitOverview from '../sections/BenefitOverview';
import FAQSection from '../sections/FAQSection';
import StickyCTA from '../ui/StickyCTA';
import Footer from './Footer';
import ErrorBoundary from '../ui/ErrorBoundary';

export default function MainApp() {
  return (
    <div className="navaa-page navaa-bg-primary min-h-screen flex flex-col">
      <UnifiedHeader variant="marketing" />
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
      {/* <MetricsSection /> */} {/* Auskommentiert - Metriken noch nicht verfügbar */}
      <div id="faq">
        <FAQSection />
      </div>
      <Footer />
      <StickyCTA />
    </div>
  );
}
