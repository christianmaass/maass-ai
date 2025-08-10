import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Dev-only guard: do not expose in production
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).end();
  }

  // Prüfe Supabase Environment-Variablen
  const envCheck = {
    NEXT_PUBLIC_SUPABASE_URL: { exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL },
    NEXT_PUBLIC_SUPABASE_ANON_KEY: { exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
    SUPABASE_SERVICE_ROLE_KEY: { exists: !!process.env.SUPABASE_SERVICE_ROLE_KEY },
  };

  console.log('🔍 Environment Variables Check:', envCheck);

  return res.status(200).json({
    message: 'Environment variables check',
    supabase: envCheck,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}
