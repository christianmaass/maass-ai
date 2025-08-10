import React from 'react';

// CredentialsSection.tsx
// Displays certifications and credentials to build trust and authority
export default function CredentialsSection() {
  return (
    <section className="w-full py-6">
      <div className="max-w-6xl mx-auto px-6">
        {/* Expertise Indicators */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-700 leading-relaxed max-w-2xl mx-auto mb-8">
            <div className="flex items-center">
              <span className="text-xl mr-2">🎯</span>
              <span>Personalisierte Lernpfade</span>
            </div>
            <div className="flex items-center">
              <span className="text-xl mr-2">🤖</span>
              <span>Intelligente Analyse deiner Denkprozesse und Lösungsansätze</span>
            </div>
            <div className="flex items-center">
              <span className="text-xl mr-2">📈</span>
              <span>Externe Beratungskosten sparen</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
