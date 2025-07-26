import React from 'react';

// BenefitOverview.tsx
// Displays key benefits and value propositions before diving into problems
export default function BenefitOverview() {
  const benefits = [
    {
      icon: "🎯",
      title: "Strukturiertes Denken",
      description: "Lerne bewährte Frameworks und Methoden aus der Top-Tier Beratung",
      highlight: "Sofort anwendbar"
    },
    {
      icon: "🧠",
      title: "KI-gestütztes Feedback",
      description: "Erhalte präzises, individuelles Feedback zu deinen Denkprozessen",
      highlight: "Personalisiert"
    },
    {
      icon: "📈",
      title: "Messbare Fortschritte",
      description: "Verfolge deine Entwicklung mit objektiven Metriken und Benchmarks",
      highlight: "Datenbasiert"
    }
  ];

  return (
    <section className="w-full px-6 py-16 bg-gradient-to-r from-[#00bfae] to-[#009688]">
      <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Warum navaa dein <span className="text-yellow-300">Denken und Handeln</span> verbessert
        </h2>
        <p className="text-lg text-white opacity-90 max-w-3xl mx-auto">
          navaa kombiniert wissenschaftlich fundierte Lernmethoden mit modernster KI-Technologie, 
          um dir strukturiertes Denken und bessere Entscheidungsfindung zu vermitteln - erste Lerneffekte nach wenigen Tagen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">{benefit.icon}</div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-900">{benefit.title}</h3>
              <span className="bg-[#00bfae] bg-opacity-10 text-[#00bfae] text-xs font-semibold px-2 py-1 rounded-full">
                {benefit.highlight}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>

      {/* Value Proposition Summary */}
      <div className="mt-12 text-center">
        <h3 className="text-2xl font-bold mb-4 text-white">
          Das Ergebnis: Bessere Entscheidungen, klarere Kommunikation, stärkere Wirkung
        </h3>
        <p className="text-lg opacity-90 mb-6 text-white">
          Führungskräfte, die mit navaa trainieren, treffen nachweislich bessere Entscheidungen 
          und kommunizieren strukturierter mit ihren Teams und Stakeholdern.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm mb-6 text-white">
          <div className="flex items-center">
            <span className="text-xl mr-2">✓</span>
            <span>Strukturiertere Problemanalyse</span>
          </div>
          <div className="flex items-center">
            <span className="text-xl mr-2">✓</span>
            <span>Klarere Kommunikation</span>
          </div>
          <div className="flex items-center">
            <span className="text-xl mr-2">✓</span>
            <span>Bessere Stakeholder-Gespräche</span>
          </div>
          <div className="flex items-center">
            <span className="text-xl mr-2">✓</span>
            <span>Erhöhte Entscheidungssicherheit</span>
          </div>
        </div>
        
        {/* Sekundäre CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/lernansatz" 
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#00bfae] font-semibold rounded-lg border-2 border-white hover:bg-gray-50 transition-colors"
          >
            📚 Lernansatz verstehen
          </a>
          <a 
            href="/chat" 
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#00bfae] font-semibold rounded-lg border-2 border-white hover:bg-gray-100 transition-colors"
          >
            🚀 Jetzt Beta bewerben
          </a>
        </div>
      </div>
      </div>
    </section>
  );
}
