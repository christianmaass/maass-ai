import { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient } from '../../supabaseClient';
import OpenAI from 'openai';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user_id, case_id, user_response_id } = req.body;

    if (!user_id || !case_id || !user_response_id) {
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
      return res.status(404).json({ error: 'Case or response not found' });
    }

    // Assessment Prompt personalisieren
    const personalizedPrompt = ASSESSMENT_PROMPT
      .replace('{case_description}', caseData.description)
      .replace('{user_response}', responseData.response_text);

    // GPT Assessment durchführen
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: personalizedPrompt
        },
        {
          role: "user",
          content: "Bewerte diese Antwort nach den MBB-Kriterien und gib das Ergebnis im JSON-Format zurück."
        }
      ],
      max_tokens: 1200,
      temperature: 0.3,
    });

    const assessmentText = completion.choices[0]?.message?.content;

    if (!assessmentText) {
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
        improvement_areas: assessmentData.improvement_areas || []
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving assessment:', saveError);
      return res.status(500).json({ error: 'Failed to save assessment' });
    }

    // User Progress aktualisieren
    await updateUserProgress(user_id, assessmentData.total_score, assessmentData.improvement_areas);

    res.status(200).json({
      assessment: savedAssessment,
      message: 'Assessment completed successfully'
    });

  } catch (error) {
    console.error('Error assessing response:', error);
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
    const newAverageScore = ((currentProgress.average_score * currentProgress.completed_cases) + newScore) / completedCases;

    // Progress aktualisieren
    await supabase
      .from('user_progress')
      .update({
        completed_cases: completedCases,
        average_score: Math.round(newAverageScore * 10) / 10,
        weak_areas: improvementAreas,
        last_case_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
  } else {
    // Ersten Progress-Eintrag erstellen
    await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        completed_cases: 1,
        average_score: newScore,
        weak_areas: improvementAreas,
        last_case_at: new Date().toISOString()
      });
  }
}
