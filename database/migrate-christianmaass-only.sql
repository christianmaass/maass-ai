-- =====================================================
-- MIGRATE ONLY christian@christianmaass.com
-- =====================================================
-- Migrate only the specific user christian@christianmaass.com and set as admin

-- Step 1: Check if christian@christianmaass.com exists in auth.users
SELECT 
  'christian@christianmaass.com in auth.users:' as info,
  id,
  email,
  created_at
FROM auth.users 
WHERE email = 'christian@christianmaass.com';

-- Step 2: Insert christian@christianmaass.com into user_profiles as admin
INSERT INTO user_profiles (id, email, first_name, last_name, role, created_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'first_name', 'Christian') as first_name,
  COALESCE(au.raw_user_meta_data->>'last_name', 'Maass') as last_name,
  'admin' as role,  -- Set as admin directly
  au.created_at
FROM auth.users au
WHERE au.email = 'christian@christianmaass.com'
  AND NOT EXISTS (
    SELECT 1 FROM user_profiles up WHERE up.id = au.id
  );

-- Step 3: Ensure christian@christianmaass.com has Free tariff subscription
INSERT INTO user_subscriptions (user_id, tariff_plan_id, status)
SELECT 
  au.id,
  tp.id as tariff_plan_id,
  'active' as status
FROM auth.users au
CROSS JOIN tariff_plans tp
WHERE au.email = 'christian@christianmaass.com'
  AND tp.name = 'Free'
  AND NOT EXISTS (
    SELECT 1 FROM user_subscriptions us WHERE us.user_id = au.id
  );

-- Step 4: Verify christian@christianmaass.com is now migrated as admin
SELECT 
  'christian@christianmaass.com migration result:' as info,
  email,
  role,
  created_at
FROM user_profiles 
WHERE email = 'christian@christianmaass.com';
