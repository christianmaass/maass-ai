import React, { useState } from 'react';
import StepWrapper from '../shared/StepWrapper';
import MultipleChoice from '../shared/MultipleChoice';
import FeedbackBox from '../shared/FeedbackBox';
import { MultipleChoiceOption, StepComponentProps } from '../types/onboarding.types';

const Step4_Synthesis: React.FC<StepComponentProps> = ({ stepNumber, onNext, onBack }) => {
  const [selectedOption, setSelectedOption] = useState<MultipleChoiceOption | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [showScorecard, setShowScorecard] = useState<boolean>(false);

  const stepContent = {
    title: 'Synthetisieren & Optionen bewerten',
    icon: '⚖️',
    miniCase:
      'Du hast Personal als größten Hebel identifiziert (6% Gesamtersparnis möglich). Welche Maßnahme empfiehlst du?',
    options: [
      {
        id: 'layoffs',
        text: 'Sofortige Personalreduktion um 10%',
        correct: false,
      },
      {
        id: 'efficiency',
        text: 'Effizienzsteigerung durch Prozessoptimierung',
        correct: true,
      },
      {
        id: 'outsourcing',
        text: 'Komplettes Outsourcing der Produktion',
        correct: false,
      },
    ] as MultipleChoiceOption[],
    feedback: {
      correct:
        'Richtig! Effizienzsteigerung ist nachhaltiger und risikoärmer. Du behältst Know-how, verbesserst Prozesse und erzielst langfristige Kostensenkungen ohne Qualitätsverlust oder Mitarbeiter-Demotivation.',
      incorrect:
        'Effizienzsteigerung ist der ausgewogenste Ansatz! Personalreduktion ist kurzfristig, aber riskant (Know-how-Verlust, Demotivation). Outsourcing ist radikal und schwer umkehrbar. Prozessoptimierung bietet nachhaltigen Impact.',
    },
    learningPoint:
      'Handlungsoptionen systematisch bündeln, vergleichende Bewertung (Trade-off, Risiko, Umsetzbarkeit) und Priorisierung von Quick Wins vs. strategische Initiativen',
  };

  const handleAnswer = (option: MultipleChoiceOption, isCorrect: boolean) => {
    setSelectedOption(option);
    setShowFeedback(true);
    // Scorecard nach kurzer Verzögerung zeigen
    setTimeout(() => setShowScorecard(true), 1500);
  };

  const canProceed = selectedOption !== null;

  // Scorecard-Daten für die drei Optionen (1-10 Skala, höher = besser)
  const scorecardData = [
    {
      option: 'Personalreduktion',
      impact: 9, // Hoher Impact
      risiko: 2, // Hohes Risiko (invertiert: 10-8=2)
      umsetzbarkeit: 9, // Leicht umsetzbar
      nachhaltigkeit: 3, // Wenig nachhaltig
      total: 23, // Summe aller Kriterien
      color: 'red',
      explanation: 'Hoher Impact, aber hohes Risiko und wenig nachhaltig',
    },
    {
      option: 'Effizienzsteigerung',
      impact: 7, // Mittlerer Impact
      risiko: 7, // Niedriges Risiko (invertiert: 10-3=7)
      umsetzbarkeit: 6, // Mittlere Umsetzbarkeit
      nachhaltigkeit: 9, // Sehr nachhaltig
      total: 29, // Höchste Gesamtpunktzahl = BESTE OPTION
      color: 'green',
      explanation: 'Ausgewogene Option mit hoher Nachhaltigkeit',
    },
    {
      option: 'Outsourcing',
      impact: 8, // Hoher Impact
      risiko: 1, // Sehr hohes Risiko (invertiert: 10-9=1)
      umsetzbarkeit: 4, // Schwer umsetzbar
      nachhaltigkeit: 6, // Mittlere Nachhaltigkeit
      total: 19, // Niedrigste Gesamtpunktzahl
      color: 'orange',
      explanation: 'Hoher Impact, aber sehr riskant und schwer umsetzbar',
    },
  ];

  // Sortiere nach Total-Score (höchster Score = beste Option)
  const sortedData = [...scorecardData].sort((a, b) => b.total - a.total);

  const getScoreColor = (score: number) => {
    if (score <= 3) return 'bg-red-200 text-red-800';
    if (score <= 6) return 'bg-yellow-200 text-yellow-800';
    return 'bg-green-200 text-green-800';
  };

  return (
    <StepWrapper
      stepNumber={stepNumber}
      title={stepContent.title}
      icon={stepContent.icon}
      onNext={onNext}
      onBack={onBack}
      canProceed={canProceed}
    >
      {/* Verbindung zu Step 3 */}
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
        <div className="flex items-center">
          <span className="text-green-600 text-lg mr-2">✓</span>
          <span className="text-sm text-green-800 font-medium">
            Aus Schritt 3: Personal als größter Hebel identifiziert (6% Gesamtersparnis möglich)
          </span>
        </div>
      </div>

      {/* Mini-Case Beschreibung */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">⚖️ Optionsbewertung</h3>
        <p className="text-gray-700 leading-relaxed">{stepContent.miniCase}</p>
      </div>

      {/* Multiple Choice */}
      <MultipleChoice
        question="Welche Maßnahme ist am ausgewogensten?"
        options={stepContent.options}
        onAnswer={handleAnswer}
        selectedOptionId={selectedOption?.id}
      />

      {/* Feedback */}
      {selectedOption && (
        <FeedbackBox
          isCorrect={selectedOption.correct}
          correctFeedback={stepContent.feedback.correct}
          incorrectFeedback={stepContent.feedback.incorrect}
          learningPoint={stepContent.learningPoint}
          show={showFeedback}
        />
      )}

      {/* Scorecard-Analyse */}
      {showScorecard && (
        <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-4">
            📊 Systematische Optionsbewertung (Scorecard)
          </h4>
          <div className="bg-white p-4 rounded-lg border border-blue-300 mb-4">
            <h5 className="font-medium text-blue-900 mb-2">
              💡 Wie funktioniert die Systematische Optionsbewertung?
            </h5>
            <div className="text-sm text-blue-800 space-y-2">
              <p>
                <strong>1. Kriterien definieren:</strong> Impact, Risiko, Umsetzbarkeit,
                Nachhaltigkeit
              </p>
              <p>
                <strong>2. Bewertung (1-10 Skala):</strong> Höhere Werte = besser (auch bei Risiko:
                10 = sehr sicher, 1 = sehr riskant)
              </p>
              <p>
                <strong>3. Gesamtscore berechnen:</strong> Summe aller Kriterien
              </p>
              <p>
                <strong>4. Ranking:</strong> Höchster Gesamtscore = beste Option
              </p>
              <p>
                <strong>5. Trade-off Analyse:</strong> Bewusste Entscheidung zwischen Vor- und
                Nachteilen
              </p>
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-300 mb-4">
            <p className="text-sm text-green-800">
              <strong>🏆 Ergebnis:</strong> Effizienzsteigerung gewinnt mit{' '}
              <strong>29 Punkten</strong> - ausgewogene Lösung mit hoher Nachhaltigkeit und
              niedrigem Risiko.
            </p>
          </div>
          <p className="text-sm text-blue-800 mb-4">
            So bewerten Strategieberater die drei Handlungsoptionen:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-blue-300">
                  <th className="text-left py-2 text-blue-900">Rang</th>
                  <th className="text-left py-2 text-blue-900">Option</th>
                  <th className="text-center py-2 text-blue-900">Impact</th>
                  <th className="text-center py-2 text-blue-900">Risiko</th>
                  <th className="text-center py-2 text-blue-900">Umsetzbarkeit</th>
                  <th className="text-center py-2 text-blue-900">Nachhaltigkeit</th>
                  <th className="text-center py-2 text-blue-900 font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b border-blue-200 ${index === 0 ? 'bg-green-50' : ''}`}
                  >
                    <td className="py-2 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          index === 0
                            ? 'bg-green-500 text-white'
                            : index === 1
                              ? 'bg-yellow-500 text-white'
                              : 'bg-red-500 text-white'
                        }`}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-2 font-medium text-blue-900">{row.option}</td>
                    <td className="text-center py-2">
                      <span className={`px-2 py-1 rounded text-xs ${getScoreColor(row.impact)}`}>
                        {row.impact}
                      </span>
                    </td>
                    <td className="text-center py-2">
                      <span className={`px-2 py-1 rounded text-xs ${getScoreColor(row.risiko)}`}>
                        {row.risiko}
                      </span>
                    </td>
                    <td className="text-center py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${getScoreColor(row.umsetzbarkeit)}`}
                      >
                        {row.umsetzbarkeit}
                      </span>
                    </td>
                    <td className="text-center py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${getScoreColor(row.nachhaltigkeit)}`}
                      >
                        {row.nachhaltigkeit}
                      </span>
                    </td>
                    <td className="text-center py-2">
                      <span
                        className={`px-2 py-1 rounded font-bold ${
                          row.color === 'green'
                            ? 'bg-green-300 text-green-900'
                            : row.color === 'orange'
                              ? 'bg-orange-300 text-orange-900'
                              : 'bg-red-300 text-red-900'
                        }`}
                      >
                        {row.total}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <h6 className="font-medium text-blue-900 mb-2">📊 Scorecard-Interpretation:</h6>
            <div className="text-xs text-blue-800 space-y-1">
              <p>
                <strong>Bewertungsskala:</strong> 1-3 = niedrig, 4-6 = mittel, 7-10 = hoch (bei
                allen Kriterien)
              </p>
              <p>
                <strong>Farbcodes:</strong>
                <span className="inline-block px-2 py-1 bg-red-200 text-red-800 rounded text-xs mr-1">
                  ROT (1-3)
                </span>
                <span className="inline-block px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs mr-1">
                  GELB (4-6)
                </span>
                <span className="inline-block px-2 py-1 bg-green-200 text-green-800 rounded text-xs">
                  GRÜN (7-10)
                </span>
              </p>
              <p>
                <strong>Risiko-Bewertung:</strong> 10 = sehr sicher, 1 = sehr riskant
              </p>
              <p>
                <strong>Gesamtscore:</strong> Höhere Punktzahl = bessere Option
              </p>
              <p>
                <strong>Ranking:</strong> 🥇 1. Platz = beste Wahl, 🥈 2. Platz = Alternative, 🥉 3.
                Platz = weniger empfehlenswert
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Typische Denkleistung */}
      {showScorecard && (
        <div className="mt-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-900 mb-3">
            🧠 Typische Denkleistung beim Synthetisieren:
          </h4>
          <div className="space-y-3 text-sm text-yellow-800">
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2">1.</span>
              <div>
                <strong>Optionen systematisch sammeln:</strong> Alle realistischen
                Handlungsalternativen auflisten
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2">2.</span>
              <div>
                <strong>Bewertungskriterien definieren:</strong> Impact, Risiko, Umsetzbarkeit,
                Nachhaltigkeit
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2">3.</span>
              <div>
                <strong>Trade-offs transparent machen:</strong> &quot;Option A hat hohen Impact,
                aber auch hohes Risiko&quot;
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2">4.</span>
              <div>
                <strong>Quick Wins identifizieren:</strong> Was kann sofort umgesetzt werden vs.
                langfristige Initiativen
              </div>
            </div>
          </div>
        </div>
      )}
    </StepWrapper>
  );
};

export default Step4_Synthesis;
