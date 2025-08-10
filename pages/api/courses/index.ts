/**
 * 🚀 NAVAA.AI DEVELOPMENT STANDARDS
 *
 * This file follows navaa.ai development guidelines:
 * 📋 CONTRIBUTING.md - Contribution standards and workflow
 * 📚 docs/navaa-development-guidelines.md - Complete development standards
 *
 * KEY STANDARDS FOR THIS FILE:
 * ✅ Stability First - Never change working features without clear reason
 * ✅ Security First - JWT authentication, RLS compliance
 * ✅ API Standards - Proper error handling and response formats
 * ✅ Database Integration - Supabase with RLS policies
 * ✅ Course Data - Multi-course architecture support
 * ✅ Enrollment Status - Include user enrollment data
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest, getUserId } from '../../../lib/middleware/auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface Course {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  difficulty_level: number;
  estimated_duration_hours: number;
  prerequisites: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface FoundationCase {
  case_id: string;
  title: string;
  difficulty: number;
  sequence_order: number;
}

interface CourseWithEnrollment extends Course {
  user_enrolled: boolean;
  foundation_cases?: FoundationCase[];
  foundation_cases_count: number;
  user_progress?: {
    progress_percentage: number;
    completed_cases: number;
    total_cases: number;
    last_activity_at: string | null;
  };
}

interface CoursesResponse {
  courses: CourseWithEnrollment[];
  total_count: number;
}

/**
 * GET /api/courses
 * Returns all available courses with user enrollment status
 * Used by course selection components on onboarding and dashboard
 */
async function coursesHandler(
  req: AuthenticatedRequest,
  res: NextApiResponse<CoursesResponse | { error: string }>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = getUserId(req);
    // Universal access: any authenticated user sees all active courses
    // Avoid intermediary caching – user-specific fields present
    res.setHeader('Cache-Control', 'private, max-age=0, no-cache');

    // Get all active courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (coursesError) {
      console.error('Error fetching courses:', coursesError);
      return res.status(500).json({ error: 'Failed to fetch courses' });
    }

    if (!courses || courses.length === 0) {
      return res.status(200).json({
        courses: [],
        total_count: 0,
      });
    }

    // Get Foundation Cases for all courses
    const { data: foundationCases, error: foundationCasesError } = await supabase
      .from('course_foundation_cases')
      .select(
        `
        course_id,
        foundation_case_id,
        sequence_order,
        foundation_cases (
          id,
          title,
          difficulty
        )
      `,
      )
      .in(
        'course_id',
        courses.map((c) => c.id),
      )
      .eq('is_required', true)
      .order('sequence_order', { ascending: true });

    if (foundationCasesError) {
      console.error('Error fetching foundation cases:', foundationCasesError);
      return res.status(500).json({ error: 'Failed to fetch foundation cases' });
    }

    // Get user enrollments for all courses (lightweight; for badges only)
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('user_course_enrollments')
      .select(
        `
        course_id,
        user_id
      `,
      )
      .eq('user_id', userId)
      .in(
        'course_id',
        courses.map((c) => c.id),
      );

    if (enrollmentsError) {
      console.error('Error fetching enrollments:', enrollmentsError);
      // Don't fail completely - new users have no enrollments yet
      // Continue with empty enrollments
    }

    // Handle case where user has no enrollments yet (new users)
    const safeEnrollments = enrollments || [];

    // Combine courses with enrollment data and foundation cases
    const coursesWithEnrollment: CourseWithEnrollment[] = courses.map((course) => {
      const enrollment = safeEnrollments.find((e) => e.course_id === course.id);

      // Get foundation cases for this course
      const courseCases = foundationCases?.filter((fc) => fc.course_id === course.id) || [];
      const formattedCases: FoundationCase[] = courseCases.map((fc) => {
        // foundation_cases is an array from Supabase join, get first element
        const foundationCase = Array.isArray(fc.foundation_cases)
          ? fc.foundation_cases[0]
          : fc.foundation_cases;
        return {
          case_id: fc.foundation_case_id,
          title: foundationCase?.title || '',
          difficulty: foundationCase?.difficulty || 0,
          sequence_order: fc.sequence_order,
        };
      });

      // Universal access: enrollment indicates course started (badge only)
      const isEnrolled = !!enrollment;

      return {
        ...course,
        user_enrolled: isEnrolled,
        foundation_cases: formattedCases,
        foundation_cases_count: formattedCases.length,
        // Progress is not loaded in listing for speed; can be fetched lazily if needed
        user_progress: undefined,
      };
    });

    return res.status(200).json({
      courses: coursesWithEnrollment,
      total_count: coursesWithEnrollment.length,
    });
  } catch (error) {
    console.error('Unexpected error in courses API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default withAuth(coursesHandler);
