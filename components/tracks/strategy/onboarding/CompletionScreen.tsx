import React from 'react';

interface CompletionScreenProps {
  onRestart: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ onRestart }) => {
  const handleStartRealCase = () => {
    // Redirect to cases page
    window.location.href = '/cases';
  };

  return (
    <div className="max-w-4xl mx-auto text-center">
      {/* Success Animation */}
      <div className="mb-8">
        <div className="text-8xl mb-4 animate-bounce">🎉</div>
        <div className="text-6xl mb-6">✨</div>
      </div>

      {/* Main Success Message */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Super – du hast den navaa-Denkprozess kennengelernt!
        </h1>
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
          In echten Fällen wirst du diesen Ablauf Schritt für Schritt anwenden – mit KI-Feedback,
          passgenauen Cases und klaren Empfehlungen.
        </p>
      </div>

      {/* Journey Summary */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">🧠 Was du gelernt hast:</h2>
        <div className="grid md:grid-cols-5 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-semibold text-gray-900 mb-1">Problem verstehen</div>
            <div className="text-gray-600">Ziele identifizieren & Falltyp klassifizieren</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl mb-2">🏗️</div>
            <div className="font-semibold text-gray-900 mb-1">Struktur bilden</div>
            <div className="text-gray-600">Hypothesen entwickeln & MECE-Denken</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold text-gray-900 mb-1">Analyse durchführen</div>
            <div className="text-gray-600">Hebel priorisieren & Impact quantifizieren</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl mb-2">⚖️</div>
            <div className="font-semibold text-gray-900 mb-1">Optionen bewerten</div>
            <div className="text-gray-600">Trade-offs analysieren & Scorecard nutzen</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-semibold text-gray-900 mb-1">Empfehlung geben</div>
            <div className="text-gray-600">Executive Summary & klare Handlungsempfehlung</div>
          </div>
        </div>
      </div>

      {/* Ready Message */}
      <div className="mb-8">
        <div className="text-xl font-semibold text-gray-900 mb-4">
          → Du bist bereit für deinen ersten echten Fall!
        </div>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Denke daran: Top-Berater und Strategen zeichnet folgendes aus:
        </p>

        {/* Key Success Factors */}
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
          <div className="bg-[#00bfae] bg-opacity-10 border border-[#00bfae] border-opacity-30 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-[#00bfae] text-lg mr-2">🏗️</span>
              <span className="font-semibold text-gray-900">Strukturierung</span>
            </div>
            <p className="text-sm text-gray-700">Denken in Kategorien und Teilblöcken</p>
          </div>
          <div className="bg-[#00bfae] bg-opacity-10 border border-[#00bfae] border-opacity-30 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-[#00bfae] text-lg mr-2">🎯</span>
              <span className="font-semibold text-gray-900">Fokus</span>
            </div>
            <p className="text-sm text-gray-700">Konzentration auf 2–3 wirkungsstarke Hebel</p>
          </div>
          <div className="bg-[#00bfae] bg-opacity-10 border border-[#00bfae] border-opacity-30 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-[#00bfae] text-lg mr-2">💰</span>
              <span className="font-semibold text-gray-900">Wirtschaftliches Denken</span>
            </div>
            <p className="text-sm text-gray-700">Was hat Business-Impact, nicht nur Excel-Logik</p>
          </div>
          <div className="bg-[#00bfae] bg-opacity-10 border border-[#00bfae] border-opacity-30 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-[#00bfae] text-lg mr-2">💡</span>
              <span className="font-semibold text-gray-900">Klarheit</span>
            </div>
            <p className="text-sm text-gray-700">
              &quot;Ich glaube, die größten Hebel sind A und B, weil...&quot;
            </p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 p-4 rounded-lg max-w-2xl mx-auto">
          <div className="text-green-900 font-semibold">
            🌟 Genau das werden wir lernen und trainieren!
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-colors"
        >
          🔄 Onboarding wiederholen
        </button>
        <button
          onClick={handleStartRealCase}
          className="px-8 py-4 bg-[#00bfae] text-white font-bold rounded-lg hover:bg-[#009688] transition-colors text-lg shadow-lg transform hover:scale-105"
        >
          🚀 Jetzt echten Fall starten
        </button>
      </div>

      {/* Motivational Footer */}
      <div className="text-sm text-gray-500 max-w-2xl mx-auto">
        <p className="mb-2">
          💡 <strong>Tipp:</strong> In echten Cases bekommst du individuelles KI-Feedback zu jedem
          Schritt
        </p>
        <p>
          🎯 <strong>Ziel:</strong> Strategisches Denken wird zu deiner zweiten Natur
        </p>
      </div>
    </div>
  );
};

export default CompletionScreen;
