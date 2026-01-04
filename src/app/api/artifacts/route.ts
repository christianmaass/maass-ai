import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ArtifactSchema, deriveClassifierFlagsFromArtifact, artifactToDecision } from '@/lib/schemas/artifact';
import {
  observeAllSignals,
  detectStructuralPatterns,
  calculateHintIntensity,
  deriveHintBand,
  derivePrimaryPattern,
} from '@/lib/decisionReview/signals';
import { deriveDecisionSuiteCopy } from '@/lib/decisionSuite/copy';
import { detectLanguage } from '@/lib/decisionReview/language';
import { createServerClient } from '@/lib/db';
import { getAuthUser } from '@/lib/auth/guards';
import { validateOrigin } from '@/lib/security/csrf';
import type { DecisionSuiteV1AggregatedResult } from '@/lib/decisionSuite/types';

/**
 * POST /api/artifacts
 * 
 * Speichert strukturierte Artefakte und generiert deterministisches Feedback.
 * Keine LLM-Verwendung, alles deterministisch.
 */
export async function POST(request: NextRequest) {
  // CSRF-Schutz: Origin-Header-Validierung
  const csrfError = validateOrigin(request);
  if (csrfError) {
    return csrfError;
  }
  try {
    const body = await request.json();
    const artifact = ArtifactSchema.parse(body);

    // Step 1: Deterministische Ableitung von ClassifierFlags aus Artefakten
    const flags = deriveClassifierFlagsFromArtifact(artifact);

    // Step 2: Konvertiere Artefakt zu Decision-Format (für Signals-System)
    const decision = artifactToDecision(artifact);

    // Step 3: Beobachte strukturelle Signale (deterministisch)
    const signals = observeAllSignals(flags);

    // Step 4: Erkenne strukturelle Muster (nur Beobachtung, keine Urteile)
    const patterns = detectStructuralPatterns(decision, flags);

    // Step 5: Berechne Hinweis-Intensität
    const hintIntensity = calculateHintIntensity(patterns, signals);

    // Step 6: Leite Hint Band deterministisch ab
    const hintBand = deriveHintBand(hintIntensity);

    // Step 7: Leite primäre Pattern deterministisch ab
    const primaryPattern = derivePrimaryPattern(patterns);

    // Step 8: Erstelle aggregiertes Result-Objekt
    const aggregatedResult: DecisionSuiteV1AggregatedResult = {
      signals,
      hint_intensity: hintIntensity,
      hint_band: hintBand,
      patterns_detected: patterns,
      primary_pattern: primaryPattern,
    };

    // Step 9: Generiere Template-basiertes Feedback (deterministisch)
    const inputText = `${artifact.problem_statement} ${artifact.objective}`;
    const language = detectLanguage(inputText);
    const copy = deriveDecisionSuiteCopy(aggregatedResult, language === 'de' ? 'DE' : 'EN');

    // Step 10: Speichere in Supabase (optional, non-blocking)
    try {
      const user = await getAuthUser();
      if (user) {
        const supabase = await createServerClient();
        
        // Persist asynchronously - don't block the response
        void (async () => {
          try {
            // Speichere Artefakt
            const { data: artifactData, error: artifactError } = await supabase
              .from('artifacts')
              .insert({
                user_id: user.id,
                objective: artifact.objective,
                problem_statement: artifact.problem_statement,
                options: artifact.options,
                assumptions: artifact.assumptions,
                hypotheses: artifact.hypotheses,
              })
              .select()
              .single();

            if (artifactError) {
              // SECURITY: Don't log sensitive error details in production
              if (process.env.NODE_ENV !== 'production') {
                console.error('Failed to persist artifact:', artifactError);
              } else {
                console.error('Failed to persist artifact:', artifactError.code || 'DatabaseError');
              }
              return;
            }

            // Speichere Ergebnis
            if (artifactData) {
              const { error: resultError } = await supabase
                .from('artifact_results')
                .insert({
                  artifact_id: artifactData.id,
                  signals: signals,
                  hint_intensity: hintIntensity,
                  hint_band: hintBand,
                  patterns_detected: patterns,
                  feedback: copy,
                });

              if (resultError) {
                // SECURITY: Don't log sensitive error details in production
                if (process.env.NODE_ENV !== 'production') {
                  console.error('Failed to persist artifact result:', resultError);
                } else {
                  console.error('Failed to persist artifact result:', resultError.code || 'DatabaseError');
                }
              }
            }
          } catch (err) {
            // SECURITY: Don't log sensitive error details in production
            if (process.env.NODE_ENV !== 'production') {
              console.error('Error persisting artifact:', err);
            } else {
              console.error('Error persisting artifact:', err instanceof Error ? err.name : 'UnknownError');
            }
          }
        })();
      }
    } catch (authError) {
      // Log auth error but don't fail the request (persistence is optional)
      // SECURITY: Don't log sensitive error details in production
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error getting auth user for persistence:', authError);
      } else {
        console.error('Error getting auth user:', authError instanceof Error ? authError.name : 'AuthError');
      }
    }

    // Step 11: Response zusammenstellen
    return NextResponse.json(
      {
        ...aggregatedResult,
        feedback: copy,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error_code: 'VALIDATION_ERROR', message: error.issues.map((i) => i.message).join('; ') },
        { status: 400 }
      );
    }

    // SECURITY: Don't log sensitive error details in production
    if (process.env.NODE_ENV !== 'production') {
      console.error('Unexpected error in artifacts API:', error);
    } else {
      console.error('Unexpected error in artifacts API:', error instanceof Error ? error.name : 'UnknownError');
    }
    return NextResponse.json(
      {
        error_code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/artifacts
 * 
 * Lädt gespeicherte Artefakte für den aktuellen Nutzer.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error_code: 'UNAUTHORIZED', message: 'Not authenticated' }, { status: 401 });
    }

    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('artifacts')
      .select('*, artifact_results(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      // SECURITY: Don't log sensitive error details in production
      if (process.env.NODE_ENV !== 'production') {
        console.error('Failed to load artifacts:', error);
      } else {
        console.error('Failed to load artifacts:', error.code || 'DatabaseError');
      }
      return NextResponse.json(
        { error_code: 'DATABASE_ERROR', message: 'Failed to load artifacts' },
        { status: 500 }
      );
    }

    return NextResponse.json({ artifacts: data || [] }, { status: 200 });
  } catch (error) {
    // SECURITY: Don't log sensitive error details in production
    if (process.env.NODE_ENV !== 'production') {
      console.error('Unexpected error in artifacts GET:', error);
    } else {
      console.error('Unexpected error in artifacts GET:', error instanceof Error ? error.name : 'UnknownError');
    }
    return NextResponse.json(
      {
        error_code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

