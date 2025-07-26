import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { email, name, duration } = req.body;

    if (!email || !name || !duration) {
      return res.status(400).json({ error: 'Email, name, and duration are required' });
    }

    // Call the Supabase function to create test user
    const { data, error } = await supabase.rpc('create_test_user', {
      test_email: email,
      test_name: name,
      duration_hours: duration
    });

    if (error) {
      console.error('Error creating test user:', error);
      return res.status(500).json({ error: 'Error creating test user: ' + error.message });
    }

    res.status(200).json({ 
      success: true,
      testUser: data
    });

  } catch (error) {
    console.error('Error in create-test-user API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
