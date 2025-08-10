-- =====================================================
-- FINAL RLS CLEANUP - NUCLEAR OPTION
-- =====================================================
-- Purpose: Remove ALL policies and create ONE working solution

-- Step 1: DISABLE RLS temporarily to ensure clean state
ALTER TABLE foundation_cases DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies (nuclear cleanup)
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'foundation_cases'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON foundation_cases', policy_record.policyname);
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
END $$;

-- Step 3: Re-enable RLS
ALTER TABLE foundation_cases ENABLE ROW LEVEL SECURITY;

-- Step 4: Create ONE simple, working policy for service_role
CREATE POLICY "service_role_full_access"
ON foundation_cases
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Step 5: Create ONE simple read policy for users
CREATE POLICY "authenticated_read_access"
ON foundation_cases
FOR SELECT
TO authenticated, anon
USING (true);

-- Step 6: Explicit grants to service_role
GRANT ALL PRIVILEGES ON foundation_cases TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Step 7: Verify final state
SELECT 
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename = 'foundation_cases'
ORDER BY policyname;

-- Step 8: Test update
UPDATE foundation_cases 
SET updated_at = NOW()
WHERE id = 'foundation-case-1';

SELECT 'SUCCESS: RLS cleanup complete and tested' as result;
