import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest, getUserId } from '../../../lib/middleware/auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface TrackActivityRequest {
  track: 'Onboarding' | 'Foundation Track';
}

/**
 * POST /api/user/track-activity
 * Updates user's last activity tracking for WelcomeSection personalization
 * Called when user enters different tracks/areas
 */
async function trackActivityHandler(
  req: AuthenticatedRequest,
  res: NextApiResponse<{ success: boolean } | { error: string }>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = getUserId(req);
    const { track }: TrackActivityRequest = req.body;

    // Validate track parameter
    if (!track || !['Onboarding', 'Foundation Track'].includes(track)) {
      return res.status(400).json({ error: 'Invalid track parameter' });
    }

    // Update user activity tracking using the database function
    const { error } = await supabase.rpc('update_user_activity_tracking', {
      user_id: userId,
      track_name: track,
    });

    if (error) {
      console.error('Error updating activity tracking:', error);
      return res.status(500).json({ error: 'Failed to update activity tracking' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Track activity API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default withAuth(trackActivityHandler);
