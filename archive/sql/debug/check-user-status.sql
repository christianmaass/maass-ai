-- USER STATUS DIAGNOSE: Dashboard Redirect Problem
-- Prüft onboarding_completed Status für christian@christianmaass.com

SELECT 
    email,
    onboarding_completed,
    login_count,
    first_login_at,
    last_login_at,
    current_course_id,
    completed_courses_count
FROM user_profiles 
WHERE email = 'christian@christianmaass.com';

-- Prüft auch Enrollments
SELECT 
    uce.user_id,
    uce.course_id,
    uce.is_active,
    uce.status,
    uce.enrolled_at,
    c.title as course_title
FROM user_course_enrollments uce
JOIN courses c ON uce.course_id = c.id
WHERE uce.user_id = (
    SELECT id FROM user_profiles WHERE email = 'christian@christianmaass.com'
);
