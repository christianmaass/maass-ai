// pages/api/rate-text.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { withOpenAIRateLimit } from '../../lib/rateLimiter';

const openaiApiKey = process.env.OPENAI_API_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const PROMPT = (
  userText: string,
) => `Du bist ein Experte für Problemstrukturierung. Bewerte den folgenden Text eines Nutzers entlang dieser Dimension auf einer Skala von 0 bis 10 (0 = sehr schlecht, 10 = exzellent). Gib zuerst nur die Zahl, dann ein kurzes Feedback (max. 2 Sätze), z. B.:

Score: 7
Feedback: Der Text zeigt eine gute Strukturierung, könnte aber noch klarer gegliedert sein.

Nutzertext:  
${userText}`;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { user_id, input_text } = req.body;
  if (!input_text || !user_id) {
    return res.status(400).json({ error: 'Missing input_text or user_id' });
  }

  // 1. GPT-Bewertung holen
  let gptScore = null;
  let gptFeedback = null;
  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: PROMPT(input_text) }],
        max_tokens: 120,
        temperature: 0.2,
      }),
    });
    const data = await openaiRes.json();
    const content = data.choices?.[0]?.message?.content || '';
    // Score und Feedback extrahieren
    const scoreMatch = content.match(/Score:\s*(\d{1,2})/i);
    const feedbackMatch = content.match(/Feedback:\s*([\s\S]*)/i);
    gptScore = scoreMatch ? parseInt(scoreMatch[1], 10) : null;
    gptFeedback = feedbackMatch ? feedbackMatch[1].trim() : null;
    if (gptScore === null || gptFeedback === null) {
      throw new Error('Fehler beim Parsen der GPT-Antwort');
    }
  } catch (e: any) {
    return res.status(500).json({ error: 'GPT-Bewertung fehlgeschlagen', details: e.message });
  }

  // 2. In Supabase speichern
  try {
    const { error } = await supabase.from('test_ratings').insert([
      {
        user_id,
        dimension: 'Problemstrukturierung',
        input_text,
        score: gptScore,
        feedback: gptFeedback,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      throw error;
    }
  } catch (e: any) {
    return res.status(500).json({ error: 'Fehler beim Schreiben in Supabase', details: e.message });
  }

  // 3. Ergebnis zurückgeben
  return res.status(200).json({ score: gptScore, feedback: gptFeedback });
}

// Export handler with OpenAI rate limiting (10 requests per minute)
export default withOpenAIRateLimit(handler);
