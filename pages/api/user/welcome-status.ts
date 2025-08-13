import { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest, getUserId } from '@lib/middleware/auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface WelcomeStatusResponse {
  isFirstTime: boolean;
  loginCount: number;
  firstName: string | null;
  lastActivityTrack: string | null;
  lastActivityAt: string | null;
  currentCase?: {
    id: string;
    title: string;
    isCompleted: boolean;
  } | null;
  nextAction: {
    type: 'onboarding' | 'continue_case' | 'new_case';
    label: string;
    href: string;
  };
}

/**
 * GET /api/user/welcome-status
 * Returns welcome status and next action for authenticated user
 * Used by WelcomeSection component to personalize user experience
 */
async function welcomeStatusHandler(
  req: AuthenticatedRequest,
  res: NextApiResponse<WelcomeStatusResponse | { error: string }>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = getUserId(req);

    // Get user welcome status using the database function
    const { data: welcomeData, error: welcomeError } = await supabase.rpc(
      'get_user_welcome_status',
      { user_id: userId },
    );

    if (welcomeError) {
      console.error('Error fetching welcome status:', welcomeError);
      return res.status(500).json({ error: 'Failed to fetch welcome status' });
    }

    if (!welcomeData || welcomeData.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userStatus = welcomeData[0];

    // Determine next action based on user status
    let nextAction: WelcomeStatusResponse['nextAction'];
    let currentCase: WelcomeStatusResponse['currentCase'] = null;

    if (userStatus.is_first_time) {
      // New user - direct to onboarding
      nextAction = {
        type: 'onboarding',
        label: 'Jetzt loslegen',
        href: '/app/onboarding',
      };
    } else {
      // Returning user - check for current/next case
      if (userStatus.last_activity_track === 'Foundation Track') {
        // Check for current Foundation case in progress
        const { data: progressData, error: progressError } = await supabase
          .from('foundation_progress')
          .select(
            `
            foundation_case_id,
            current_step,
            completed_at,
            foundation_cases(id, title, total_steps)
          `,
          )
          .eq('user_id', userId)
          .is('completed_at', null)
          .order('updated_at', { ascending: false })
          .limit(1);

        if (!progressError && progressData && progressData.length > 0) {
          const progress = progressData[0];
          const foundationCase = progress.foundation_cases as any;

          currentCase = {
            id: foundationCase.id,
            title: foundationCase.title,
            isCompleted: false,
          };

          nextAction = {
            type: 'continue_case',
            label: 'Case fortsetzen',
            href: `/foundation/${foundationCase.id}`,
          };
        } else {
          // No case in progress, suggest new Foundation case
          nextAction = {
            type: 'new_case',
            label: 'Neuen Case starten',
            href: '/foundation',
          };
        }
      } else {
        // Default action for other tracks or no previous activity
        nextAction = {
          type: 'new_case',
          label: 'Weiterlernen',
          href: '/app',
        };
      }
    }

    const response: WelcomeStatusResponse = {
      isFirstTime: userStatus.is_first_time,
      loginCount: userStatus.login_count,
      firstName: userStatus.first_name,
      lastActivityTrack: userStatus.last_activity_track,
      lastActivityAt: userStatus.last_activity_at,
      currentCase,
      nextAction,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Welcome status API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default withAuth(welcomeStatusHandler);
