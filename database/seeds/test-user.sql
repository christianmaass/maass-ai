-- =====================================================
-- RESTORE TEST USER AFTER SCHEMA RESET
-- =====================================================
-- This restores the test user that was lost during schema cleanup
-- Run this in Supabase SQL Editor after the main schema

-- Insert the test user profile directly
-- (Note: We can't create auth.users entries via SQL, so we assume the auth user exists)
INSERT INTO user_profiles (id, email, first_name, last_name, role, created_at, updated_at) 
VALUES (
  '6fe76262-ade3-41fc-96c5-3d5fffef88a1',
  'test@navaa.ai',
  'Test',
  'User',
  'user',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  updated_at = NOW();

-- Ensure the user has a Free tariff subscription
INSERT INTO user_subscriptions (user_id, tariff_plan_id, status, created_at, updated_at)
SELECT 
  '6fe76262-ade3-41fc-96c5-3d5fffef88a1',
  tp.id,
  'active',
  NOW(),
  NOW()
FROM tariff_plans tp 
WHERE tp.name = 'Free'
ON CONFLICT (user_id) DO UPDATE SET
  tariff_plan_id = EXCLUDED.tariff_plan_id,
  status = 'active',
  updated_at = NOW();

-- Initialize user usage tracking for current week/month
INSERT INTO user_usage (
  user_id, 
  week_start, 
  month_start, 
  cases_used_week, 
  cases_used_month,
  created_at,
  updated_at
) VALUES (
  '6fe76262-ade3-41fc-96c5-3d5fffef88a1',
  DATE_TRUNC('week', CURRENT_DATE),
  DATE_TRUNC('month', CURRENT_DATE),
  0,
  0,
  NOW(),
  NOW()
) ON CONFLICT (user_id, week_start) DO NOTHING;

-- Initialize user progress
INSERT INTO user_progress (
  user_id,
  completed_cases,
  average_score,
  strong_areas,
  weak_areas,
  updated_at
) VALUES (
  '6fe76262-ade3-41fc-96c5-3d5fffef88a1',
  0,
  0.0,
  '{}',
  '{}',
  NOW()
) ON CONFLICT (user_id) DO UPDATE SET
  updated_at = NOW();

-- Verification: Check that everything was created correctly
SELECT 
  'user_profiles' as table_name,
  up.id::text as col1,
  up.email as col2,
  up.first_name as col3,
  up.last_name as col4,
  up.role as col5
FROM user_profiles up 
WHERE up.id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1'

UNION ALL

SELECT 
  'user_subscriptions' as table_name,
  us.user_id::text as col1,
  tp.name as col2,
  us.status as col3,
  tp.display_name as col4,
  tp.cases_per_month::text as col5
FROM user_subscriptions us
JOIN tariff_plans tp ON us.tariff_plan_id = tp.id
WHERE us.user_id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1'

UNION ALL

SELECT 
  'user_usage' as table_name,
  uu.user_id::text as col1,
  uu.cases_used_week::text as col2,
  uu.cases_used_month::text as col3,
  uu.week_start::text as col4,
  uu.month_start::text as col5
FROM user_usage uu
WHERE uu.user_id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1'

UNION ALL

SELECT 
  'user_progress' as table_name,
  up.user_id::text as col1,
  up.completed_cases::text as col2,
  up.average_score::text as col3,
  'strong_areas: ' || COALESCE(array_to_string(up.strong_areas, ', '), 'none') as col4,
  'weak_areas: ' || COALESCE(array_to_string(up.weak_areas, ', '), 'none') as col5
FROM user_progress up
WHERE up.user_id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';
