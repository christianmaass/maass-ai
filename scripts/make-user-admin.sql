-- =====================================================
-- MAKE CURRENT USER ADMIN
-- =====================================================
-- Purpose: Grant admin role to current user for Foundation Manager access
-- Run this in Supabase SQL Editor

-- First, let's see all users and their current roles
SELECT 
  up.id,
  up.email,
  up.role,
  up.created_at
FROM user_profiles up
ORDER BY up.created_at DESC;

-- Update the most recent user (likely you) to admin role
-- Replace the email below with your actual email if different
UPDATE user_profiles 
SET role = 'admin'
WHERE email LIKE '%@%'  -- This will match any email
AND role != 'admin'     -- Only update non-admin users
AND created_at = (      -- Only the most recent user
  SELECT MAX(created_at) 
  FROM user_profiles 
  WHERE role != 'admin'
);

-- Verify the change
SELECT 
  up.id,
  up.email,
  up.role,
  up.created_at
FROM user_profiles up
WHERE up.role = 'admin'
ORDER BY up.created_at DESC;
