import React, { useState } from 'react';
import StepWrapper from '../shared/StepWrapper';
import MultipleChoice from '../shared/MultipleChoice';
import FeedbackBox from '../shared/FeedbackBox';
import { MultipleChoiceOption, StepComponentProps } from '../types/onboarding.types';

const Step2_Structure: React.FC<StepComponentProps> = ({ stepNumber, onNext, onBack }) => {
  const [selectedOption, setSelectedOption] = useState<MultipleChoiceOption | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  const stepContent = {
    title: 'Strukturierung & Hypothesenbildung',
    icon: '🏗️',
    miniCase:
      'Du weißt jetzt: Der Industriekunde will seine Kostenstruktur verbessern. Wie gehst du strukturiert vor?',
    options: [
      {
        id: 'a',
        text: 'Alle Kostenpositionen einzeln durchgehen und prüfen',
        correct: false,
      },
      {
        id: 'b',
        text: 'Hypothese: "Die größten Kostentreiber sind Personal und Material"',
        correct: true,
      },
      {
        id: 'c',
        text: 'Benchmarks der Konkurrenz recherchieren',
        correct: false,
      },
    ] as MultipleChoiceOption[],
    feedback: {
      correct:
        'Richtig! Eine klare, testbare Hypothese strukturiert deine Analyse. Statt alles zu prüfen, fokussierst du auf die wahrscheinlich größten Hebel. Das spart Zeit und macht deine Argumentation nachvollziehbar.',
      incorrect:
        'Eine strukturierte Hypothese ist der Schlüssel! Statt alle Kosten durchzugehen oder Benchmarks zu sammeln, bildest du eine testbare Vermutung über die größten Kostentreiber. Das gibt deiner Analyse Richtung und Fokus.',
    },
    learningPoint:
      'Top-down-Zerlegung des Problems (MECE-Denken), Bildung klar testbarer Hypothesen und Auswahl passender Frameworks (Profit-Tree, SWOT etc.)',
  };

  const handleAnswer = (option: MultipleChoiceOption, isCorrect: boolean) => {
    setSelectedOption(option);
    setShowFeedback(true);
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
    >
      {/* Verbindung zu Step 1 */}
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
        <div className="flex items-center">
          <span className="text-green-600 text-lg mr-2">✓</span>
          <span className="text-sm text-green-800 font-medium">
            Aus Schritt 1: Ziel ist Kostenstruktur verbessern
          </span>
        </div>
      </div>

      {/* Mini-Case Beschreibung */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">🏗️ Strukturierungsaufgabe</h3>
        <p className="text-gray-700 leading-relaxed">{stepContent.miniCase}</p>
      </div>

      {/* Multiple Choice */}
      <MultipleChoice
        question="Welcher Ansatz ist am strukturiertesten?"
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

      {/* Framework-Beispiel */}
      {showFeedback && (
        <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">
            🧠 Typische Denkleistung bei der Strukturierung:
          </h4>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start">
              <span className="text-blue-600 mr-2">1.</span>
              <div>
                <strong>Top-down-Zerlegung:</strong> Gesamtkosten → Kostenkategorien →
                Einzelpositionen (MECE-Prinzip)
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 mr-2">2.</span>
              <div>
                <strong>Hypothesenbildung:</strong> &quot;Personal (60%) und Material (25%) sind die
                größten Kostentreiber&quot;
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 mr-2">3.</span>
              <div>
                <strong>Framework wählen:</strong> Profit-Tree, Cost-Driver-Analyse oder Value-Chain
              </div>
            </div>
          </div>

          {/* Mini-Framework Visualisierung */}
          <div className="mt-4 p-3 bg-white rounded border">
            <div className="text-xs text-gray-600 mb-2">Beispiel: Einfacher Cost-Tree</div>
            <div className="text-sm font-mono text-gray-700">
              Gesamtkosten
              <br />
              ├── Personal (60%)
              <br />
              ├── Material (25%)
              <br />
              ├── Overhead (10%)
              <br />
              └── Sonstiges (5%)
            </div>
          </div>
        </div>
      )}
    </StepWrapper>
  );
};

export default Step2_Structure;
