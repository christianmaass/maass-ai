import { NextApiRequest, NextApiResponse } from 'next';

// Minimal test endpoint
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple environment check without imports
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY;

  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      supabase_url: hasSupabaseUrl,
      supabase_key: hasSupabaseKey,
      openai_key: hasOpenAIKey
    },
    message: 'Simple test endpoint working!'
  });
}
