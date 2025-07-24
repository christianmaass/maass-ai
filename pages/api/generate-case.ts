import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Fokussierter Case-Generierungs-Prompt (nur das Nötige)
// Keine Bewertungs-Instruktionen, nur Case-Erstellung

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { case_type_id, user_id } = req.body;

    if (!case_type_id || !user_id) {
      return res.status(400).json({ error: 'case_type_id and user_id are required' });
    }

    // Verwende Service Role Key für Server-Side Operations (umgeht RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Case Type Details abrufen
    const { data: caseType, error: caseTypeError } = await supabase
      .from('case_types')
      .select('*')
      .eq('id', case_type_id)
      .single();

    if (caseTypeError || !caseType) {
      return res.status(404).json({ error: 'Case type not found' });
    }

    // Optimierter Prompt für schnellere Generierung
    const quickPrompt = `Du bist ein erfahrener MBB-Consultant. Erstelle einen präzisen ${caseType.name} Case (Schwierigkeit ${caseType.difficulty_level}/5) für ein Consulting-Interview.

Struktur:
- Situation (2-3 Sätze)
- Problem (1-2 Sätze) 
- Aufgabe (2-3 Sätze)
- Zusatzinfos (2-3 relevante Zahlen/Fakten)

Halte es konkret, realistisch und praxisnah.`;

    // GPT Case generieren (optimiert für Geschwindigkeit)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: quickPrompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const generatedCase = completion.choices[0]?.message?.content;

    if (!generatedCase) {
      return res.status(500).json({ error: 'Failed to generate case' });
    }

    // Case in Datenbank speichern (nur mit existierenden Spalten)
    const caseTitle = `${caseType.name} Case - ${new Date().toLocaleDateString()}`;
    const { data: savedCase, error: saveError } = await supabase
      .from('cases')
      .insert({
        title: caseTitle,
        description: generatedCase
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving case:', saveError);
      return res.status(500).json({ error: 'Failed to save case' });
    }

    res.status(200).json({
      case: savedCase,
      case_type: caseType
    });

  } catch (error) {
    console.error('Error generating case:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
