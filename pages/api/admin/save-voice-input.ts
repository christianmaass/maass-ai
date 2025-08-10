import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication (consistent with other admin APIs)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const userId = authHeader.split(' ')[1];
    if (!userId) {
      return res.status(401).json({ error: 'Invalid user ID in authorization header' });
    }

    // Extract request data
    const { caseId, stepNumber, voiceTranscript, textFallback, inputMethod, audioDuration } =
      req.body;

    // Validate required fields
    if (!caseId || !stepNumber || !voiceTranscript || !inputMethod) {
      return res.status(400).json({
        error: 'Missing required fields: caseId, stepNumber, voiceTranscript, inputMethod',
      });
    }

    // Validate step number
    if (stepNumber < 1 || stepNumber > 5) {
      return res.status(400).json({
        error: 'Step number must be between 1 and 5',
      });
    }

    // Validate input method
    if (!['voice', 'text'].includes(inputMethod)) {
      return res.status(400).json({
        error: 'Input method must be either "voice" or "text"',
      });
    }

    console.log(
      `🎤 Saving voice input for case ${caseId}, step ${stepNumber}, method ${inputMethod}`,
    );

    // Verify that the foundation case exists
    const { data: foundationCase, error: caseError } = await supabase
      .from('foundation_cases')
      .select('id')
      .eq('id', caseId)
      .single();

    if (caseError || !foundationCase) {
      return res.status(404).json({ error: 'Foundation case not found' });
    }

    // Upsert voice input (insert or update) - USER-ISOLATED
    const { data, error } = await supabase
      .from('case_voice_inputs')
      .upsert(
        {
          foundation_case_id: caseId,
          step_number: stepNumber,
          user_id: userId,
          voice_transcript: voiceTranscript?.trim() || null,
          text_fallback: textFallback?.trim() || null,
          input_method: inputMethod || 'text',
          audio_duration: audioDuration || null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'foundation_case_id,step_number,user_id', // USER-SPECIFIC CONFLICT
        },
      )
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        error: 'Failed to save voice input',
        details: error.message,
      });
    }

    console.log('✅ Voice input saved successfully');

    return res.status(200).json({
      success: true,
      data: data,
      message: `Voice input saved for step ${stepNumber} (${inputMethod})`,
    });
  } catch (error: any) {
    console.error('💥 Error in save-voice-input API:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
}
