import React, { useState } from 'react';
import StepWrapper from '../shared/StepWrapper';
import MultipleChoice from '../shared/MultipleChoice';
import FeedbackBox from '../shared/FeedbackBox';
import { MultipleChoiceOption, StepComponentProps } from '../types/onboarding.types';

const Step5_Recommendation: React.FC<StepComponentProps> = ({ stepNumber, onNext, onBack }) => {
  const [selectedOption, setSelectedOption] = useState<MultipleChoiceOption | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [showExecutiveSummary, setShowExecutiveSummary] = useState<boolean>(false);

  const stepContent = {
    title: 'Empfehlung & Executive Summary',
    icon: '🎯',
    miniCase:
      'Du hast Effizienzsteigerung als beste Option identifiziert. Wie formulierst du deine Empfehlung?',
    options: [
      {
        id: 'detailed',
        text: 'Wir sollten verschiedene Prozessoptimierungsmaßnahmen evaluieren und dann schrittweise implementieren, um die Effizienz zu steigern.',
        correct: false,
      },
      {
        id: 'executive',
        text: 'Ich empfehle Prozessoptimierung im Personalbereich, weil sie 6% Kostensenkung bei niedrigem Risiko ermöglicht.',
        correct: true,
      },
      {
        id: 'vague',
        text: 'Die Analyse zeigt, dass Effizienzsteigerungen grundsätzlich sinnvoll sind und implementiert werden sollten.',
        correct: false,
      },
    ] as MultipleChoiceOption[],
    feedback: {
      correct:
        "Perfekt! Eine starke Empfehlung folgt der Formel: 'Ich empfehle X, weil Y → führt zu Z'. Klar, prägnant, mit Begründung und quantifiziertem Nutzen. Keine Umschweife, sondern direkte Handlungsempfehlung.",
      incorrect:
        "Eine Executive-Empfehlung muss prägnant und klar sein! Vermeide 'sollten evaluieren' oder vage Aussagen. Nutze die Formel: 'Ich empfehle X, weil Y → führt zu Z'. Konkret, quantifiziert, handlungsorientiert.",
    },
    learningPoint:
      "Prägnante Empfehlungsformel: 'Ich empfehle X, weil Y → führt zu Z', Fokus auf Wirkung und Umsetzungspfad, Vermeidung von 'Berater-Bla-Bla'",
  };

  const handleAnswer = (option: MultipleChoiceOption, isCorrect: boolean) => {
    setSelectedOption(option);
    setShowFeedback(true);
    // Executive Summary nach kurzer Verzögerung zeigen
    setTimeout(() => setShowExecutiveSummary(true), 1500);
  };

  const canProceed = selectedOption !== null;

  return (
    <StepWrapper
      stepNumber={stepNumber}
      title={stepContent.title}
      icon={stepContent.icon}
      onNext={onNext}
      onBack={onBack}
      canProceed={canProceed}
      nextButtonText="Onboarding abschließen"
    >
      {/* Verbindung zu Step 4 */}
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
        <div className="flex items-center">
          <span className="text-green-600 text-lg mr-2">✓</span>
          <span className="text-sm text-green-800 font-medium">
            Aus Schritt 4: Effizienzsteigerung als beste Option identifiziert (ausgewogen,
            nachhaltig)
          </span>
        </div>
      </div>

      {/* Mini-Case Beschreibung */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 Empfehlungsformulierung</h3>
        <p className="text-gray-700 leading-relaxed">{stepContent.miniCase}</p>
      </div>

      {/* Multiple Choice */}
      <MultipleChoice
        question="Welche Empfehlung ist am prägnantesten?"
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

      {/* Executive Summary Beispiel */}
      {showExecutiveSummary && (
        <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-4">
            📋 Executive Summary - Komplette Fallbearbeitung
          </h4>
          <div className="bg-white p-4 rounded border space-y-3 text-sm">
            <div>
              <strong className="text-gray-900">Situation:</strong>
              <span className="text-gray-700"> Industriekunde mit sinkenden Gewinnen</span>
            </div>
            <div>
              <strong className="text-gray-900">Analyse:</strong>
              <span className="text-gray-700">
                {' '}
                Personal (60%) als größter Kostentreiber identifiziert
              </span>
            </div>
            <div>
              <strong className="text-gray-900">Optionen:</strong>
              <span className="text-gray-700">
                {' '}
                Personalreduktion vs. Effizienzsteigerung vs. Outsourcing
              </span>
            </div>
            <div>
              <strong className="text-gray-900">Empfehlung:</strong>
              <span className="text-[#00bfae] font-medium">
                {' '}
                Prozessoptimierung im Personalbereich
              </span>
            </div>
            <div>
              <strong className="text-gray-900">Impact:</strong>
              <span className="text-gray-700"> 6% Gesamtkostensenkung bei niedrigem Risiko</span>
            </div>
            <div>
              <strong className="text-gray-900">Next Steps:</strong>
              <span className="text-gray-700">
                {' '}
                Prozessanalyse starten, Quick Wins identifizieren
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Empfehlungsformel */}
      {showExecutiveSummary && (
        <div className="mt-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-900 mb-3">🧠 Die perfekte Empfehlungsformel:</h4>
          <div className="space-y-4 text-sm text-yellow-800">
            <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
              <div className="font-mono text-yellow-900 mb-2">
                &quot;Ich empfehle <strong>[X]</strong>, weil <strong>[Y]</strong> → führt zu{' '}
                <strong>[Z]</strong>&quot;
              </div>
              <div className="text-xs text-yellow-700">
                X = Konkrete Maßnahme | Y = Begründung | Z = Quantifizierter Nutzen
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start">
                <span className="text-yellow-600 mr-2">✓</span>
                <div>
                  <strong>Fokus auf Wirkung:</strong> Was passiert konkret? Welcher Business-Impact?
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-yellow-600 mr-2">✓</span>
                <div>
                  <strong>Umsetzungspfad:</strong> Wie geht es weiter? Welche nächsten Schritte?
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-yellow-600 mr-2">✓</span>
                <div>
                  <strong>Klare Sprache:</strong> Verständlich, nicht nur Excel-Logik
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <div>
                  <strong>Vermeide:</strong> &quot;Wir sollten evaluieren&quot;, &quot;grundsätzlich
                  sinnvoll&quot;, &quot;verschiedene Maßnahmen&quot;
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Was macht Top-Berater aus */}
      {showExecutiveSummary && (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-3">
            🌟 Was zeichnet Top-Berater und Strategen aus?
          </h4>
          <div className="space-y-3 text-sm text-green-800">
            <div className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <div>
                <strong>Strukturierung:</strong> Denken in Kategorien und Teilblöcken (MECE-Prinzip)
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <div>
                <strong>Fokus:</strong> Konzentration auf 2-3 wirkungsstarke Hebel, nicht alles auf
                einmal
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <div>
                <strong>Wirtschaftliches Denken:</strong> Was hat Business-Impact, nicht nur
                Excel-Logik
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <div>
                <strong>Klarheit:</strong> &quot;Ich glaube, die größten Hebel sind A und B,
                weil...&quot;
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded border text-center">
            <div className="text-green-900 font-medium">
              🎯 Genau das werden wir lernen und trainieren!
            </div>
          </div>
        </div>
      )}
    </StepWrapper>
  );
};

export default Step5_Recommendation;
