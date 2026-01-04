import type { DecisionSuiteV1AggregatedResult, HintBand, Pattern } from '@/lib/decisionSuite/types';

/**
 * UI Copy Type
 *
 * Repräsentiert die deterministische UI-Copy für Decision Suite v1.
 */
export interface DecisionSuiteCopy {
  /**
   * Kurzes Badge-Text (max ~50 Zeichen)
   */
  hint_label: string;

  /**
   * Ein prägnanter Satz (max ~120 Zeichen)
   */
  result_line: string;

  /**
   * Optionale Fokus-Frage (max ~150 Zeichen)
   * Nur vorhanden wenn hint_band !== "NO_HINT"
   */
  focus_question?: string;
}

/**
 * Copy-Dictionary für Deutsch
 */
// Reusable NO_HINT copy constant
const NO_HINT_COPY_DE: Omit<DecisionSuiteCopy, 'focus_question'> & { focus_question: string } = {
  hint_label: 'Kein Strukturhinweis',
  result_line: 'Die Entscheidungsstruktur wirkt konsistent.',
  focus_question: '', // Wird nicht verwendet, aber für Type-Sicherheit
};

const copyDE: Record<
  HintBand,
  Record<
    Pattern | 'default',
    Omit<DecisionSuiteCopy, 'focus_question'> & { focus_question: string }
  >
> = {
  NO_HINT: {
    default: NO_HINT_COPY_DE,
    OUTCOME_AS_VALIDATION: NO_HINT_COPY_DE,
    MEANS_BEFORE_ENDS: NO_HINT_COPY_DE,
    OBJECTIVE_VAGUENESS: NO_HINT_COPY_DE,
  },
  CLARIFICATION_NEEDED: {
    OBJECTIVE_VAGUENESS: {
      hint_label: 'Klärungsbedarf',
      result_line: 'Das Ziel ist erkennbar, aber noch unscharf definiert.',
      focus_question: 'Woran würdest du in 2–4 Wochen sehen, dass es funktioniert hat?',
    },
    MEANS_BEFORE_ENDS: {
      hint_label: 'Klärungsbedarf',
      result_line: 'Die Optionen sind klar, der Zweck dahinter bleibt aber unscharf.',
      focus_question: 'Welches konkrete Ergebnis soll mit diesen Optionen erreicht werden?',
    },
    OUTCOME_AS_VALIDATION: {
      hint_label: 'Klärungsbedarf',
      result_line: 'Ein erwartetes Ergebnis wird als Annahme gesetzt, ohne Absicherung.',
      focus_question: 'Welche Annahme ist hier kritisch – und wie würdest du sie früh prüfen?',
    },
    default: {
      hint_label: 'Klärungsbedarf',
      result_line: 'Einige strukturelle Punkte sind noch nicht explizit.',
      focus_question: 'Welche Wirkung ist entscheidend – und woran wird sie überprüft?',
    },
  },
  STRUCTURALLY_UNCLEAR: {
    OBJECTIVE_VAGUENESS: {
      hint_label: 'Strukturell unklar',
      result_line: 'Die Zielbeschreibung ist zu unscharf für eine belastbare Abwägung.',
      focus_question: 'Welche konkrete Zielgröße (Messgröße + Zeit) soll erreicht werden?',
    },
    MEANS_BEFORE_ENDS: {
      hint_label: 'Strukturell unklar',
      result_line: 'Die Maßnahme dominiert, Ziel und Wirkung bleiben implizit.',
      focus_question: 'Welche Wirkung soll die Maßnahme erzeugen, und warum ist sie plausibel?',
    },
    OUTCOME_AS_VALIDATION: {
      hint_label: 'Strukturell unklar',
      result_line: 'Mehrere Annahmen werden als sicher gesetzt, ohne Evidenz oder Tests.',
      focus_question: 'Welche Annahme würdest du als Erstes testen – und wie?',
    },
    default: {
      hint_label: 'Strukturell unklar',
      result_line: 'Mehrere strukturelle Signale deuten auf Klärungsbedarf hin.',
      focus_question: 'Was ist Ziel, welche Optionen gibt es, und woran wird Erfolg gemessen?',
    },
  },
};

/**
 * Copy-Dictionary für Englisch
 */
// Reusable NO_HINT copy constant
const NO_HINT_COPY_EN: Omit<DecisionSuiteCopy, 'focus_question'> & { focus_question: string } = {
  hint_label: 'No Structural Hint',
  result_line: 'The decision structure appears consistent.',
  focus_question: '', // Wird nicht verwendet, aber für Type-Sicherheit
};

const copyEN: Record<
  HintBand,
  Record<
    Pattern | 'default',
    Omit<DecisionSuiteCopy, 'focus_question'> & { focus_question: string }
  >
> = {
  NO_HINT: {
    default: NO_HINT_COPY_EN,
    OUTCOME_AS_VALIDATION: NO_HINT_COPY_EN,
    MEANS_BEFORE_ENDS: NO_HINT_COPY_EN,
    OBJECTIVE_VAGUENESS: NO_HINT_COPY_EN,
  },
  CLARIFICATION_NEEDED: {
    OBJECTIVE_VAGUENESS: {
      hint_label: 'Clarification Needed',
      result_line: 'The goal is recognizable but still vaguely defined.',
      focus_question: 'How would you see in 2–4 weeks that it has worked?',
    },
    MEANS_BEFORE_ENDS: {
      hint_label: 'Clarification Needed',
      result_line: 'The options are clear, but the purpose behind them remains vague.',
      focus_question: 'What concrete outcome should be achieved with these options?',
    },
    OUTCOME_AS_VALIDATION: {
      hint_label: 'Clarification Needed',
      result_line: 'An expected outcome is set as an assumption without validation.',
      focus_question: 'Which assumption is critical here – and how would you test it early?',
    },
    default: {
      hint_label: 'Clarification Needed',
      result_line: 'Some structural points are not yet explicit.',
      focus_question: 'What effect is decisive – and how will it be verified?',
    },
  },
  STRUCTURALLY_UNCLEAR: {
    OBJECTIVE_VAGUENESS: {
      hint_label: 'Structurally Unclear',
      result_line: 'The goal description is too vague for a reliable trade-off.',
      focus_question: 'What concrete target metric (measure + time) should be achieved?',
    },
    MEANS_BEFORE_ENDS: {
      hint_label: 'Structurally Unclear',
      result_line: 'The measure dominates; goal and effect remain implicit.',
      focus_question: 'What effect should the measure produce, and why is it plausible?',
    },
    OUTCOME_AS_VALIDATION: {
      hint_label: 'Structurally Unclear',
      result_line: 'Several assumptions are set as certain without evidence or tests.',
      focus_question: 'Which assumption would you test first – and how?',
    },
    default: {
      hint_label: 'Structurally Unclear',
      result_line: 'Several structural signals indicate a need for clarification.',
      focus_question: 'What is the goal, what options exist, and how is success measured?',
    },
  },
};

/**
 * Leitet deterministisch UI-Copy aus dem aggregierten Result ab.
 *
 * Diese Funktion ist eine reine Mapping-Funktion.
 * - Keine LLM
 * - Keine Inferenz
 * - Keine neue Analyse
 * - Nur hint_band + primary_pattern + language → Copy
 *
 * Mapping-Regeln:
 * 1) Wenn hint_band === "NO_HINT":
 *    - Immer hint_label und result_line zurückgeben
 *    - KEIN focus_question zurückgeben
 *    - primary_pattern wird ignoriert
 *
 * 2) Wenn hint_band !== "NO_HINT":
 *    - primary_pattern verwenden, um Copy auszuwählen
 *    - Wenn primary_pattern === null:
 *      - Band-spezifische Default-Copy verwenden
 *    - Immer focus_question zurückgeben
 *
 * @param aggregated - Aggregiertes Decision Suite v1 Result
 * @param language - Sprache ("DE" | "EN")
 * @returns UI-Copy-Objekt
 */
export function deriveDecisionSuiteCopy(
  aggregated: DecisionSuiteV1AggregatedResult,
  language: 'DE' | 'EN'
): DecisionSuiteCopy {
  const { hint_band, primary_pattern } = aggregated;

  // Wähle Copy-Dictionary basierend auf Sprache
  const copyDict = language === 'DE' ? copyDE : copyEN;

  // Regel 1: NO_HINT
  if (hint_band === 'NO_HINT') {
    const copy = copyDict.NO_HINT.default;
    return {
      hint_label: copy.hint_label,
      result_line: copy.result_line,
      // Kein focus_question für NO_HINT
    };
  }

  // Regel 2: Andere Bands
  const bandCopy = copyDict[hint_band];

  // Wähle Pattern-spezifische Copy oder Default
  const patternKey: Pattern | 'default' = primary_pattern ?? 'default';
  const copy = bandCopy[patternKey];

  return {
    hint_label: copy.hint_label,
    result_line: copy.result_line,
    focus_question: copy.focus_question,
  };
}
