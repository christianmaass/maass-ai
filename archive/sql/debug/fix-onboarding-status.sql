-- ONBOARDING STATUS FIX: Dashboard Redirect Problem beheben
-- Setzt onboarding_completed auf TRUE für christian@christianmaass.com

-- 1. AKTUELLER STATUS (vor Update)
SELECT 
    email,
    onboarding_completed,
    login_count,
    current_course_id
FROM user_profiles 
WHERE email = 'christian@christianmaass.com';

-- 2. ONBOARDING STATUS AUF TRUE SETZEN
UPDATE user_profiles 
SET 
    onboarding_completed = true,
    updated_at = NOW()
WHERE email = 'christian@christianmaass.com';

-- 3. BESTÄTIGUNG (nach Update)
SELECT 
    email,
    onboarding_completed,
    login_count,
    current_course_id,
    updated_at
FROM user_profiles 
WHERE email = 'christian@christianmaass.com';
