import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Step-specific assessment criteria
const STEP_CRITERIA = {
  1: {
    name: 'Problemverständnis & Zielklärung',
    criteria: [
      'Klarheit der Problemdefinition',
      'Verständnis der Stakeholder und deren Interessen',
      'Identifikation der Kernfragen',
      'Zielformulierung und Erfolgskriterien',
    ],
  },
  2: {
    name: 'Strukturierung & Hypothesenbildung',
    criteria: [
      'MECE-Prinzip bei der Strukturierung',
      'Qualität der Hypothesen',
      'Logische Verknüpfung der Elemente',
      'Framework-Anwendung',
    ],
  },
  3: {
    name: 'Analyse & Zahlenarbeit',
    criteria: [
      'Analytische Tiefe und Methodik',
      'Umgang mit quantitativen Daten',
      'Interpretation der Ergebnisse',
      'Validierung der Annahmen',
    ],
  },
  4: {
    name: 'Synthetisieren & Optionen bewerten',
    criteria: [
      'Synthese der Analyseergebnisse',
      'Bewertung verschiedener Optionen',
      'Berücksichtigung von Trade-offs',
      'Entscheidungslogik',
    ],
  },
  5: {
    name: 'Empfehlung & Executive Summary',
    criteria: [
      'Klarheit und Prägnanz der Empfehlung',
      'Begründung und Argumentation',
      'Umsetzbarkeit und nächste Schritte',
      'Executive Summary Qualität',
    ],
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];

    // Verify the JWT token
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Extract request data
    const { caseId, stepNumber } = req.body;

    // Validate required fields
    if (!caseId || !stepNumber) {
      return res.status(400).json({
        error: 'Missing required fields: caseId, stepNumber',
      });
    }

    // Validate step number
    if (stepNumber < 1 || stepNumber > 5) {
      return res.status(400).json({
        error: 'Step number must be between 1 and 5',
      });
    }

    console.log(`🎤🤖 Assessing voice input for case ${caseId}, step ${stepNumber}`);

    // Get the voice input
    const { data: voiceInput, error: voiceError } = await supabase
      .from('case_voice_inputs')
      .select('*')
      .eq('foundation_case_id', caseId)
      .eq('step_number', stepNumber)
      .single();

    if (voiceError || !voiceInput) {
      return res.status(404).json({ error: 'Voice input not found' });
    }

    // Get the foundation case for context
    const { data: foundationCase, error: caseError } = await supabase
      .from('foundation_cases')
      .select('*')
      .eq('id', caseId)
      .single();

    if (caseError || !foundationCase) {
      return res.status(404).json({ error: 'Foundation case not found' });
    }

    // Get step criteria
    const stepCriteria = STEP_CRITERIA[stepNumber as keyof typeof STEP_CRITERIA];

    // Prepare GPT prompt for voice input assessment
    const assessmentPrompt = `
Du bist ein erfahrener McKinsey-Partner und bewertest eine Spracheingabe eines Consulting-Kandidaten.

CASE KONTEXT:
- Titel: ${foundationCase.title}
- Cluster: ${foundationCase.cluster}
- Schwierigkeit: ${foundationCase.difficulty}/12
- Lernziele: ${foundationCase.learning_objectives}

BEARBEITUNGSSCHRITT: ${stepCriteria.name}

BEWERTUNGSKRITERIEN:
${stepCriteria.criteria.map((c) => `- ${c}`).join('\n')}

KANDIDATEN-EINGABE (${voiceInput.input_method === 'voice' ? 'Spracheingabe' : 'Texteingabe'}):
"${voiceInput.voice_transcript}"

AUFGABE:
1. Bewerte die Eingabe auf einer Skala von 1-10 (10 = McKinsey-Partner-Niveau)
2. Gib strukturiertes Feedback zu Stärken und Verbesserungsbereichen
3. Erstelle eine idealtypische Antwort für diesen Schritt

ANTWORTFORMAT:
{
  "score": [1-10],
  "feedback": "Detailliertes Feedback mit Stärken und Verbesserungsvorschlägen",
  "ideal_answer": "Idealtypische Antwort für diesen Bearbeitungsschritt"
}

Antworte NUR mit dem JSON-Objekt, ohne zusätzlichen Text.`;

    // Call GPT for assessment
    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'Du bist ein McKinsey-Partner und bewertest Consulting-Case-Bearbeitungen. Antworte immer mit strukturiertem JSON.',
        },
        {
          role: 'user',
          content: assessmentPrompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const gptContent = gptResponse.choices[0]?.message?.content;
    if (!gptContent) {
      throw new Error('No response from GPT');
    }

    // Parse GPT response
    let assessment;
    try {
      assessment = JSON.parse(gptContent);
    } catch {
      console.error('Failed to parse GPT response:', gptContent);
      throw new Error('Invalid GPT response format');
    }

    // Validate assessment structure
    if (!assessment.score || !assessment.feedback || !assessment.ideal_answer) {
      throw new Error('Incomplete assessment from GPT');
    }

    // Update voice input with assessment
    const { data: updatedVoiceInput, error: updateError } = await supabase
      .from('case_voice_inputs')
      .update({
        gpt_feedback: assessment.feedback,
        gpt_score: assessment.score,
        gpt_ideal_answer: assessment.ideal_answer,
        feedback_requested_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('foundation_case_id', caseId)
      .eq('step_number', stepNumber)
      .select()
      .single();

    if (updateError) {
      console.error('Database update error:', updateError);
      return res.status(500).json({
        error: 'Failed to save assessment',
        details: updateError.message,
      });
    }

    console.log('✅ Voice input assessment completed successfully');

    return res.status(200).json({
      success: true,
      data: {
        voice_input: updatedVoiceInput,
        assessment: {
          score: assessment.score,
          feedback: assessment.feedback,
          ideal_answer: assessment.ideal_answer,
        },
      },
      message: `Voice input für Schritt ${stepNumber} erfolgreich bewertet (${assessment.score}/10)`,
    });
  } catch (error: any) {
    console.error('💥 Error in assess-voice-input API:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
}
