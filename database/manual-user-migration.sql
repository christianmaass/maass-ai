-- =====================================================
-- MANUAL USER MIGRATION FOR MISSING USER
-- =====================================================
-- Manually migrate the missing user christian@christianmaass.com

-- Step 1: Check what users exist in auth.users but not in user_profiles
SELECT 
  'Missing Users in user_profiles:' as info,
  au.id,
  au.email,
  au.created_at
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
WHERE up.id IS NULL;

-- Step 2: Manually insert the missing user
INSERT INTO user_profiles (id, email, first_name, last_name, role, created_at)
VALUES (
  '6fe76262-ade3-41fc-96c5-3d5fffef88a1',
  'christian@christianmaass.com',
  'Christian',
  'Maass',
  'admin',  -- Set as admin directly
  NOW()
);

-- Step 3: Ensure this user has Free tariff subscription
INSERT INTO user_subscriptions (user_id, tariff_plan_id, status)
SELECT 
  '6fe76262-ade3-41fc-96c5-3d5fffef88a1',
  tp.id as tariff_plan_id,
  'active' as status
FROM tariff_plans tp
WHERE tp.name = 'Free';

-- Step 4: Verify all users are now migrated
SELECT 
  'All Users in user_profiles:' as info,
  email,
  role,
  created_at
FROM user_profiles 
ORDER BY created_at;

-- Step 5: Check for any remaining unmigrated users
SELECT 
  'Still Missing Users:' as info,
  COUNT(*) as missing_count
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
WHERE up.id IS NULL;
