import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Types
interface MCQuestion {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

interface ApiRequest extends NextApiRequest {
  body: {
    caseId: string;
    stepNumber: number; // 1-5
  };
}

interface ApiResponse {
  success: boolean;
  questions?: MCQuestion[];
  error?: string;
}

// Step names for context
const STEP_NAMES = {
  1: 'Problemverständnis & Zielklärung',
  2: 'Strukturierung & Hypothesenbildung',
  3: 'Analyse & Zahlenarbeit',
  4: 'Synthetisieren & Optionen bewerten',
  5: 'Empfehlung & Executive Summary',
};

export default async function handler(req: ApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Authentication check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ success: false, error: 'Missing or invalid authorization header' });
    }

    const userId = authHeader.split(' ')[1];
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: 'Invalid user ID in authorization header' });
    }

    const { caseId, stepNumber } = req.body;

    console.log(`[MC Generation] Starting for case ${caseId}, step ${stepNumber}, user ${userId}`);

    // Validate input
    if (!caseId || !stepNumber || stepNumber < 1 || stepNumber > 5) {
      return res.status(400).json({
        success: false,
        error: 'Invalid caseId or stepNumber (must be 1-5)',
      });
    }

    // Initialize Supabase with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Get case details
    const { data: foundationCase, error: caseError } = await supabase
      .from('foundation_cases')
      .select('*')
      .eq('id', caseId)
      .single();

    if (caseError || !foundationCase) {
      console.error('[MC Generation] Case not found:', caseError);
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    console.log(`[MC Generation] Found case: ${foundationCase.title}`);

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Generate GPT prompt
    const prompt = generateMCPrompt(foundationCase, stepNumber);
    console.log(`[MC Generation] Generated prompt for step ${stepNumber}`);

    // Call GPT
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Du bist ein Experte für Consulting Case Training und Multiple Choice Fragen.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const gptResponse = completion.choices[0]?.message?.content;
    if (!gptResponse) {
      throw new Error('No response from GPT');
    }

    console.log('[MC Generation] GPT response received');

    // Parse GPT response
    const questions = parseGPTResponse(gptResponse);
    if (questions.length !== 3) {
      throw new Error(`Expected 3 questions, got ${questions.length}`);
    }

    // Delete existing questions for this case + step
    const { error: deleteError } = await supabase
      .from('case_multiple_choice')
      .delete()
      .eq('foundation_case_id', caseId)
      .eq('step_number', stepNumber);

    if (deleteError) {
      console.error('[MC Generation] Error deleting existing questions:', deleteError);
    }

    // Insert new questions
    const insertData = questions.map((q, index) => ({
      foundation_case_id: caseId,
      step_number: stepNumber,
      question_number: index + 1,
      question: q.question,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      generated_by_gpt: true,
      generation_prompt: prompt,
    }));

    const { error: insertError } = await supabase.from('case_multiple_choice').insert(insertData);

    if (insertError) {
      console.error('[MC Generation] Error inserting questions:', insertError);
      throw new Error('Failed to save questions to database');
    }

    console.log(
      `[MC Generation] Successfully generated and saved 3 MC questions for step ${stepNumber}`,
    );

    res.status(200).json({
      success: true,
      questions: questions,
    });
  } catch (error) {
    console.error('[MC Generation] Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

function generateMCPrompt(foundationCase: any, stepNumber: number): string {
  const stepName = STEP_NAMES[stepNumber as keyof typeof STEP_NAMES];

  return `
KONTEXT:
- Case: ${foundationCase.title}
- Beschreibung: ${foundationCase.case_description || 'Nicht verfügbar'}
- Tool/Framework: ${foundationCase.cluster}
- Schwierigkeitsgrad: ${foundationCase.difficulty}
- Lernziele: ${foundationCase.learning_objectives?.join(', ') || 'Nicht spezifiziert'}
- Aktueller Schritt: ${stepNumber} - ${stepName}

AUFGABE:
Generiere EXAKT 3 Multiple Choice Fragen für Schritt ${stepNumber} "${stepName}".

ANFORDERUNGEN:
- Jede Frage hat 4 Antwortoptionen (A, B, C, D)
- Eine eindeutig richtige Antwort
- Fragen sind spezifisch für ${stepName}
- Schwierigkeitsgrad: ${foundationCase.difficulty}
- Fragen testen praktisches Consulting-Wissen
- Keine theoretischen Framework-Definitionen

ANTWORT-FORMAT (JSON):
{
  "questions": [
    {
      "question": "Frage 1 Text hier",
      "option_a": "Option A Text",
      "option_b": "Option B Text", 
      "option_c": "Option C Text",
      "option_d": "Option D Text",
      "correct_answer": "B",
      "explanation": "Option B ist richtig, weil..."
    },
    {
      "question": "Frage 2 Text hier",
      "option_a": "Option A Text",
      "option_b": "Option B Text",
      "option_c": "Option C Text", 
      "option_d": "Option D Text",
      "correct_answer": "A",
      "explanation": "Option A ist richtig, weil..."
    },
    {
      "question": "Frage 3 Text hier",
      "option_a": "Option A Text",
      "option_b": "Option B Text",
      "option_c": "Option C Text",
      "option_d": "Option D Text", 
      "correct_answer": "C",
      "explanation": "Option C ist richtig, weil..."
    }
  ]
}

Antworte NUR mit dem JSON, ohne zusätzlichen Text.
`;
}

function parseGPTResponse(response: string): MCQuestion[] {
  try {
    // Remove any markdown formatting
    const cleanResponse = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(cleanResponse);

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid response format: missing questions array');
    }

    return parsed.questions.map((q: any, index: number) => {
      if (
        !q.question ||
        !q.option_a ||
        !q.option_b ||
        !q.option_c ||
        !q.option_d ||
        !q.correct_answer ||
        !q.explanation
      ) {
        throw new Error(`Question ${index + 1} is missing required fields`);
      }

      if (!['A', 'B', 'C', 'D'].includes(q.correct_answer)) {
        throw new Error(`Question ${index + 1} has invalid correct_answer: ${q.correct_answer}`);
      }

      return {
        question: q.question,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
      };
    });
  } catch (error) {
    console.error('[MC Generation] Error parsing GPT response:', error);
    console.error('[MC Generation] Raw response:', response);
    throw new Error('Failed to parse GPT response');
  }
}
