-- Migration: Remove redundant 'name' field from user_profiles table
-- Date: 2025-07-29
-- Purpose: Clean architecture - normalize user data to use only first_name/last_name

-- Step 1: Verify current schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 2: Check current user data (name column already removed)
SELECT 
  COUNT(*) as total_users,
  COUNT(first_name) as users_with_first_name,
  COUNT(last_name) as users_with_last_name
FROM user_profiles;

-- Step 3: Remove the redundant 'name' column
ALTER TABLE user_profiles DROP COLUMN IF EXISTS name;

-- Step 4: Verify the column was removed
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 5: Verify data integrity (should show no 'name' column)
SELECT id, email, first_name, last_name, role, created_at 
FROM user_profiles 
LIMIT 3;
