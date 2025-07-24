import { NextApiRequest, NextApiResponse } from 'next';

// Einfacher Test-Endpunkt für Backend-Status
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Test: Environment Variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // 2. Test: OpenAI Package verfügbar
    let openaiAvailable = false;
    let openaiError: string | null = null;
    try {
      require('openai');
      openaiAvailable = true;
    } catch (e) {
      openaiError = e instanceof Error ? e.message : 'Unknown error';
    }

    // 3. Test: Supabase Client erstellbar (ohne DB-Abfrage)
    let supabaseClientOk = false;
    let supabaseError: string | null = null;
    try {
      const { getSupabaseClient } = require('../../supabaseClient');
      const supabase = getSupabaseClient();
      supabaseClientOk = !!supabase;
    } catch (e) {
      supabaseError = e instanceof Error ? e.message : 'Unknown error';
    }

    const allGood = !!supabaseUrl && !!supabaseKey && !!openaiKey && openaiAvailable && supabaseClientOk;

    return res.status(200).json({
      status: allGood ? 'success' : 'warning',
      timestamp: new Date().toISOString(),
      tests: {
        environment: {
          supabase_url_present: !!supabaseUrl,
          supabase_key_present: !!supabaseKey,
          supabase_client_ok: supabaseClientOk,
          supabase_error: supabaseError
        },
        openai: {
          api_key_present: !!openaiKey,
          api_key_format: openaiKey ? `${openaiKey.substring(0, 7)}...` : 'missing',
          package_available: openaiAvailable,
          openai_error: openaiError
        }
      },
      message: allGood ? 'Backend ready for Case/Assessment feature!' : 'Some components need attention',
      note: 'Database connection test skipped to avoid timeouts'
    });

  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ 
      error: 'Test failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
