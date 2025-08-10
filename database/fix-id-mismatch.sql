-- =====================================================
-- FIX ID MISMATCH - Sync auth.users ID with user_profiles
-- =====================================================

-- Step 1: Check current mismatch
SELECT 'Current auth.users:' as info, id, email FROM auth.users WHERE email = 'christian@christianmaass.com';
SELECT 'Current user_profiles:' as info, id, email, role FROM user_profiles WHERE email = 'christian@christianmaass.com';

-- Step 2: Update user_profiles to match the auth.users ID
UPDATE user_profiles 
SET id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1'
WHERE email = 'christian@christianmaass.com';

-- Step 3: Verify the fix
SELECT 'After fix - user_profiles:' as info, id, email, role FROM user_profiles WHERE id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';
