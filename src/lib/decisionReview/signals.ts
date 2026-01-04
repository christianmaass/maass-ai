import 'server-only';
import type { Decision, ClassifierFlags } from '@/lib/schemas/decision';
import type { Pattern, HintBand, Signals, DecisionSuiteV1AggregatedResult } from '@/lib/decisionSuite/types';

/**
 * Decision Suite v1 - Signal-Beobachtung
 * 
 * Dieses System beobachtet nur strukturelle Signale, urteilt nicht.
 * - Konservativ: Bei Zweifeln immer false
 * - Keine Urteile, keine Interventionen
 * - Nur strukturelle Beobachtungen
 */

/**
 * Beobachtet strukturelle Signale für Objective
 * 
 * Konservativ: Nur wenn explizit vorhanden, dann true
 */
export function observeObjectiveSignals(
  flags: ClassifierFlags
): {
  objective_present: boolean;
  objective_is_effect: boolean;
  objective_has_constraints: boolean;
} {
  // Konservativ: Nur wenn explizit vorhanden
  return {
    objective_present: flags.objective_present === true,
    objective_is_effect: flags.objective_is_effect === true,
    objective_has_constraints: flags.objective_has_constraints === true,
  };
}

/**
 * Beobachtet strukturelle Signale für Optionen
 * 
 * Konservativ: Nur wenn explizit vorhanden, dann true
 */
export function observeOptionsSignals(
  flags: ClassifierFlags
): {
  options_are_implementations: boolean;
  status_quo_excluded: boolean;
} {
  // Konservativ: Nur wenn explizit vorhanden
  return {
    options_are_implementations: flags.options_are_implementations === true,
    status_quo_excluded: flags.status_quo_excluded === true,
  };
}

/**
 * Beobachtet strukturelle Signale für Annahmen
 * 
 * Konservativ: Nur wenn explizit vorhanden, dann true
 */
export function observeAssumptionsSignals(
  flags: ClassifierFlags
): {
  assumptions_are_outcomes: boolean;
  assumptions_are_guaranteed: boolean;
} {
  // Konservativ: Nur wenn explizit vorhanden
  return {
    assumptions_are_outcomes: flags.assumptions_are_outcomes === true,
    assumptions_are_guaranteed: flags.assumptions_are_guaranteed === true,
  };
}

/**
 * Beobachtet strukturelle Signale für Evidenz
 * 
 * Konservativ: Nur wenn explizit vorhanden, dann true
 */
export function observeEvidenceSignals(
  flags: ClassifierFlags
): {
  causal_link_explicit: boolean;
} {
  // Konservativ: Nur wenn explizit vorhanden
  return {
    causal_link_explicit: flags.causal_link_explicit === true,
  };
}

/**
 * Beobachtet alle strukturellen Signale
 * 
 * Konservativ: Nur explizit vorhandene Merkmale werden als true markiert
 */
export function observeAllSignals(flags: ClassifierFlags): Signals {
  return {
    ...observeObjectiveSignals(flags),
    ...observeOptionsSignals(flags),
    ...observeAssumptionsSignals(flags),
    ...observeEvidenceSignals(flags),
  };
}

/**
 * Erkennt strukturelle Muster (nur Beobachtung, keine Urteile)
 * 
 * Konservativ: Nur wenn alle Bedingungen explizit erfüllt sind
 */
export function detectStructuralPatterns(
  decision: Decision,
  flags: ClassifierFlags
): string[] {
  const patterns: string[] = [];

  // Pattern 1: Means-before-Ends Signal
  // Nur wenn ALLE Bedingungen explizit erfüllt sind
  if (
    flags.options_are_implementations === true &&
    flags.causal_link_explicit === false &&
    flags.status_quo_excluded === true &&
    flags.objective_has_constraints === false &&
    (flags.objective_present === false ||
      (flags.objective_is_effect === true && flags.objective_has_constraints === false))
  ) {
    patterns.push('MEANS_BEFORE_ENDS');
  }

  // Pattern 2: Objective Vagueness Signal
  // Nur wenn explizit fehlt oder thematisch
  if (flags.objective_present === false || flags.objective_is_effect === false) {
    patterns.push('OBJECTIVE_VAGUENESS');
  }

  // Pattern 3: Outcome-as-Validation Signal
  // Nur wenn ALLE Bedingungen explizit erfüllt sind
  if (
    flags.options_are_implementations === false &&
    flags.assumptions_are_outcomes === true &&
    flags.assumptions_are_guaranteed === true &&
    flags.causal_link_explicit === false
  ) {
    patterns.push('OUTCOME_AS_VALIDATION');
  }

  return patterns;
}

/**
 * Berechnet Hinweis-Intensität (0.0 - 1.0)
 * 
 * Repräsentiert die Stärke struktureller Signale, die auf Klärungsbedarf hinweisen.
 * 
 * Konservativ: Nur explizite Signale erhöhen die Intensität
 */
export function calculateHintIntensity(
  patterns: string[],
  signals: Signals
): number {
  // Basis: Keine Signale = 0.0
  if (patterns.length === 0) {
    return 0.0;
  }

  // Intensität basierend auf erkannten Mustern
  let intensity = 0.0;

  // OUTCOME_AS_VALIDATION: Höchste Intensität (0.8)
  if (patterns.includes('OUTCOME_AS_VALIDATION')) {
    intensity = Math.max(intensity, 0.8);
  }

  // MEANS_BEFORE_ENDS: Mittlere Intensität (0.5)
  if (patterns.includes('MEANS_BEFORE_ENDS')) {
    intensity = Math.max(intensity, 0.5);
  }

  // OBJECTIVE_VAGUENESS: Niedrige Intensität (0.3)
  if (patterns.includes('OBJECTIVE_VAGUENESS')) {
    intensity = Math.max(intensity, 0.3);
  }

  // Zusätzliche Signale erhöhen leicht die Intensität
  // Aber nur wenn bereits ein Pattern erkannt wurde
  if (intensity > 0) {
    // Fehlende Constraints erhöhen Intensität leicht
    if (!signals.objective_has_constraints && signals.objective_is_effect) {
      intensity = Math.min(intensity + 0.1, 1.0);
    }
    // Fehlende Evidenz erhöht Intensität leicht
    if (!signals.causal_link_explicit && signals.assumptions_are_outcomes) {
      intensity = Math.min(intensity + 0.1, 1.0);
    }
  }

  return Math.min(intensity, 1.0);
}

/**
 * Leitet deterministisch einen Hint Band aus hint_intensity ab.
 * 
 * Diese Funktion ist eine reine Aggregation.
 * - Keine Urteile
 * - Keine Interpretation
 * - Nur number → enum Mapping
 * 
 * Thresholds (v1):
 * - hint_intensity < 0.15 → "NO_HINT"
 * - 0.15 <= hint_intensity <= 0.45 → "CLARIFICATION_NEEDED"
 * - hint_intensity > 0.45 → "STRUCTURALLY_UNCLEAR"
 * 
 * @param hintIntensity - Zahl zwischen 0.0 und 1.0
 * @returns Diskretes Hint Band
 */
export function deriveHintBand(hintIntensity: number): HintBand {
  // Validierung: Stelle sicher, dass hintIntensity im erwarteten Bereich liegt
  const clamped = Math.max(0.0, Math.min(1.0, hintIntensity));

  // Threshold-basierte Mapping
  if (clamped < 0.15) {
    return 'NO_HINT';
  }

  if (clamped <= 0.45) {
    return 'CLARIFICATION_NEEDED';
  }

  // clamped > 0.45
  return 'STRUCTURALLY_UNCLEAR';
}

/**
 * Prioritätsreihenfolge für Pattern-Auswahl (v1)
 * 
 * Höchste Priorität zuerst.
 * Diese Liste ist zentralisiert für einfache Änderungen.
 */
const PATTERN_PRIORITY: Pattern[] = [
  'OUTCOME_AS_VALIDATION',  // Höchste Priorität
  'MEANS_BEFORE_ENDS',      // Mittlere Priorität
  'OBJECTIVE_VAGUENESS',    // Niedrigste Priorität
];

/**
 * Leitet deterministisch eine primäre Pattern aus patterns_detected ab.
 * 
 * Diese Funktion ist eine reine Aggregation.
 * - Keine Urteile
 * - Keine Interpretation
 * - Nur Array → Pattern | null Mapping
 * 
 * Prioritätsregeln (v1):
 * 1. "OUTCOME_AS_VALIDATION" (höchste Priorität)
 * 2. "MEANS_BEFORE_ENDS"
 * 3. "OBJECTIVE_VAGUENESS" (niedrigste Priorität)
 * 
 * Wenn kein Pattern gefunden wird, wird null zurückgegeben.
 * 
 * @param patternsDetected - Array von Pattern-Identifikatoren
 * @returns Primäre Pattern-ID oder null
 */
export function derivePrimaryPattern(patternsDetected: string[]): Pattern | null {
  // Leeres Array → null
  if (patternsDetected.length === 0) {
    return null;
  }

  // Durchlaufe Prioritätsliste und gib das erste gefundene Pattern zurück
  for (const pattern of PATTERN_PRIORITY) {
    if (patternsDetected.includes(pattern)) {
      return pattern;
    }
  }

  // Kein bekanntes Pattern gefunden → null
  return null;
}

