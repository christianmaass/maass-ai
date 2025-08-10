import { z } from 'zod';

/**
 * Foundation Case Submission Schemas
 *
 * SICHERHEITSSTRATEGIE:
 * - Phase 1: Additive Validation (non-breaking)
 * - Phase 2: Feature Flag für strenge Validation
 * - Phase 3: Graduelle Migration
 */

// ✅ SICHER: Backwards-Compatible Schema (Phase 1)
export const FoundationSubmitSchemaV1 = z.object({
  case_id: z.string().min(1, 'Case ID ist erforderlich'),
  response_data: z.any(), // BEWUSST any - bestehende Struktur beibehalten
  interaction_type: z.string().min(1, 'Interaction Type ist erforderlich'),
});

// ✅ ZUKUNFT: Strenge Validation (Phase 2 - Feature Flag)
export const FoundationSubmitSchemaV2 = z.object({
  case_id: z.string().uuid('Case ID muss eine gültige UUID sein'),
  response_data: z.object({
    answers: z.array(z.string()).optional(),
    decision_matrix: z.record(z.string(), z.number()).optional(),
    confidence_level: z.number().min(1).max(5).optional(),
    text_response: z.string().optional(),
    multiple_choice_selection: z.string().optional(),
  }),
  interaction_type: z.enum(['multiple_choice', 'text_input', 'decision_matrix', 'assessment']),
});

// ✅ RESPONSE Schema für API-Antworten
export const FoundationSubmitResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    response: z.object({
      id: z.string(),
      case_id: z.string(),
      user_id: z.string().nullable(),
      responses: z.any(),
      interaction_type: z.string(),
      submitted_at: z.string(),
    }),
    assessment: z.object({
      id: z.string().optional(),
      case_id: z.string(),
      overall_score: z.number(),
      dimension_scores: z.record(z.string(), z.number()),
      feedback: z.string(),
      created_at: z.string(),
    }),
  }),
  meta: z.object({
    execution_time_ms: z.number(),
  }),
});

// ✅ ERROR Schema für konsistente Fehlerbehandlung
export const FoundationErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  details: z.any().optional(),
  case_id: z.string().optional(),
});

// Type Exports für TypeScript
export type FoundationSubmitV1 = z.infer<typeof FoundationSubmitSchemaV1>;
export type FoundationSubmitV2 = z.infer<typeof FoundationSubmitSchemaV2>;
export type FoundationSubmitResponse = z.infer<typeof FoundationSubmitResponseSchema>;
export type FoundationError = z.infer<typeof FoundationErrorSchema>;

// ✅ Validation Helper Functions
export const validateFoundationSubmit = {
  // Sichere Validation (non-breaking)
  safe: (data: unknown) => FoundationSubmitSchemaV1.safeParse(data),

  // Strenge Validation (opt-in)
  strict: (data: unknown) => FoundationSubmitSchemaV2.safeParse(data),

  // Response Validation
  response: (data: unknown) => FoundationSubmitResponseSchema.safeParse(data),
};
