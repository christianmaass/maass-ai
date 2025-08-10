import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Types
interface GPTFeedback {
  score: number; // 0-10
  feedback: string;
  strengths: string[];
  improvements: string[];
  ideal_answer: string;
}

interface ApiRequest extends NextApiRequest {
  body: {
    caseId: string;
    stepNumber: number;
    userResponse: string;
    promptText: string;
  };
}

interface ApiResponse {
  success: boolean;
  feedback?: GPTFeedback;
  responseId?: string;
  error?: string;
}

// Step contexts - REUSING existing patterns
const STEP_CONTEXTS = {
  2: {
    name: 'Strukturierung & Hypothesenbildung',
    focus: 'MECE-Prinzip, logische Strukturierung, fundierte Hypothesen',
  },
  // Add more steps as needed
};

export default async function handler(req: ApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Missing or invalid authorization header',
      });
    }

    const userId = authHeader.split(' ')[1];
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Invalid user ID in authorization header',
      });
    }

    const { caseId, stepNumber, userResponse, promptText } = req.body;

    console.log(
      `[Free Text Evaluation] Starting for case ${caseId}, step ${stepNumber}, user ${userId}`,
    );

    // Validate input
    if (!caseId || !stepNumber || !userResponse || !promptText) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // REUSING: Same Supabase setup as MC generation
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // REUSING: Same case fetching logic
    const { data: foundationCase, error: caseError } = await supabase
      .from('foundation_cases')
      .select('*')
      .eq('id', caseId)
      .single();

    if (caseError || !foundationCase) {
      console.error('[Free Text Evaluation] Case not found:', caseError);
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    // REUSING: Same OpenAI setup
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Generate evaluation prompt
    const evaluationPrompt = generateEvaluationPrompt(
      foundationCase,
      stepNumber,
      promptText,
      userResponse,
    );

    // REUSING: Same GPT call pattern
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'Du bist ein erfahrener Consulting-Trainer und bewertest Case-Interview Antworten konstruktiv.',
        },
        {
          role: 'user',
          content: evaluationPrompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const gptResponse = completion.choices[0]?.message?.content;
    if (!gptResponse) {
      throw new Error('No response from GPT');
    }

    // Parse GPT response
    const feedback = parseGPTFeedback(gptResponse);

    // Save to database
    const { data: savedResponse, error: saveError } = await supabase
      .from('case_free_text_responses')
      .insert({
        foundation_case_id: caseId,
        step_number: stepNumber,
        user_response: userResponse,
        prompt_text: promptText,
        gpt_feedback: feedback,
        feedback_generated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (saveError) {
      console.error('[Free Text Evaluation] Error saving:', saveError);
      throw new Error('Failed to save response');
    }

    console.log('[Free Text Evaluation] Success!');

    res.status(200).json({
      success: true,
      feedback: feedback,
      responseId: savedResponse.id,
    });
  } catch (error) {
    console.error('[Free Text Evaluation] Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

function generateEvaluationPrompt(
  foundationCase: any,
  stepNumber: number,
  promptText: string,
  userResponse: string,
): string {
  const stepContext = STEP_CONTEXTS[stepNumber as keyof typeof STEP_CONTEXTS];

  return `
CASE-KONTEXT:
- Case: ${foundationCase.title}
- Beschreibung: ${foundationCase.case_description || 'Nicht verfügbar'}
- Tool: ${foundationCase.cluster}
- Schwierigkeitsgrad: ${foundationCase.difficulty}

SCHRITT: ${stepNumber} - ${stepContext?.name || 'Unbekannt'}
AUFGABE: "${promptText}"
USER-ANTWORT: "${userResponse}"

BEWERTUNGSAUFGABE:
Bewerte die User-Antwort konstruktiv für Schritt 2 (Strukturierung & Hypothesenbildung).

ANTWORT-FORMAT (JSON):
{
  "score": 7,
  "feedback": "Ihre Antwort zeigt gutes Verständnis...",
  "strengths": ["Klare Struktur", "Relevante Hypothesen"],
  "improvements": ["Spezifischer werden", "MECE anwenden"],
  "ideal_answer": "Eine ideale Antwort würde folgende Hypothesen strukturiert darstellen: 1) Umsatzrückgang durch... 2) Kostensteigerung in... 3) Externe Faktoren wie..."
}

Antworte NUR mit JSON, ohne zusätzlichen Text.
`;
}

function parseGPTFeedback(response: string): GPTFeedback {
  try {
    const cleanResponse = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    const parsed = JSON.parse(cleanResponse);

    // Validate and return
    return {
      score: parsed.score || 0,
      feedback: parsed.feedback || '',
      strengths: parsed.strengths || [],
      improvements: parsed.improvements || [],
      ideal_answer: parsed.ideal_answer || '',
    };
  } catch (error) {
    console.error('[Free Text Evaluation] Parse error:', error);
    // Fallback response
    return {
      score: 5,
      feedback: 'Antwort erhalten, aber Bewertung konnte nicht verarbeitet werden.',
      strengths: ['Antwort eingereicht'],
      improvements: ['Versuchen Sie es erneut'],
      ideal_answer: 'Ideale Antwort konnte nicht generiert werden.',
    };
  }
}
