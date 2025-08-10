import React from 'react';

const PricingSection: React.FC = () => {
  const plans = [
    {
      name: 'Free',
      price: '0€',
      period: 'kostenlos',
      features: [
        '3 Cases pro Monat',
        'Basis-Feedback',
        'Community-Support',
        'Grundlegende Lernpfade',
        'Mobile App',
      ],
      buttonText: 'Aktueller Plan',
      current: true,
      popular: false,
    },
    {
      name: 'Plus',
      price: '29€',
      period: 'pro Monat',
      features: [
        '50 Cases pro Monat',
        'Detailliertes AI-Feedback',
        'Prioritäts-Support',
        'Alle Lernpfade',
        'Fortschritts-Analytics',
      ],
      buttonText: 'Upgrade',
      current: false,
      popular: true,
    },
    {
      name: 'Business',
      price: '99€',
      period: 'pro Monat',
      features: [
        'Unbegrenzte Cases',
        'Premium AI-Feedback',
        'Persönlicher Support',
        'Team-Management',
        'Custom Branding',
      ],
      buttonText: 'Upgrade',
      current: false,
      popular: false,
    },
    {
      name: 'Bildungsträger',
      price: 'Auf Anfrage',
      period: 'Sonderkonditionen',
      features: [
        'Unbegrenzte Cases',
        'Gruppen-Management',
        'Lehrplan-Integration',
        'Dedicated Support',
        'Reporting & Analytics',
      ],
      buttonText: 'Kontakt',
      current: false,
      popular: false,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Preise & Pakete</h2>
        <p className="text-gray-600">Wählen Sie das passende Paket für Ihre Bedürfnisse</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-lg border-2 p-6 flex flex-col h-full ${
              plan.current
                ? 'border-primary bg-primary/5'
                : plan.popular
                  ? 'border-primary shadow-lg'
                  : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-3 py-1 text-sm font-medium rounded-full">
                  Beliebt
                </span>
              </div>
            )}

            {plan.current && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-3 py-1 text-sm font-medium rounded-full">
                  Aktuell
                </span>
              </div>
            )}

            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                {plan.price !== 'Auf Anfrage' && (
                  <span className="text-gray-600 ml-1">/{plan.period}</span>
                )}
              </div>
              {plan.price === 'Auf Anfrage' && (
                <span className="text-sm text-gray-600">{plan.period}</span>
              )}
            </div>

            <ul className="space-y-3 mb-6 flex-1">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-[#00bfae] mt-0.5 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                plan.current
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : plan.popular
                    ? 'bg-[#00bfae] text-white hover:bg-[#00a89a]'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
              disabled={plan.current}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Nicht sicher welches Paket?</h3>
        <p className="text-blue-800 text-sm">
          Starten Sie mit dem kostenlosen Plan und upgraden Sie jederzeit. Alle Pläne beinhalten
          eine 14-tägige Geld-zurück-Garantie.
        </p>
      </div>
    </div>
  );
};

export default PricingSection;
