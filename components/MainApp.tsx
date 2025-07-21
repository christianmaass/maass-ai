import React from 'react';
import MainAppHeader from './MainAppHeader';
import HeroBanner from './HeroBanner';
import ContentSections from './ContentSections';
import Footer from './Footer';

const MainApp: React.FC = () => {
  return (
    <div>
      <MainAppHeader />
      <HeroBanner />
      <ContentSections />
      <Footer />
    </div>
  );
};

export default MainApp;
