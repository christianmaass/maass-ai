-- =====================================================
-- CREATE MISSING PROFILE - Insert admin profile with correct ID
-- =====================================================

-- Step 1: Check what currently exists
SELECT 'Current auth.users:' as info, id, email FROM auth.users WHERE email = 'christian@christianmaass.com';
SELECT 'Current user_profiles:' as info, id, email, role FROM user_profiles WHERE email = 'christian@christianmaass.com';
SELECT 'Profile with session ID:' as info, id, email, role FROM user_profiles WHERE id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';

-- Step 2: Delete any existing profile with wrong ID (if exists)
DELETE FROM user_profiles WHERE email = 'christian@christianmaass.com' AND id != '6fe76262-ade3-41fc-96c5-3d5fffef88a1';

-- Step 3: Insert new profile with correct ID
INSERT INTO user_profiles (
  id,
  email,
  role,
  first_name,
  last_name,
  created_at,
  updated_at
) VALUES (
  '6fe76262-ade3-41fc-96c5-3d5fffef88a1',
  'christian@christianmaass.com',
  'admin',
  'Christian',
  'Maass',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Step 4: Verify the fix
SELECT 'After fix:' as info, id, email, role FROM user_profiles WHERE id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';
