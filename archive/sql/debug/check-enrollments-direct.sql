-- ENROLLMENT CHECK: Direkte Datenbank-Abfrage
-- Prüft aktive Enrollments für christian@christianmaass.com

-- 1. USER ID ERMITTELN
SELECT id, email FROM user_profiles WHERE email = 'christian@christianmaass.com';

-- 2. ENROLLMENTS PRÜFEN
SELECT 
    uce.id,
    uce.user_id,
    uce.course_id,
    uce.is_active,
    uce.status,
    uce.enrolled_at,
    c.name as course_name,
    c.slug as course_slug
FROM user_course_enrollments uce
JOIN courses c ON uce.course_id = c.id
WHERE uce.user_id = (
    SELECT id FROM user_profiles WHERE email = 'christian@christianmaass.com'
);

-- 3. AKTIVE ENROLLMENTS ZÄHLEN
SELECT COUNT(*) as active_enrollments
FROM user_course_enrollments uce
WHERE uce.user_id = (
    SELECT id FROM user_profiles WHERE email = 'christian@christianmaass.com'
) AND uce.is_active = true;
