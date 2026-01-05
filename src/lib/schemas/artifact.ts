import 'server-only';
import { z } from 'zod';

/**
 * Schema für strukturierte Artefakte
 *
 * Dies ist das neue Domain Model: Artefakte als Single Source of Truth.
 * Keine LLM-Interpretation, nur strukturierte Eingabe.
 */
export const ArtifactSchema = z
  .object({
    objective: z.string().min(1, 'Objective muss mindestens 1 Zeichen lang sein'),
    problem_statement: z.string().min(1, 'Problem Statement muss mindestens 1 Zeichen lang sein'),
    options: z
      .array(
        z.object({
          id: z.string().optional(),
          text: z.string().min(1, 'Option Text muss mindestens 1 Zeichen lang sein'),
          trade_offs: z.string().optional(),
        })
      )
      .min(2, 'Mindestens 2 Optionen erforderlich'),
    assumptions: z
      .array(
        z.object({
          id: z.string().optional(),
          text: z.string().min(1, 'Assumption Text muss mindestens 1 Zeichen lang sein'),
          evidence: z.string().optional(),
        })
      )
      .optional()
      .default([]),
    hypotheses: z
      .array(
        z.object({
          id: z.string().optional(),
          text: z.string().min(1, 'Hypothesis Text muss mindestens 1 Zeichen lang sein'),
          test: z.string().optional(),
        })
      )
      .optional()
      .default([]),
  })
  .strict();

export type Artifact = z.infer<typeof ArtifactSchema>;

/**
 * Deterministische Ableitung von ClassifierFlags aus Artefakten
 *
 * Da wir kein LLM mehr haben, müssen wir die Flags deterministisch
 * aus der strukturierten Eingabe ableiten.
 */
export function deriveClassifierFlagsFromArtifact(artifact: Artifact): {
  options_are_implementations: boolean;
  status_quo_excluded: boolean;
  causal_link_explicit: boolean;
  assumptions_are_outcomes: boolean;
  objective_present: boolean;
  objective_is_effect: boolean;
  objective_has_constraints: boolean;
  assumptions_are_guaranteed: boolean;
} {
  // Objective ist immer present (da required im Schema)
  const objective_present = artifact.objective.length > 0;

  // Prüfe ob Objective ein Effect ist (enthält Wirkungs-Wörter)
  const effectKeywords = [
    'reduce',
    'increase',
    'improve',
    'decrease',
    'minimize',
    'maximize',
    'reduzieren',
    'erhöhen',
    'verbessern',
    'verringern',
    'minimieren',
    'maximieren',
  ];
  const objective_is_effect = effectKeywords.some((keyword) =>
    artifact.objective.toLowerCase().includes(keyword)
  );

  // Prüfe ob Objective Constraints hat (Kosten, Zeit, Risiko, Qualität)
  const constraintKeywords = [
    'cost',
    'time',
    'risk',
    'quality',
    'budget',
    'deadline',
    'resources',
    'kosten',
    'zeit',
    'risiko',
    'qualität',
    'budget',
    'frist',
    'ressourcen',
  ];
  const objective_has_constraints = constraintKeywords.some((keyword) =>
    artifact.objective.toLowerCase().includes(keyword)
  );

  // Prüfe ob Optionen Implementierungen sind (enthält Tool/Technologie-Namen)
  const implementationKeywords = [
    'tool',
    'software',
    'platform',
    'system',
    'service',
    'vendor',
    'tool',
    'software',
    'plattform',
    'system',
    'dienst',
    'anbieter',
  ];
  const options_are_implementations = artifact.options.some((option) =>
    implementationKeywords.some((keyword) => option.text.toLowerCase().includes(keyword))
  );

  // Status quo ist excluded wenn nicht explizit als Option vorhanden
  const statusQuoKeywords = [
    'status quo',
    'current',
    'existing',
    'keep',
    'stay',
    'bestehend',
    'aktuell',
    'behalten',
    'bleiben',
  ];
  const status_quo_excluded = !artifact.options.some((option) =>
    statusQuoKeywords.some((keyword) => option.text.toLowerCase().includes(keyword))
  );

  // Causal link ist explicit wenn Problem Statement und Objective klar verknüpft sind
  const causal_link_explicit =
    artifact.problem_statement.length > 0 &&
    artifact.objective.length > 0 &&
    (artifact.problem_statement.toLowerCase().includes('because') ||
      artifact.problem_statement.toLowerCase().includes('weil') ||
      artifact.problem_statement.toLowerCase().includes('due to') ||
      artifact.problem_statement.toLowerCase().includes('aufgrund'));

  // Prüfe ob Assumptions Outcomes sind (enthält Ergebnis-Wörter)
  const outcomeKeywords = [
    'result',
    'outcome',
    'success',
    'failure',
    'win',
    'lose',
    'ergebnis',
    'erfolg',
    'misserfolg',
    'gewinn',
    'verlust',
  ];
  const assumptions_are_outcomes = artifact.assumptions.some((assumption) =>
    outcomeKeywords.some((keyword) => assumption.text.toLowerCase().includes(keyword))
  );

  // Prüfe ob Assumptions als sicher formuliert sind (keine Unsicherheits-Marker)
  const uncertaintyKeywords = [
    'maybe',
    'perhaps',
    'possibly',
    'might',
    'could',
    'uncertain',
    'vielleicht',
    'möglicherweise',
    'könnte',
    'unsicher',
  ];
  const assumptions_are_guaranteed =
    artifact.assumptions.length > 0 &&
    artifact.assumptions.every(
      (assumption) =>
        !uncertaintyKeywords.some((keyword) => assumption.text.toLowerCase().includes(keyword))
    );

  return {
    options_are_implementations,
    status_quo_excluded,
    causal_link_explicit,
    assumptions_are_outcomes,
    objective_present,
    objective_is_effect,
    objective_has_constraints,
    assumptions_are_guaranteed,
  };
}

/**
 * Konvertiert Artefakt zu Decision-Format (für Signals-System)
 */
export function artifactToDecision(artifact: Artifact): {
  decision: string;
  context: string;
  objective: string;
  options: string[];
  assumptions: string[];
} {
  return {
    decision: artifact.problem_statement.substring(0, 100) || 'Decision',
    context: artifact.problem_statement,
    objective: artifact.objective,
    options: artifact.options.map((opt) => opt.text),
    assumptions: artifact.assumptions.map((ass) => ass.text),
  };
}
