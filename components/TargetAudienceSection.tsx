import React from 'react';

// TargetAudienceSection.tsx
// Displays target audience cards early in the user journey to help visitors self-identify
export default function TargetAudienceSection() {
  const targetGroups = [
    {
      title: "💼 Berater & Strategieteams",
      status: "Live",
      statusColor: "bg-green-100 text-green-800",
      description: "navaa trainiert strategisches Denken und kommunikative Fähigkeiten im Stil eines Expert Partners in der Beratung.",
      benefits: [
        "Strukturierte Problemanalyse",
        "Executive Communication",
        "Stakeholder Management"
      ]
    },
    {
      title: "🛠️ Produktmanager & Product Owner",
      status: "In Vorbereitung",
      statusColor: "bg-yellow-100 text-yellow-800",
      description: "navaa trainiert deine Produktmanagement Skills und den Dialog mit technischen Teams und klassischen Stakeholdern.",
      benefits: [
        "Product Strategy",
        "Cross-functional Leadership",
        "Technical Communication"
      ]
    }
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Für wen ist navaa <span className="text-[#00bfae]">entwickelt</span>?
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          navaa ist speziell für Führungskräfte und Entscheidungsträger konzipiert, 
          die ihre strategischen Denkfähigkeiten systematisch verbessern möchten.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {targetGroups.map((group, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{group.title}</h3>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${group.statusColor}`}>
                {group.status}
              </span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              {group.description}
            </p>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900">Key Skills:</h4>
              <ul className="space-y-1">
                {group.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="text-xs text-gray-600 flex items-center">
                    <span className="text-[#00bfae] mr-2">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        
        {/* CTA Card als sechste Karte */}
        <div className="bg-[#00bfae] rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow text-white flex flex-col justify-center">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-3">
              🎯 Erkennst du dich wieder?
            </h3>
            <p className="text-sm opacity-90 mb-4 leading-relaxed">
              Egal in welcher Rolle - navaa hilft dir dabei, strukturierter zu denken, bessere Entscheidungen zu treffen und klarer zu kommunizieren.
            </p>
            <a 
              href="/chat" 
              className="inline-flex items-center bg-white text-[#00bfae] font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm"
            >
              🚀 Jetzt bewerben
            </a>
          </div>
        </div>
      </div>
      
      {/* Future Target Groups */}
      <div className="text-center mt-8">
        <p className="text-gray-600">
          Weitere Zielgruppen in Vorbereitung: Kaufmännische Leitung, Technische Leiter/CTOs und Customer Service Mitarbeiter
        </p>
      </div>
    </section>
  );
}
