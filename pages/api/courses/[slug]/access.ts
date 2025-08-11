/**
 * GET /api/courses/[slug]/access
 * Fast access check and minimal course payload for a single course
 * Security: withAuth (JWT), Supabase RLS respected (service role for reads as in courses index)
 */
import { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest, getUserId } from '../../../../lib/middleware/auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface FoundationCase {
  case_id: string;
  title: string;
  difficulty: number;
  sequence_order: number;
  description?: string | null;
}

interface AccessResponse {
  hasAccess: boolean;
  course: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    difficulty_level: number;
    estimated_duration_hours: number;
    foundation_cases: FoundationCase[];
    foundation_cases_count: number;
    user_enrolled: boolean;
    user_progress?: {
      completed_cases: number;
      total_cases: number;
      progress_percentage: number;
      current_case_id?: string | null;
      last_activity_at?: string | null;
    };
  } | null;
}

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<AccessResponse | { error: string }>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = getUserId(req);
    const { slug } = req.query as { slug: string };

    // Explicit cache directive (client-specific, no intermediary caching)
    res.setHeader('Cache-Control', 'private, max-age=0, no-cache');

    // Fetch single active course by slug
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)
      .eq('slug', slug)
      .single();

    if (courseError) {
      console.error('Error fetching course by slug:', courseError);
      return res.status(500).json({ error: 'Failed to fetch course' });
    }

    if (!course) {
      return res.status(200).json({ hasAccess: false, course: null });
    }

    // Foundation cases for this course
    const { data: courseCases, error: casesError } = await supabase
      .from('course_foundation_cases')
      .select(
        `
        course_id,
        foundation_case_id,
        sequence_order,
        foundation_cases (
          id,
          title,
          difficulty,
          description
        )
      `,
      )
      .eq('course_id', course.id)
      .eq('is_required', true)
      .order('sequence_order', { ascending: true });

    if (casesError) {
      // Degrade gracefully: continue with empty foundation cases rather than 500
      console.warn('Foundation cases query failed, continuing with empty list:', casesError);
    }

    const foundation_cases: FoundationCase[] = (courseCases || []).map((fc: any) => {
      const f = Array.isArray(fc.foundation_cases) ? fc.foundation_cases[0] : fc.foundation_cases;
      return {
        case_id: fc.foundation_case_id,
        title: f?.title || '',
        difficulty: f?.difficulty || 0,
        sequence_order: fc.sequence_order,
        description: f?.description ?? null,
      };
    });

    // Enrollment (for tracking/display only; NOT used for access decisions)
    const { data: enrollment, error: enrollError } = await supabase
      .from('user_course_enrollments')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', course.id)
      .maybeSingle();

    if (enrollError) {
      console.error('Error fetching enrollment:', enrollError);
      // continue as not enrolled
    }

    // Optional: progress
    let progress: any | null = null;
    if (enrollment) {
      const { data: progressRow } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', course.id)
        .maybeSingle();
      progress = progressRow || null;
    }

    // Universal access policy: any authenticated user has access to all courses
    const hasAccess = true;
    // Enrollment reflects whether the user has started the course (tracking only)
    const user_enrolled = !!enrollment;

    const response: AccessResponse = {
      hasAccess,
      course: {
        id: course.id,
        slug: course.slug,
        name: course.name,
        description: course.description,
        difficulty_level: course.difficulty_level,
        estimated_duration_hours: course.estimated_duration_hours,
        foundation_cases,
        foundation_cases_count: foundation_cases.length,
        user_enrolled,
        user_progress: user_enrolled
          ? {
              completed_cases: progress?.completed_cases || 0,
              total_cases: progress?.total_cases || foundation_cases.length,
              progress_percentage: progress?.progress_percentage || 0,
              current_case_id: progress?.current_case_id || null,
              last_activity_at: enrollment?.last_activity_at || null,
            }
          : undefined,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Unexpected error in access API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default withAuth(handler);
