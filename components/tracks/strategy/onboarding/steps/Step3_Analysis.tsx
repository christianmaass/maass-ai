import React, { useState } from 'react';
import StepWrapper from '../shared/StepWrapper';
import MultipleChoice from '../shared/MultipleChoice';
import FeedbackBox from '../shared/FeedbackBox';
import { MultipleChoiceOption, StepComponentProps } from '../types/onboarding.types';

const Step3_Analysis: React.FC<StepComponentProps> = ({ stepNumber, onNext, onBack }) => {
  const [selectedDriver, setSelectedDriver] = useState<MultipleChoiceOption | null>(null);
  // Impact estimate removed as requested
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [showImpactSection, setShowImpactSection] = useState<boolean>(false);

  const stepContent = {
    title: 'Analyse & Zahlenarbeit',
    icon: '📊',
    miniCase:
      'Deine Hypothese: Personal (60%) und Material (25%) sind die größten Kostentreiber. Welchen Hebel priorisierst du?',
    driverOptions: [
      {
        id: 'personal',
        text: 'Personalkosten optimieren (60% der Gesamtkosten)',
        correct: true,
      },
      {
        id: 'material',
        text: 'Materialkosten senken (25% der Gesamtkosten)',
        correct: false,
      },
      {
        id: 'overhead',
        text: 'Overhead reduzieren (10% der Gesamtkosten)',
        correct: false,
      },
    ] as MultipleChoiceOption[],
    feedback: {
      correct:
        'Richtig! Bei 60% Anteil hat Personal den größten Leverage-Effekt. Selbst kleine prozentuale Verbesserungen (5-10%) haben massive Auswirkungen auf das Gesamtergebnis.',
      incorrect:
        'Personal ist der größte Hebel! Bei 60% Kostenanteil wirken sich selbst kleine Verbesserungen überproportional aus. Material (25%) oder Overhead (10%) haben deutlich weniger Impact-Potenzial.',
    },
    learningPoint:
      'Treiberbaum aufbauen, die 1-2 Hebel mit größtem Impact priorisieren und Begründung liefern (größter Anteil, hoher Leverage)',
  };

  const handleDriverSelect = (option: MultipleChoiceOption, isCorrect: boolean) => {
    setSelectedDriver(option);
    setShowFeedback(true);
    // Nach kurzer Verzögerung Impact-Sektion zeigen
    setTimeout(() => setShowImpactSection(true), 1000);
  };

  // Impact estimation functions removed as requested

  const canProceed = selectedDriver !== null;

  return (
    <StepWrapper
      stepNumber={stepNumber}
      title={stepContent.title}
      icon={stepContent.icon}
      onNext={onNext}
      onBack={onBack}
      canProceed={canProceed}
    >
      {/* Verbindung zu Step 2 */}
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
        <div className="flex items-center">
          <span className="text-green-600 text-lg mr-2">✓</span>
          <span className="text-sm text-green-800 font-medium">
            Aus Schritt 2: Hypothese &quot;Personal (60%) und Material (25%) sind größte
            Kostentreiber&quot;
          </span>
        </div>
      </div>

      {/* Mini-Case Beschreibung */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 Priorisierungsaufgabe</h3>
        <p className="text-gray-700 leading-relaxed">{stepContent.miniCase}</p>
      </div>

      {/* Treiber-Auswahl */}
      <MultipleChoice
        question="Welchen Kostentreiber priorisierst du für die Analyse?"
        options={stepContent.driverOptions}
        onAnswer={handleDriverSelect}
        selectedOptionId={selectedDriver?.id}
      />

      {/* Feedback */}
      {selectedDriver && (
        <FeedbackBox
          isCorrect={selectedDriver.correct}
          correctFeedback={stepContent.feedback.correct}
          incorrectFeedback={stepContent.feedback.incorrect}
          learningPoint={stepContent.learningPoint}
          show={showFeedback}
        />
      )}

      {/* Typische Denkleistung */}
      {showImpactSection && (
        <div className="mt-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-900 mb-3">
            🧠 Typische Denkleistung bei der Analyse:
          </h4>
          <div className="space-y-3 text-sm text-yellow-800">
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2">1.</span>
              <div>
                <strong>Treiberbaum aufbauen:</strong> Cost Driver- oder Revenue Tree mit klarer
                Hierarchie
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2">2.</span>
              <div>
                <strong>Priorisieren:</strong> Welche 1-2 Hebel versprechen den größten Impact?
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2">3.</span>
              <div>
                <strong>Begründung:</strong> Warum gerade diese Hebel? (größter Anteil, hoher
                Leverage)
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2">4.</span>
              <div>
                <strong>Grobe Schätzung:</strong> Realistische Verbesserungspotenziale
                quantifizieren
              </div>
            </div>
          </div>
        </div>
      )}
    </StepWrapper>
  );
};

export default Step3_Analysis;
