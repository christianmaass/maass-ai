import React, { useState } from 'react';
import { Heading, Text } from '../../../../ui/Typography';
import StepWrapper from '../shared/StepWrapper';
import MultipleChoice from '../shared/MultipleChoice';
import FeedbackBox from '../shared/FeedbackBox';
import { MultipleChoiceOption, StepComponentProps } from '../types/onboarding.types';

const Step1_Problem: React.FC<StepComponentProps> = ({ stepNumber, onNext, onBack }) => {
  const [selectedOption, setSelectedOption] = useState<MultipleChoiceOption | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  const stepContent = {
    title: 'Problemverständnis & Zielklärung',
    icon: '🎯',
    miniCase: 'Ein Industriekunde meldet sinkende Gewinne – was könnte sein Ziel sein?',
    options: [
      {
        id: 'a',
        text: 'Neue Zielgruppe erschließen',
        correct: false,
      },
      {
        id: 'b',
        text: 'Kostenstruktur verbessern',
        correct: true,
      },
      {
        id: 'c',
        text: 'Markenimage erhöhen',
        correct: false,
      },
    ] as MultipleChoiceOption[],
    feedback: {
      correct:
        'Richtig! Bei sinkenden Gewinnen ist die Kostenoptimierung meist der direkteste Hebel. Der Kunde hat wahrscheinlich bereits Umsatzprobleme identifiziert und sucht nach Wegen, die Profitabilität zu steigern.',
      incorrect:
        'Kostenstruktur ist hier der Schlüssel, weil sinkende Gewinne oft bedeuten, dass die Kosten schneller steigen als die Umsätze. Neue Zielgruppen oder Markenimage sind langfristige Strategien, aber bei akuten Gewinnproblemen braucht es schnelle, messbare Verbesserungen.',
    },
    learningPoint:
      "Kernziel des Kunden präzise erfassen, Falltyp klassifizieren und klärende Rückfragen formulieren ('Verstehe ich richtig, dass...?')",
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
      {/* Mini-Case Beschreibung */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <Heading variant="h2" className="mb-3">
          📋 Mini-Case
        </Heading>
        <Text variant="body" as="p" className="text-gray-700 leading-relaxed">
          {stepContent.miniCase}
        </Text>
      </div>

      {/* Multiple Choice */}
      <MultipleChoice
        question="Welches Ziel verfolgt der Kunde wahrscheinlich?"
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

      {/* Erklärung: Worauf kommt es an? */}
      {showFeedback && (
        <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <Heading as="h3" variant="h3" className="text-blue-900 mb-3">
            💡 Worauf kommt es bei diesem Schritt an?
          </Heading>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>
                <strong>Kernziel erfassen:</strong> Was will der Kunde wirklich erreichen? (Nicht
                was er sagt, sondern was dahinter steht)
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>
                <strong>Falltyp klassifizieren:</strong> Umsatzoptimierung, Kostenreduktion,
                Turnaround, Wachstum, etc.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>
                <strong>Klärende Rückfragen:</strong> &quot;Verstehe ich richtig, dass Sie primär
                die Kosten senken wollen?&quot;
              </span>
            </li>
          </ul>
        </div>
      )}
    </StepWrapper>
  );
};

export default Step1_Problem;
