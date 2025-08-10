-- =====================================================
-- SIMPLE EMAIL UPDATE SOLUTION
-- =====================================================
-- Change email from info@navaa.ai to christian@christianmaass.com and set admin role

-- Step 1: Show current state
SELECT 
  'Before update:' as info,
  id,
  email,
  role,
  created_at
FROM user_profiles 
WHERE id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';

-- Step 2: Update email and set admin role
UPDATE user_profiles 
SET 
  email = 'christian@christianmaass.com',
  first_name = 'Christian',
  last_name = 'Maass',
  role = 'admin',
  updated_at = NOW()
WHERE id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';

-- Step 3: Verify the change
SELECT 
  'After update:' as info,
  id,
  email,
  role,
  first_name,
  last_name,
  updated_at
FROM user_profiles 
WHERE id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';

-- Step 4: Show all admin users
SELECT 
  'All admin users:' as info,
  email,
  role,
  created_at
FROM user_profiles 
WHERE role = 'admin'
ORDER BY created_at;
