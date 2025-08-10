/**
 * COURSE ENROLLMENT API
 * Handles user enrollment in courses
 *
 * POST /api/courses/enroll
 * - Enrolls authenticated user in a specific course
 * - Creates user_course_enrollments record
 * - Initializes user_course_progress tracking
 * - Returns updated enrollment status
 *
 * @version 1.0.0
 * @author navaa Development Team
 */

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
 * ✅ Enrollment Logic - Course enrollment with progress tracking
 * ✅ Database Integration - user_course_enrollments table
 * ✅ Error Handling - Detailed logging for debugging
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

interface EnrollmentRequest {
  course_id: string;
}

interface EnrollmentResponse {
  success: boolean;
  message: string;
  enrollment?: {
    course_id: string;
    enrolled_at: string;
    progress: {
      completed_cases: number;
      total_cases: number;
      progress_percentage: number;
    };
  };
}

/**
 * POST /api/courses/enroll
 * Enrolls user in a course
 */
async function enrollHandler(req: AuthenticatedRequest, res: NextApiResponse<EnrollmentResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    const userId = getUserId(req);
    const { course_id }: EnrollmentRequest = req.body;

    if (!course_id) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required',
      });
    }

    // 1. Verify course exists and is active
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, name, is_active')
      .eq('id', course_id)
      .eq('is_active', true)
      .single();

    if (courseError || !course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or inactive',
      });
    }

    // 2. Check if user is already enrolled
    const { data: existingEnrollment } = await supabase
      .from('user_course_enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', course_id)
      .single();

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'User is already enrolled in this course',
      });
    }

    // 3. Create enrollment record
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('user_course_enrollments')
      .insert({
        user_id: userId,
        course_id: course_id,
        enrolled_at: new Date().toISOString(),
        is_active: true,
        status: 'active',
        progress_percentage: 0,
        last_activity_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (enrollmentError) {
      console.error('❌ Enrollment creation error:', enrollmentError);
      console.error('Error details:', {
        code: enrollmentError.code,
        message: enrollmentError.message,
        details: enrollmentError.details,
        hint: enrollmentError.hint,
      });
      return res.status(500).json({
        success: false,
        message: `Failed to create enrollment: ${enrollmentError.message}`,
      });
    }

    // 4. Get foundation cases count for progress initialization
    const { count: foundationCasesCount } = await supabase
      .from('course_foundation_cases')
      .select('*', { count: 'exact' })
      .eq('course_id', course_id);

    // 5. Initialize user progress
    const { error: progressError } = await supabase.from('user_course_progress').insert({
      user_id: userId,
      course_id: course_id,
      completed_cases: 0,
      total_cases: foundationCasesCount || 0,
      progress_percentage: 0,
      last_activity_at: new Date().toISOString(),
    });

    if (progressError) {
      console.error('Progress initialization error:', progressError);
      // Don't fail enrollment if progress init fails
    }

    // 6. Update user profile current_course_id if this is their first course
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('current_course_id')
      .eq('id', userId)
      .single();

    if (userProfile && !userProfile.current_course_id) {
      await supabase
        .from('user_profiles')
        .update({ current_course_id: course_id })
        .eq('id', userId);
    }

    return res.status(200).json({
      success: true,
      message: `Successfully enrolled in ${course.name}`,
      enrollment: {
        course_id: course_id,
        enrolled_at: enrollment.enrolled_at,
        progress: {
          completed_cases: 0,
          total_cases: foundationCasesCount || 0,
          progress_percentage: 0,
        },
      },
    });
  } catch (error) {
    console.error('Enrollment API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

export default withAuth(enrollHandler);
