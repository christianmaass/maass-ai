import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// REUSING exact same patterns as existing APIs
interface ApiRequest extends NextApiRequest {
  body: {
    caseId: string;
    stepNumber: number;
    generationPrompt: string; // What user wants to generate
  };
}

interface ApiResponse {
  success: boolean;
  content?: {
    title: string;
    content: string;
  };
  error?: string;
}

export default async function handler(req: ApiRequest, res: NextApiResponse<ApiResponse>) {
  // REUSING: Same method validation
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

    const { caseId, stepNumber, generationPrompt } = req.body;

    console.log(
      `[Content Module] Starting generation for case ${caseId}, step ${stepNumber}, user ${userId}`,
    );

    // REUSING: Same validation pattern
    if (!caseId || !stepNumber || !generationPrompt) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: caseId, stepNumber, generationPrompt',
      });
    }

    // REUSING: Same Supabase setup as other APIs
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
      console.error('[Content Module] Case not found:', caseError);
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    // REUSING: Same OpenAI setup
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Generate content prompt
    const contentPrompt = generateContentPrompt(foundationCase, stepNumber, generationPrompt);

    // REUSING: Same GPT call pattern
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'Du bist ein Experte für Consulting-Training und erstellst prägnante, lehrreiche Framework-Einleitungen.',
        },
        {
          role: 'user',
          content: contentPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const gptResponse = completion.choices[0]?.message?.content;
    if (!gptResponse) {
      throw new Error('No response from GPT');
    }

    // Parse GPT response
    const parsedContent = parseContentResponse(gptResponse);

    // REUSING: Same database save pattern - UPSERT for content modules
    const { error: saveError } = await supabase.from('case_content_modules').upsert(
      {
        foundation_case_id: caseId,
        step_number: stepNumber,
        title: parsedContent.title,
        content: parsedContent.content,
        generation_prompt: generationPrompt,
        generated_by_gpt: true,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'foundation_case_id,step_number', // Handle existing content modules
      },
    );

    if (saveError) {
      console.error('[Content Module] Error saving:', saveError);
      throw new Error('Failed to save content module');
    }

    console.log('[Content Module] Success!');

    res.status(200).json({
      success: true,
      content: parsedContent,
    });
  } catch (error) {
    console.error('[Content Module] Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

function generateContentPrompt(
  foundationCase: any,
  stepNumber: number,
  userPrompt: string,
): string {
  const stepNames = {
    1: 'Problemverständnis & Zielklärung',
    2: 'Strukturierung & Hypothesenbildung',
    3: 'Analyse & Zahlenarbeit',
    4: 'Synthetisieren & Optionen bewerten',
    5: 'Empfehlung & Executive Summary',
  };

  return `
CASE-KONTEXT:
- Case: ${foundationCase.title}
- Tool/Framework: ${foundationCase.cluster}
- Schritt: ${stepNumber} - ${stepNames[stepNumber as keyof typeof stepNames]}
- Schwierigkeitsgrad: ${foundationCase.difficulty}

USER-ANFRAGE:
"${userPrompt}"

AUFGABE:
Erstelle eine kompakte, verständliche Einleitung basierend auf der User-Anfrage.
Die Einleitung soll:
- Prägnant und lehrreich sein (max. 300 Wörter)
- Für Consulting-Anfänger verständlich
- Praktische Relevanz für den Case haben
- Gut strukturiert sein

ANTWORT-FORMAT (JSON):
{
  "title": "Framework/Thema-Titel",
  "content": "Kompakte Erklärung mit praktischen Beispielen und klarer Struktur. Nutze **Markdown** für Formatierung."
}

Antworte NUR mit JSON, ohne zusätzlichen Text.
`;
}

function parseContentResponse(response: string): { title: string; content: string } {
  try {
    const cleanResponse = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    const parsed = JSON.parse(cleanResponse);

    return {
      title: parsed.title || 'Framework-Einleitung',
      content: parsed.content || 'Content konnte nicht generiert werden.',
    };
  } catch (error) {
    console.error('[Content Module] Parse error:', error);
    return {
      title: 'Framework-Einleitung',
      content: 'Content konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.',
    };
  }
}
