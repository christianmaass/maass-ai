import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Get test user from user_profiles
    const { data: user, error } = await supabase
      .from('user_profiles')
      .select('id, email, name, first_name, last_name, role, expires_at, created_at')
      .eq('id', userId)
      .eq('role', 'test_user')
      .single();

    if (error || !user) {
      return res.status(404).json({ 
        success: false, 
        error: 'Test user not found' 
      });
    }

    // Check if expired
    const isExpired = new Date(user.expires_at) < new Date();

    res.status(200).json({ 
      success: true,
      user: {
        ...user,
        isExpired
      }
    });

  } catch (error) {
    console.error('Error in test-user API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
