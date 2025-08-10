-- Access Path Performance Indexes
-- Safe to run multiple times due to IF NOT EXISTS

-- Faster lookups by slug for single-course access checks
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses (slug);

-- Enrollment checks by user and course
CREATE INDEX IF NOT EXISTS idx_user_course_enrollments_user_course
  ON public.user_course_enrollments (user_id, course_id);

-- Progress lookups by user and course
CREATE INDEX IF NOT EXISTS idx_user_course_progress_user_course
  ON public.user_course_progress (user_id, course_id);

-- Foundation cases for a course, filtered by required and ordered by sequence
CREATE INDEX IF NOT EXISTS idx_course_foundation_cases_course
  ON public.course_foundation_cases (course_id);

CREATE INDEX IF NOT EXISTS idx_course_foundation_cases_course_required
  ON public.course_foundation_cases (course_id, is_required);

CREATE INDEX IF NOT EXISTS idx_course_foundation_cases_sequence
  ON public.course_foundation_cases (course_id, is_required, sequence_order);
