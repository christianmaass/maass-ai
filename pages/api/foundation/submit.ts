/**
 * FOUNDATION SUBMIT API
 * Migrated to navaa Auth Guidelines (WP-C1)
 *
 * COMPLIANCE:
 * - Uses withAuth() middleware (MANDATORY)
 * - JWT token validation via auth middleware
 * - Secure foundation response submission with proper authentication
 * - No manual JWT extraction
 *
 * @version 2.0.0 (WP-C1 Backend Migration)
 */

import { NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import {
  FoundationApiError,
  FoundationResponse,
  FoundationAssessment,
} from '../../../types/foundation.types';
import {
  validateFoundationSubmit,
  FoundationSubmitV1,
} from '../../../lib/schemas/foundation.schemas';
import { withAuth, AuthenticatedRequest, getUserId } from '../../../lib/middleware/auth';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Performance timer utility
function createPerformanceTimer() {
  const start = Date.now();
  return {
    start,
    end: () => Date.now() - start,
  };
}

// =============================================================================
// NAVAA AUTH INTEGRATION (WP-C1 Migration)
// =============================================================================
// Manual JWT extraction REMOVED - now handled by withAuth() middleware

// AI Assessment function
async function generateAssessment(
  foundationCase: any,
  response: FoundationResponse,
): Promise<FoundationAssessment> {
  try {
    // Get OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Prepare MC answers summary
    const mcAnswers = Object.entries(response.response_data)
      .filter(([key]) => key.startsWith('mc_'))
      .map(([key, value]) => {
        const questionId = key.replace('mc_', '');
        const question = (
          foundationCase.content.multiple_choice_questions as
            | Array<{
                id: string;
                question: string;
                options?: Array<{ id: string; text: string; correct?: boolean }>;
              }>
            | undefined
        )?.find((q: { id: string }) => q.id === questionId);
        const selectedOption = question?.options?.find(
          (opt: { id: string; text: string; correct?: boolean }) => opt.id === (value as string),
        );
        return {
          question: question?.question || 'Unknown question',
          selected: selectedOption?.text || 'Unknown option',
          correct: selectedOption?.correct || false,
        };
      });

    const mcScore = mcAnswers.reduce((acc, answer) => acc + (answer.correct ? 1 : 0), 0);
    const mcPercentage = Math.round((mcScore / mcAnswers.length) * 100);

    // Create assessment prompt
    const prompt = `
Du bist ein Experte für Strategieberatung und bewertest eine Foundation Track Antwort.

CASE: ${foundationCase.title}
TOOL: ${foundationCase.tool}
CLUSTER: ${foundationCase.cluster}

MULTIPLE CHOICE ERGEBNISSE:
${mcAnswers.map((a) => `- ${a.question}: ${a.selected} (${a.correct ? 'RICHTIG' : 'FALSCH'})`).join('\n')}
MC Score: ${mcScore}/${mcAnswers.length} (${mcPercentage}%)

HYPOTHESE DES USERS:
"${response.response_data.hypothesis || 'Keine Hypothese angegeben'}"

Bewerte die Antwort auf einer Skala von 0-100 in folgenden Dimensionen:
1. problem_understanding (0-100): Versteht der User das Problem?
2. analytical_approach (0-100): Ist der analytische Ansatz strukturiert?
3. recommendation_quality (0-100): Sind die Empfehlungen praktikabel?
4. communication (0-100): Ist die Kommunikation klar und präzise?

Berücksichtige sowohl MC-Performance als auch Hypothesen-Qualität.

Antworte im JSON Format:
{
  "overall_score": 85,
  "dimension_scores": {
    "problem_understanding": 80,
    "analytical_approach": 85,
    "recommendation_quality": 90,
    "communication": 85
  },
  "feedback": {
    "strengths": ["Punkt 1", "Punkt 2"],
    "improvements": ["Verbesserung 1", "Verbesserung 2"],
    "detailed_feedback": "Detailliertes Feedback hier..."
  }
}`;

    // Call OpenAI API
    const response_ai = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'Du bist ein Experte für Strategieberatung und bewertest Foundation Track Antworten. Antworte immer im angegebenen JSON Format.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response_ai.ok) {
      throw new Error(`OpenAI API error: ${response_ai.status}`);
    }

    const aiResult = await response_ai.json();
    const assessmentText = aiResult.choices[0]?.message?.content;

    if (!assessmentText) {
      throw new Error('No assessment content received from OpenAI');
    }

    // Parse JSON response
    const assessmentData = JSON.parse(assessmentText);

    // Create assessment object
    const assessment: FoundationAssessment = {
      id: `assessment_${Date.now()}`,
      case_id: foundationCase.id,
      response_id: `response_${Date.now()}`,
      overall_score: assessmentData.overall_score,
      dimension_scores: assessmentData.dimension_scores,
      feedback: assessmentData.feedback,
      created_at: new Date().toISOString(),
    };

    return assessment;
  } catch (error) {
    console.error('AI Assessment failed:', error);

    // Fallback assessment
    return {
      id: `assessment_${Date.now()}`,
      case_id: foundationCase.id,
      response_id: `response_${Date.now()}`,
      overall_score: 75,
      dimension_scores: {
        problem_understanding: 75,
        analytical_approach: 75,
        recommendation_quality: 75,
        communication: 75,
      },
      feedback:
        'Ihre Antwort zeigt grundlegendes Verständnis. Stärken: Antwort eingereicht, Engagement gezeigt. Verbesserungen: Detailliertere Analyse, Strukturiertere Argumentation. Für eine detailliertere Bewertung versuchen Sie es später erneut.',
      created_at: new Date().toISOString(),
    };
  }
}

// Error handler
function handleApiError(error: any, res: NextApiResponse, operation: string) {
  console.error(`API Error in ${operation}:`, error);

  const apiError: FoundationApiError = {
    success: false,
    error: {
      message: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    },
  };

  res.status(500).json(apiError);
}

// Main API handler with Auth Middleware (WP-C1 Migration)
async function foundationSubmitHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const performanceTimer = createPerformanceTimer();

  try {
    // ✅ PHASE 1: Sichere Zod-Validation (additive, non-breaking)
    const zodValidationResult = validateFoundationSubmit.safe(req.body);

    if (!zodValidationResult.success) {
      // ⚠️ WARNUNG loggen, aber NICHT abbrechen (backwards compatibility)
      console.warn('🔍 Zod validation failed (non-breaking):', {
        errors: zodValidationResult.error.issues,
        body: req.body,
      });
    } else {
      console.log('✅ Zod validation passed');
    }

    // ✅ BESTEHENDE Validation beibehalten (garantiert keine Breaking Changes)
    const { case_id, response_data, interaction_type } = req.body;

    if (!case_id || !response_data || !interaction_type) {
      return res.status(400).json({
        success: false,
        error: 'case_id, response_data, and interaction_type are required',
      });
    }

    // Get user from Auth Middleware (WP-C1 Migration)
    const userId = getUserId(req); // User already validated by withAuth() middleware

    // Get foundation case
    const { data: foundationCase, error: caseError } = await supabase
      .from('foundation_cases')
      .select('*')
      .eq('id', case_id)
      .single();

    if (caseError || !foundationCase) {
      return res.status(404).json({
        success: false,
        error: 'Foundation case not found',
      });
    }

    // Create response object
    const foundationResponse: FoundationResponse = {
      case_id,
      response_data,
      interaction_type,
    };

    // Save response to database (upsert to handle duplicate submissions)
    const { data: savedResponse, error: saveError } = await supabase
      .from('foundation_responses')
      .upsert(
        {
          case_id,
          user_id: userId,
          responses: response_data,
          interaction_type,
          submitted_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,case_id',
        },
      )
      .select()
      .single();

    if (saveError) {
      console.error('Database save error:', saveError);
      throw new Error(`Failed to save response: ${saveError.message}`);
    }

    // Generate AI assessment
    const assessment = await generateAssessment(foundationCase, foundationResponse);

    // Save assessment to database
    const { data: savedAssessment, error: assessmentError } = await supabase
      .from('foundation_assessments')
      .insert({
        case_id: assessment.case_id,
        response_id: savedResponse.id,
        user_id: userId,
        overall_score: assessment.overall_score,
        dimension_scores: assessment.dimension_scores,
        feedback: assessment.feedback,
        created_at: assessment.created_at,
      })
      .select()
      .single();

    if (assessmentError) {
      console.error('Assessment save error:', assessmentError);
      // Continue anyway - we have the assessment data
    }

    // Build response
    const response = {
      success: true,
      data: {
        response: savedResponse,
        assessment: {
          ...assessment,
          id: savedAssessment?.id || assessment.id,
        },
      },
      meta: {
        execution_time_ms: performanceTimer.end(),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    handleApiError(error, res, 'Foundation submit');
  }
}

// Export handler with Auth Middleware (WP-C1 Migration)
export default withAuth(foundationSubmitHandler);
