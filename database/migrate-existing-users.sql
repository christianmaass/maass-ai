-- =====================================================
-- MIGRATE EXISTING USERS TO USER_PROFILES
-- =====================================================
-- This script migrates existing auth.users to user_profiles
-- and sets admin role for christian@christianmaass.com

-- Step 1: Insert missing users from auth.users to user_profiles
INSERT INTO user_profiles (id, email, first_name, last_name, role, created_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'first_name', '') as first_name,
  COALESCE(au.raw_user_meta_data->>'last_name', '') as last_name,
  'user' as role,  -- Default role
  au.created_at
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
WHERE up.id IS NULL;  -- Only insert users that don't exist in user_profiles

-- Step 2: Set christian@christianmaass.com as admin
UPDATE user_profiles 
SET role = 'admin'
WHERE email = 'christian@christianmaass.com';

-- Step 3: Ensure all users have Free tariff subscription
INSERT INTO user_subscriptions (user_id, tariff_plan_id, status)
SELECT 
  up.id,
  tp.id as tariff_plan_id,
  'active' as status
FROM user_profiles up
CROSS JOIN tariff_plans tp
LEFT JOIN user_subscriptions us ON up.id = us.user_id
WHERE tp.name = 'Free' 
  AND us.id IS NULL;  -- Only insert if no subscription exists

-- Step 4: Verify the migration
SELECT 
  'Migration Results:' as info,
  COUNT(*) as total_users_in_profiles
FROM user_profiles;

SELECT 
  'Admin Users:' as info,
  email,
  role,
  created_at
FROM user_profiles 
WHERE role = 'admin';

SELECT 
  'All Users with Subscriptions:' as info,
  up.email,
  up.role,
  tp.name as tariff_name,
  us.status
FROM user_profiles up
LEFT JOIN user_subscriptions us ON up.id = us.user_id
LEFT JOIN tariff_plans tp ON us.tariff_plan_id = tp.id
ORDER BY up.created_at;
