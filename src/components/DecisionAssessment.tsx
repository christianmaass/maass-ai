'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/Button';

type Answer = 'Ja' | 'Nein' | 'Unsicher';
type Pattern =
  | 'ALL_JA'
  | 'ALL_NEIN'
  | 'ALL_UNSICHER'
  | 'MAJ_JA'
  | 'MAJ_NEIN'
  | 'MAJ_UNSICHER'
  | 'MIX_1_1_1';

interface AssessmentState {
  q1: Answer | null;
  q2: Answer | null;
  q3: Answer | null;
}

interface Question {
  id: keyof AssessmentState;
  text: string;
}

const questions: Question[] = [
  {
    id: 'q1',
    text: 'Haben Sie eine schriftlich formulierte Strategie, die alle im Unternehmen kennen?',
  },
  {
    id: 'q2',
    text: 'Sind Ihre wichtigsten Ziele und Prioritäten für die nächsten 12 Monate eindeutig definiert?',
  },
  {
    id: 'q3',
    text: 'Treffen Ihre Teams Entscheidungen im Alltag auf Basis dieser Strategie?',
  },
];

const results = {
  ALL_JA: {
    title: 'Sie sind bereits sehr klar aufgestellt.',
    text: 'NAVAA zeigt Ihnen, wie Sie Ihre Entscheidungsqualität noch weiter verbessern – schnellere Entscheidungen, weniger Reibungsverluste.',
  },
  ALL_NEIN: {
    title: 'Viele Aktivitäten, wenig Klarheit – das ist normal.',
    text: 'NAVAA bringt Struktur, klare Ziele und systematische Bewertung. So werden aus Aktivitäten echte Entscheidungen.',
  },
  ALL_UNSICHER: {
    title: 'Unsicherheit ist normal – aber teuer.',
    text: 'NAVAA schafft Klarheit über Ziele, Optionen und Trade-offs – in wenigen, klaren Schritten.',
  },
  MAJ_JA: {
    title: 'Starke Basis – mit weißen Flecken.',
    text: 'NAVAA schärft Fokus und Kriterien, damit alle Teams nach denselben Maßstäben entscheiden.',
  },
  MAJ_NEIN: {
    title: 'Es fehlt an Klarheit und Prioritäten.',
    text: 'NAVAA liefert den Entscheidungsrahmen: Kriterien, Optionen, Trade-offs – für spürbaren Fortschritt.',
  },
  MAJ_UNSICHER: {
    title: 'Das Bild ist unklar – das kostet Tempo.',
    text: 'NAVAA schafft Klarheit über Ziele, Optionen und Unsicherheiten. So entsteht Konsistenz im Alltag.',
  },
  MIX_1_1_1: {
    title: 'Uneinheitliches Bild – wie oft in Teams.',
    text: 'NAVAA sorgt für gemeinsame Klarheit und Richtung – von der Zielsetzung bis zur Entscheidung.',
  },
};

function calculatePattern(answers: AssessmentState): Pattern {
  const values = [answers.q1, answers.q2, answers.q3];
  const countJA = values.filter((a) => a === 'Ja').length;
  const countNEIN = values.filter((a) => a === 'Nein').length;
  const countUNSICHER = values.filter((a) => a === 'Unsicher').length;

  // Prüfe in der spezifizierten Reihenfolge
  if (countJA === 3) return 'ALL_JA';
  if (countNEIN === 3) return 'ALL_NEIN';
  if (countUNSICHER === 3) return 'ALL_UNSICHER';
  if (countJA === 2) return 'MAJ_JA';
  if (countNEIN === 2) return 'MAJ_NEIN';
  if (countUNSICHER === 2) return 'MAJ_UNSICHER';
  if (countJA === 1 && countNEIN === 1 && countUNSICHER === 1) return 'MIX_1_1_1';

  // Fallback (sollte nie erreicht werden)
  return 'MIX_1_1_1';
}

function trackAnswer(questionId: string, answer: Answer) {
  console.log('decisioncheck_answer', { questionId, answer });
}

function trackResult(pattern: Pattern) {
  console.log('decisioncheck_result', { pattern });
}

function trackCTAClick(pattern: Pattern) {
  console.log('decisioncheck_cta_click', { pattern });
}

export function DecisionAssessment() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<AssessmentState>({
    q1: null,
    q2: null,
    q3: null,
  });
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[step - 1];
  const currentAnswer = answers[currentQuestion.id];
  const isLastStep = step === 3;

  // Berechne Fortschritt basierend auf beantworteten Fragen
  const answeredQuestions = Object.values(answers).filter((answer) => answer !== null).length;
  const progressPercentage = (answeredQuestions / 3) * 100;

  const handleAnswer = (answer: Answer) => {
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);
    trackAnswer(currentQuestion.id, answer);

    // Auto-advance to next question or show result
    if (isLastStep) {
      // Last question - show result after a short delay
      setTimeout(() => {
        const pattern = calculatePattern(newAnswers);
        trackResult(pattern);
        setShowResult(true);
      }, 500);
    } else {
      // Not last question - advance to next step after a short delay
      setTimeout(() => {
        setStep(step + 1);
      }, 500);
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      const pattern = calculatePattern(answers);
      trackResult(pattern);
      setShowResult(true);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setStep(1);
    setAnswers({ q1: null, q2: null, q3: null });
    setShowResult(false);
  };

  const handleCTAClick = () => {
    const pattern = calculatePattern(answers);
    trackCTAClick(pattern);
    window.location.href = `/register?sc_pattern=${pattern}`;
  };

  const currentPattern = showResult ? calculatePattern(answers) : null;
  const result = currentPattern ? results[currentPattern] : null;

  return (
    <div className="bg-transparent rounded-xl p-6 md:p-8">
      {!showResult ? (
        <>
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-navaa-gray-600 mb-2">
              <span>Frage {step} von 3</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-white rounded-full h-2 relative overflow-hidden">
              {/* Sanfter Hintergrundstrahler */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-navaa-accent/10 via-navaa-accent/15 to-navaa-accent/20 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
              {/* Hauptbalken mit sanftem Glow */}
              <div
                className="relative bg-navaa-accent h-2 rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${progressPercentage}%`,
                  boxShadow:
                    progressPercentage > 0
                      ? '0 0 12px rgba(0, 143, 117, 0.3), 0 0 24px rgba(0, 143, 117, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                      : 'none',
                }}
              />
            </div>
          </div>

          {/* Current Question */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-navaa-gray-900">{currentQuestion.text}</h3>

            <div
              role="radiogroup"
              aria-labelledby={`question-${step}`}
              className="flex flex-col sm:flex-row gap-3"
            >
              {(['Ja', 'Nein', 'Unsicher'] as Answer[]).map((option) => (
                <button
                  key={option}
                  role="radio"
                  aria-checked={currentAnswer === option}
                  onClick={() => handleAnswer(option)}
                  className={`
                    px-6 py-3 rounded-lg border transition-all duration-200 text-sm font-medium
                    ${
                      currentAnswer === option
                        ? 'border-navaa-accent bg-navaa-accent text-white shadow-md'
                        : 'border-navaa-gray-300 text-navaa-gray-700 hover:border-navaa-accent hover:bg-navaa-accent/5'
                    }
                  `}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Optional Tooltip for "Unsicher" */}
            <p className="text-xs text-navaa-gray-500">
              &ldquo;Unsicher&rdquo; heißt: ich weiß es (noch) nicht / Antworten variieren.
            </p>
          </div>

          {/* Back Button (only show if not on first question) */}
          {step > 1 && (
            <div className="mt-8">
              <button
                onClick={handleBack}
                className="text-navaa-accent hover:text-navaa-accent/80 text-sm underline transition-colors"
              >
                Zurück
              </button>
            </div>
          )}
        </>
      ) : (
        /* Result */
        <div className="space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-navaa-accent/10 text-navaa-accent">
            Ihr Ergebnis
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-navaa-gray-900">{result?.title}</h3>
            <p className="text-navaa-gray-700 text-lg max-w-2xl">{result?.text}</p>
          </div>

          {/* CTA Section */}
          <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleCTAClick}
                size="lg"
                className="text-white px-8 py-3 text-lg bg-[#42A5F5] hover:bg-[#1E88E5] transition-colors"
              >
                Kostenlos testen
              </Button>
            </div>

            <p className="text-xs text-navaa-gray-500 max-w-md">
              Kurzfakten: Nur rund 1 von 5 Unternehmen hält seine Entscheidungsqualität für wirklich
              hochwertig. Viele scheitern bei der Umsetzung – genau hier setzt NAVAA an.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="text-navaa-accent hover:text-navaa-accent/80 text-sm underline transition-colors"
          >
            Neu starten
          </button>
        </div>
      )}
    </div>
  );
}
