import type { NextApiRequest, NextApiResponse } from 'next';

// Minimal stub endpoint to support pages/test-login.tsx
// Accepts POST { userId } and responds with success. Replace with real session logic when ready.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { userId } = req.body as { userId?: string };
    if (!userId) {
      return res.status(400).json({ success: false, error: 'Missing userId' });
    }

    // TODO: Implement Supabase admin session impersonation or secure test-login logic.
    // For now, respond success to keep the flow unblocked during development.
    return res.status(200).json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ success: false, error: message });
  }
}
