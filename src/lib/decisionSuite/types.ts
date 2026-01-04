/**
 * Decision Suite v1 Types
 * 
 * Client-seitige Type-Definitionen für Decision Suite v1.
 * Diese Types können sowohl client- als auch server-seitig verwendet werden.
 */

/**
 * Pattern Type
 * 
 * Bekannte strukturelle Pattern-Identifikatoren.
 */
export type Pattern = 'OUTCOME_AS_VALIDATION' | 'MEANS_BEFORE_ENDS' | 'OBJECTIVE_VAGUENESS';

/**
 * Hint Band Type
 * 
 * Diskretes Band für Hinweis-Intensität.
 * Diese Werte sind Heuristiken, keine Urteile.
 */
export type HintBand = 'NO_HINT' | 'CLARIFICATION_NEEDED' | 'STRUCTURALLY_UNCLEAR';

/**
 * Signals Type
 * 
 * Strukturelle Signale, die aus ClassifierFlags beobachtet werden.
 */
export interface Signals {
  objective_present: boolean;
  objective_is_effect: boolean;
  objective_has_constraints: boolean;
  options_are_implementations: boolean;
  status_quo_excluded: boolean;
  assumptions_are_outcomes: boolean;
  assumptions_are_guaranteed: boolean;
  causal_link_explicit: boolean;
}

/**
 * Decision Suite v1 Aggregated Result
 * 
 * Single Source of Truth für die vollständige Decision Suite v1 Response.
 * 
 * Diese Type-Definition repräsentiert den finalen aggregierten Output-Contract
 * und wird sowohl in der API-Route als auch in downstream usage verwendet.
 * 
 * Die Struktur entspricht exakt dem DecisionSuiteV1ResponseSchema (Zod).
 */
export interface DecisionSuiteV1AggregatedResult {
  /**
   * Strukturelle Signale (nur beobachtet, nicht beurteilt)
   */
  signals: Signals;

  /**
   * Hinweis-Intensität (0.0 - 1.0)
   * Repräsentiert die Stärke struktureller Signale, die auf Klärungsbedarf hinweisen
   */
  hint_intensity: number;

  /**
   * Hint Band (diskretes Aggregat aus hint_intensity)
   * Deterministisch abgeleitet aus hint_intensity, keine Urteile
   */
  hint_band: HintBand;

  /**
   * Strukturelle Muster erkannt (nur IDs, keine Urteile)
   */
  patterns_detected: string[];

  /**
   * Primäre Pattern (deterministisch aus patterns_detected ausgewählt)
   * Prioritätsregel: OUTCOME_AS_VALIDATION > MEANS_BEFORE_ENDS > OBJECTIVE_VAGUENESS
   * null wenn kein Pattern vorhanden
   */
  primary_pattern: Pattern | null;
}

