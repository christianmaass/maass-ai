-- TEST ASSESSMENTS ACCESS
-- Simple test to see if we can access assessments table at all

-- 1. SIMPLE COUNT (should work if permissions are correct)
SELECT COUNT(*) as total_rows FROM assessments;

-- 2. SIMPLE SELECT (should work if permissions are correct)
SELECT * FROM assessments LIMIT 1;

-- 3. CHECK CURRENT USER/ROLE
SELECT current_user, session_user;

-- 4. TEST user_id COLUMN SPECIFICALLY
SELECT user_id FROM assessments LIMIT 1;
