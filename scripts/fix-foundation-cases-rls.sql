-- =====================================================
-- FIX RLS POLICIES FOR FOUNDATION_CASES
-- =====================================================
-- Purpose: Allow API access to foundation_cases table
-- Run this in Supabase SQL Editor

-- Check current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'foundation_cases';

-- Disable RLS temporarily to test (ONLY for development)
ALTER TABLE foundation_cases DISABLE ROW LEVEL SECURITY;

-- OR: Create proper RLS policies for foundation_cases
-- Enable RLS first
ALTER TABLE foundation_cases ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow authenticated users to read foundation_cases
CREATE POLICY "Allow authenticated users to read foundation_cases" 
ON foundation_cases FOR SELECT 
TO authenticated 
USING (true);

-- Policy 2: Allow authenticated users to update foundation_cases (for case generation)
CREATE POLICY "Allow authenticated users to update foundation_cases" 
ON foundation_cases FOR UPDATE 
TO authenticated 
USING (true);

-- Policy 3: Allow service role full access (for API operations)
CREATE POLICY "Allow service role full access to foundation_cases" 
ON foundation_cases FOR ALL 
TO service_role 
USING (true);

-- Verify policies are created
SELECT schemaname, tablename, policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'foundation_cases';

-- Test query to verify access
SELECT COUNT(*) as total_cases FROM foundation_cases;
