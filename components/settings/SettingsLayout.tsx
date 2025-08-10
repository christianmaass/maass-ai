import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SettingsHeader from './SettingsHeader';
import SettingsSidebar from './SettingsSidebar';
import ProfileSection from './ProfileSection';
import PricingSection from './PricingSection';
import AccountSection from './AccountSection';

type SettingsSection = 'profile' | 'pricing' | 'account';

const SettingsLayout: React.FC = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');

  // Check URL parameters to set initial section
  useEffect(() => {
    const { section } = router.query;
    if (section === 'pricing') {
      setActiveSection('pricing');
    } else if (section === 'account') {
      setActiveSection('account');
    } else {
      setActiveSection('profile');
    }
  }, [router.query]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'pricing':
        return <PricingSection />;
      case 'account':
        return <AccountSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SettingsHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-3">
            <SettingsSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
          </div>

          {/* Mobile Section Selector */}
          <div className="lg:hidden mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="grid grid-cols-3">
                <button
                  onClick={() => setActiveSection('profile')}
                  className={`py-3 px-4 text-sm font-medium rounded-l-lg transition-colors ${
                    activeSection === 'profile'
                      ? 'bg-[#00bfae] text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Profil
                </button>
                <button
                  onClick={() => setActiveSection('pricing')}
                  className={`py-3 px-4 text-sm font-medium transition-colors ${
                    activeSection === 'pricing'
                      ? 'bg-[#00bfae] text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Preise
                </button>
                <button
                  onClick={() => setActiveSection('account')}
                  className={`py-3 px-4 text-sm font-medium rounded-r-lg transition-colors ${
                    activeSection === 'account'
                      ? 'bg-[#00bfae] text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Account
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
