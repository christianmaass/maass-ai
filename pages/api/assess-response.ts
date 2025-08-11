import { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient } from '../../supabaseClient';
import OpenAI from 'openai';
import { withOpenAIRateLimit } from '../../lib/rateLimiter';
import { logger, createPerformanceTimer, extractUserIdFromRequest } from '../../lib/logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// MBB Assessment Prompt
const ASSESSMENT_PROMPT = `Du trainierst Unternehmensberater und bist selbst ein langjähriger Partner bei McKinsey, der Boston Consulting Group und Bain.

Bewerte die folgende Antwort nach den 5 MBB-Kriterien auf einer Skala von 1-10:

1. **Problemstrukturierung & Klarheit** (1-10)
- Logisches, MECE, top-down Denken?
- Falltyp erkannt?
- Strukturierte Frameworks genutzt?

2. **Analytische Exzellenz & Faktenorientierung** (1-10)  
- Sauberes Rechnen/Schätzen?
- Hebel identifiziert statt nur Symptome?
- Quantifizierung wo möglich?

3. **Wirtschaftliches & strategisches Denken** (1-10)
- Strategische Optionen identifiziert?
- Business-Kontext verstanden?
- Wertbeiträge und Trade-offs berücksichtigt?

4. **Empfehlung & Entscheidungskompetenz** (1-10)
- Klare, belastbare Empfehlung?
- Nachvollziehbar und umsetzbar?
- Mut zur Festlegung?

5. **Kommunikation & Executive Presence** (1-10)
- Klar, prägnant, verständlich?
- Strukturierte Darstellung?
- Überzeugende Argumentation?

**CASE:**
{case_description}

**ANTWORT:**
{user_response}

**FORMAT DER BEWERTUNG:**
Gib deine Bewertung in folgendem JSON-Format zurück:
{
  "scores": {
    "problemstrukturierung": X,
    "analytik": X,
    "strategie": X, 
    "empfehlung": X,
    "kommunikation": X
  },
  "total_score": X.X,
  "feedback": "Detailliertes Feedback mit Stärken, Schwächen und konkreten Verbesserungsvorschlägen...",
  "improvement_areas": ["Bereich1", "Bereich2"]
}`;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Initialize performance tracking and logging context
  const performanceTimer = createPerformanceTimer('assess-response-total');
  const userId = extractUserIdFromRequest(req) || req.body.user_id;

  logger.info('Assessment Request Started', {
    userId,
    endpoint: '/api/assess-response',
    caseId: req.body.case_id,
    userResponseId: req.body.user_response_id,
  });

  if (req.method !== 'POST') {
    logger.warn('Invalid Method for Assessment', { userId, method: req.method });
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user_id, case_id, user_response_id } = req.body;

    if (!user_id || !case_id || !user_response_id) {
      logger.error('Missing Required Parameters for Assessment', {
        userId,
        user_id,
        case_id,
        user_response_id,
      });
      return res.status(400).json({ error: 'user_id, case_id, and user_response_id are required' });
    }

    const supabase = getSupabaseClient();

    // Case und Response Details abrufen
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('*')
      .eq('id', case_id)
      .single();

    const { data: responseData, error: responseError } = await supabase
      .from('user_responses')
      .select('*')
      .eq('id', user_response_id)
      .single();

    if (caseError || responseError || !caseData || !responseData) {
      logger.error('Case or Response Not Found', {
        userId,
        caseId: case_id,
        userResponseId: user_response_id,
        caseError: caseError?.message,
        responseError: responseError?.message,
      });
      return res.status(404).json({ error: 'Case or response not found' });
    }

    logger.info('Case and Response Data Retrieved', {
      userId,
      caseId: case_id,
      userResponseId: user_response_id,
      caseTitle: caseData.title,
      responseLength: responseData.response_text?.length || 0,
    });

    // Assessment Prompt personalisieren
    const personalizedPrompt = ASSESSMENT_PROMPT.replace(
      '{case_description}',
      caseData.description,
    ).replace('{user_response}', responseData.response_text);

    // GPT Assessment durchführen - mit Performance Tracking
    const openaiTimer = createPerformanceTimer('openai-assessment');

    logger.info('OpenAI Assessment Started', {
      userId,
      caseId: case_id,
      userResponseId: user_response_id,
      model: 'gpt-4o',
      maxTokens: 1200,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: personalizedPrompt,
        },
        {
          role: 'user',
          content:
            'Bewerte diese Antwort nach den MBB-Kriterien und gib das Ergebnis im JSON-Format zurück.',
        },
      ],
      max_tokens: 1200,
      temperature: 0.3,
    });

    const openaiDuration = openaiTimer.end({ userId, operation: 'assessment' });

    // Log OpenAI usage for cost tracking
    const tokensUsed = completion.usage?.total_tokens || 0;
    const estimatedCost = (tokensUsed / 1000) * 0.03; // Rough GPT-4o cost estimate

    logger.openaiUsage('gpt-4o', tokensUsed, estimatedCost, userId, {
      operation: 'assessment',
      duration: openaiDuration,
      caseId: case_id,
      userResponseId: user_response_id,
    });

    const assessmentText = completion.choices[0]?.message?.content;

    if (!assessmentText) {
      logger.error('OpenAI Assessment Generation Failed', {
        userId,
        caseId: case_id,
        userResponseId: user_response_id,
        tokensUsed,
        duration: openaiDuration,
      });
      return res.status(500).json({ error: 'Failed to generate assessment' });
    }

    // JSON aus GPT Response extrahieren
    let assessmentData;
    try {
      // Versuche JSON zu parsen (GPT gibt manchmal zusätzlichen Text zurück)
      const jsonMatch = assessmentText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        assessmentData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing assessment JSON:', parseError);
      return res.status(500).json({ error: 'Failed to parse assessment' });
    }

    // Assessment in Datenbank speichern
    const { data: savedAssessment, error: saveError } = await supabase
      .from('assessments')
      .insert({
        user_id,
        case_id,
        user_response_id,
        scores: assessmentData.scores,
        feedback: assessmentData.feedback,
        total_score: assessmentData.total_score,
        improvement_areas: assessmentData.improvement_areas || [],
      })
      .select()
      .single();

    if (saveError) {
      logger.error('Database Assessment Save Failed', {
        userId,
        caseId: case_id,
        userResponseId: user_response_id,
        error: saveError.message,
        operation: 'assessment-save',
      });
      return res.status(500).json({ error: 'Failed to save assessment' });
    }

    // Log successful assessment creation (Business Event)
    logger.businessEvent('Assessment Completed Successfully', {
      userId,
      caseId: case_id,
      userResponseId: user_response_id,
      assessmentId: savedAssessment.id,
      totalScore: assessmentData.total_score,
      tokensUsed,
      estimatedCost,
    });

    // User Progress aktualisieren
    try {
      await updateUserProgress(
        user_id,
        assessmentData.total_score,
        assessmentData.improvement_areas,
      );
      logger.info('User Progress Updated', { userId, totalScore: assessmentData.total_score });
    } catch (progressError) {
      logger.warn('User Progress Update Failed', {
        userId,
        error: progressError instanceof Error ? progressError.message : 'Unknown error',
        operation: 'progress-update',
      });
    }

    // Log final performance metrics
    const totalDuration = performanceTimer.end({
      userId,
      assessmentId: savedAssessment.id,
      success: true,
    });

    logger.info('Assessment Completed Successfully', {
      userId,
      caseId: case_id,
      userResponseId: user_response_id,
      assessmentId: savedAssessment.id,
      totalDuration,
      totalScore: assessmentData.total_score,
    });

    res.status(200).json({
      assessment: savedAssessment,
      message: 'Assessment completed successfully',
    });
  } catch (error) {
    // Log comprehensive error information
    const totalDuration = performanceTimer.end({
      userId,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    logger.error('Assessment Failed', {
      userId,
      caseId: req.body.case_id,
      userResponseId: req.body.user_response_id,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      totalDuration,
      operation: 'assessment',
    });

    res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper function für User Progress Update
async function updateUserProgress(userId: string, newScore: number, improvementAreas: string[]) {
  const supabase = getSupabaseClient();

  // Aktuellen Progress abrufen
  const { data: currentProgress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (currentProgress) {
    // Durchschnittsscore neu berechnen
    const completedCases = currentProgress.completed_cases + 1;
    const newAverageScore =
      (currentProgress.average_score * currentProgress.completed_cases + newScore) / completedCases;

    // Progress aktualisieren
    await supabase
      .from('user_progress')
      .update({
        completed_cases: completedCases,
        average_score: Math.round(newAverageScore * 10) / 10,
        weak_areas: improvementAreas,
        last_case_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);
  } else {
    // Ersten Progress-Eintrag erstellen
    await supabase.from('user_progress').insert({
      user_id: userId,
      completed_cases: 1,
      average_score: newScore,
      weak_areas: improvementAreas,
      last_case_at: new Date().toISOString(),
    });
  }
}

// Export handler with OpenAI rate limiting (10 requests per minute)
export default withOpenAIRateLimit(handler);
