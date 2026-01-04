import 'server-only';
import { z } from 'zod';

/**
 * Schema für strukturierte Entscheidungen (Parser-Output)
 * 
 * Strikte Validierung:
 * - Keine unbekannten Keys erlaubt
 * - Alle Felder sind erforderlich
 * - Minimale Längen-Validierung
 */
export const DecisionSchema = z
  .object({
    decision: z.string().min(1, 'Decision muss mindestens 1 Zeichen lang sein'),
    context: z.string(), // Erlaubt leeren String für dünne Inputs
    objective: z.string(), // Erlaubt leeren String (TR-02 erfordert dies)
    options: z
      .array(z.string())
      .min(2, 'Mindestens 2 Optionen erforderlich'),
    assumptions: z.array(z.string()), // Erlaubt leeres Array (TR-03 prüft Inhalt)
  })
  .strict(); // Reject unknown keys

/**
 * Schema für Klassifikations-Flags (Classifier-Output)
 * 
 * Policy v1.1: Added flags for constraint detection and false certainty detection
 * 
 * Strikte Validierung:
 * - Keine unbekannten Keys erlaubt
 * - Alle Felder sind erforderlich (boolean)
 */
export const ClassifierFlagsSchema = z
  .object({
    options_are_implementations: z.boolean(),
    status_quo_excluded: z.boolean(),
    causal_link_explicit: z.boolean(),
    assumptions_are_outcomes: z.boolean(),
    objective_present: z.boolean(),
    objective_is_effect: z.boolean(),
    objective_has_constraints: z.boolean(), // NEW v1.1: Cost, time, risk, quality mentioned
    assumptions_are_guaranteed: z.boolean(), // NEW v1.1: Assumptions phrased as certainty
  })
  .strict(); // Reject unknown keys

/**
 * Schema für Decision Suite v1 Response
 * 
 * Decision Suite v1 beobachtet nur strukturelle Signale, urteilt nicht.
 * - Keine Urteile (FRAGILE/NOT_FRAGILE)
 * - Keine Interventionen (nur strukturelle Signale)
 * - Konservativ: Bei Zweifeln immer false
 * - Nur JSON, keine Erklärungen
 * 
 * Das System identifiziert strukturelle Signale, die auf Klärungsbedarf hinweisen können.
 * Die Ausgabe repräsentiert Hinweis-Intensität, nicht formale Validierung.
 */
export const DecisionSuiteV1ResponseSchema = z
  .object({
    // Strukturelle Signale (nur beobachtet, nicht beurteilt)
    signals: z.object({
      // Signal: Objektive Struktur
      objective_present: z.boolean(),
      objective_is_effect: z.boolean(),
      objective_has_constraints: z.boolean(),
      
      // Signal: Optionen-Struktur
      options_are_implementations: z.boolean(),
      status_quo_excluded: z.boolean(),
      
      // Signal: Annahmen-Struktur
      assumptions_are_outcomes: z.boolean(),
      assumptions_are_guaranteed: z.boolean(),
      
      // Signal: Evidenz-Struktur
      causal_link_explicit: z.boolean(),
    }),
    
    // Hinweis-Intensität (0.0 - 1.0)
    // Repräsentiert die Stärke struktureller Signale, die auf Klärungsbedarf hinweisen
    hint_intensity: z.number().min(0).max(1),
    
    // Hint Band (diskretes Aggregat aus hint_intensity)
    // Deterministisch abgeleitet aus hint_intensity, keine Urteile
    hint_band: z.enum(['NO_HINT', 'CLARIFICATION_NEEDED', 'STRUCTURALLY_UNCLEAR']),
    
    // Strukturelle Muster erkannt (nur IDs, keine Urteile)
    patterns_detected: z.array(z.string()),
    
    // Primäre Pattern (deterministisch aus patterns_detected ausgewählt)
    // Prioritätsregel: OUTCOME_AS_VALIDATION > MEANS_BEFORE_ENDS > OBJECTIVE_VAGUENESS
    // null wenn kein Pattern vorhanden
    primary_pattern: z.enum(['OUTCOME_AS_VALIDATION', 'MEANS_BEFORE_ENDS', 'OBJECTIVE_VAGUENESS']).nullable(),
  })
  .strict(); // Reject unknown keys

/**
 * Type-Inferenz für DecisionSchema
 */
export type Decision = z.infer<typeof DecisionSchema>;

/**
 * Type-Inferenz für ClassifierFlagsSchema
 */
export type ClassifierFlags = z.infer<typeof ClassifierFlagsSchema>;

/**
 * Type-Inferenz für DecisionSuiteV1ResponseSchema
 */
export type DecisionSuiteV1Response = z.infer<typeof DecisionSuiteV1ResponseSchema>;

