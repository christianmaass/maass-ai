import React, { useState } from 'react';
import MainAppHeader from '../components/MainAppHeader';
import Footer from '../components/Footer';
import PaymentModal from '../components/PaymentModal';

const Preise: React.FC = () => {
  // Feature Flag: Payment temporär deaktiviert während Registrierung stabilisiert wird
  const PAYMENT_ENABLED = false;
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    displayName: string;
    price: string;
    priceId?: string;
  } | null>(null);

  const handlePlanSelect = (planName: string, displayName: string, price: string, priceId?: string) => {
    if (!PAYMENT_ENABLED) {
      alert('Die Bezahlfunktion wird bald verfügbar sein. Wir arbeiten gerade an einem stabilen Registrierungsprozess!');
      return;
    }
    setSelectedPlan({ name: planName, displayName, price, priceId });
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe]">
      <MainAppHeader />
      
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        selectedPlan={selectedPlan}
      />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hauptüberschrift */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Starte deine persönliche Weiterentwicklung mit navaa - monatlich kündbar
          </h1>
        </div>

        {/* Pricing Boxen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Free Box */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
            <div className="text-3xl font-bold text-gray-900 mb-6">0,00 EUR</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                <span className="text-gray-700">5 Cases pro Woche</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                <span className="text-gray-700">Grundlegende Bewertung</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                <span className="text-gray-700">Community Support</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                <span className="text-gray-700">Standard Templates</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                <span className="text-gray-700">E-Mail Support</span>
              </li>
            </ul>
            <button 
              onClick={() => handlePlanSelect('Free', 'Free', '0,00 EUR')}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                PAYMENT_ENABLED 
                  ? 'bg-gray-800 text-white hover:bg-gray-900 cursor-pointer' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
              disabled={!PAYMENT_ENABLED}
            >
              {PAYMENT_ENABLED ? 'Jetzt loslegen' : 'Bald verfügbar'}
            </button>
          </div>

          {/* Plus Box */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Plus</h3>
            <div className="text-3xl font-bold text-gray-900 mb-6">EUR 9,90 pro Mitglied/Monat</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                <span className="text-gray-700">25 Cases pro Woche</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                <span className="text-gray-700">Erweiterte Bewertung</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                <span className="text-gray-700">Priority Support</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                <span className="text-gray-700">Premium Templates</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                <span className="text-gray-700">Fortschritts-Analytics</span>
              </li>
            </ul>
            <button 
              onClick={() => handlePlanSelect('Plus', 'Plus', 'EUR 9,90 pro Mitglied/Monat')}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                PAYMENT_ENABLED 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
              disabled={!PAYMENT_ENABLED}
            >
              {PAYMENT_ENABLED ? 'Jetzt loslegen' : 'Bald verfügbar'}
            </button>
          </div>

          {/* Business Box */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Business</h3>
            <div className="text-3xl font-bold text-gray-900 mb-6">Preis auf Anfrage</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                <span className="text-gray-700">Unbegrenzte Cases</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                <span className="text-gray-700">Team Management</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                <span className="text-gray-700">Custom Branding</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                <span className="text-gray-700">API Zugang</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                <span className="text-gray-700">Dedicated Support</span>
              </li>
            </ul>
            <button 
              onClick={() => handlePlanSelect('Business', 'Business', 'Preis auf Anfrage')}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                PAYMENT_ENABLED 
                  ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
              disabled={!PAYMENT_ENABLED}
            >
              {PAYMENT_ENABLED ? 'Jetzt loslegen' : 'Bald verfügbar'}
            </button>
          </div>

          {/* Bildungsträger Box */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Bildungsträger</h3>
            <div className="text-3xl font-bold text-gray-900 mb-6">Preis auf Anfrage</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                <span className="text-gray-700">Bildungsrabatt</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                <span className="text-gray-700">Klassen-Management</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                <span className="text-gray-700">Lehrplan Integration</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                <span className="text-gray-700">Fortschritts-Reports</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                <span className="text-gray-700">Trainer Support</span>
              </li>
            </ul>
            <button 
              onClick={() => handlePlanSelect('Bildungsträger', 'Bildungsträger', 'Preis auf Anfrage')}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                PAYMENT_ENABLED 
                  ? 'bg-purple-600 text-white hover:bg-purple-700 cursor-pointer' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
              disabled={!PAYMENT_ENABLED}
            >
              {PAYMENT_ENABLED ? 'Jetzt loslegen' : 'Bald verfügbar'}
            </button>
          </div>
        </div>

        {/* Feature Vergleichstabelle Platzhalter */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Feature-Vergleich
          </h2>
          <div className="text-center text-gray-500">
            <p className="text-lg">Feature-Vergleichstabelle</p>
            <p className="text-sm mt-2">Wird in einem späteren Schritt implementiert</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Preise;
