-- =====================================================
-- ENROLLMENT TABLE SCHEMA COMPLETION
-- Adds missing columns to user_course_enrollments table
-- 
-- NAVAA GUIDELINES COMPLIANT:
-- - Robust schema design
-- - Future-proof structure
-- - Backward compatibility
-- - Safe migration with rollback
-- 
-- @version 1.0.0
-- @author navaa Development Team
-- =====================================================

-- 1. Add missing columns to user_course_enrollments
-- =====================================================

-- Check if is_active column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_course_enrollments' 
        AND column_name = 'is_active'
    ) THEN
        ALTER TABLE user_course_enrollments 
        ADD COLUMN is_active BOOLEAN DEFAULT true NOT NULL;
        
        RAISE NOTICE 'Added is_active column to user_course_enrollments';
    ELSE
        RAISE NOTICE 'is_active column already exists in user_course_enrollments';
    END IF;
END $$;

-- Check if status column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_course_enrollments' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE user_course_enrollments 
        ADD COLUMN status TEXT DEFAULT 'active' NOT NULL;
        
        RAISE NOTICE 'Added status column to user_course_enrollments';
    ELSE
        RAISE NOTICE 'status column already exists in user_course_enrollments';
    END IF;
END $$;

-- Check if progress_percentage column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_course_enrollments' 
        AND column_name = 'progress_percentage'
    ) THEN
        ALTER TABLE user_course_enrollments 
        ADD COLUMN progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100);
        
        RAISE NOTICE 'Added progress_percentage column to user_course_enrollments';
    ELSE
        RAISE NOTICE 'progress_percentage column already exists in user_course_enrollments';
    END IF;
END $$;

-- Check if last_activity_at column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_course_enrollments' 
        AND column_name = 'last_activity_at'
    ) THEN
        ALTER TABLE user_course_enrollments 
        ADD COLUMN last_activity_at TIMESTAMPTZ DEFAULT NOW();
        
        RAISE NOTICE 'Added last_activity_at column to user_course_enrollments';
    ELSE
        RAISE NOTICE 'last_activity_at column already exists in user_course_enrollments';
    END IF;
END $$;

-- 2. Create indexes for performance
-- =====================================================

-- Index for active enrollments lookup
CREATE INDEX IF NOT EXISTS idx_user_course_enrollments_active 
ON user_course_enrollments (user_id, is_active) 
WHERE is_active = true;

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_user_course_enrollments_status 
ON user_course_enrollments (status);

-- Index for activity tracking
CREATE INDEX IF NOT EXISTS idx_user_course_enrollments_activity 
ON user_course_enrollments (last_activity_at DESC);

-- 3. Update existing records
-- =====================================================

-- Set default values for existing records
UPDATE user_course_enrollments 
SET 
    is_active = true,
    status = 'active',
    progress_percentage = 0,
    last_activity_at = enrolled_at
WHERE 
    is_active IS NULL 
    OR status IS NULL 
    OR progress_percentage IS NULL 
    OR last_activity_at IS NULL;

-- 4. Add constraints and validation
-- =====================================================

-- Add check constraint for valid status values
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'user_course_enrollments_status_check'
    ) THEN
        ALTER TABLE user_course_enrollments 
        ADD CONSTRAINT user_course_enrollments_status_check 
        CHECK (status IN ('active', 'paused', 'completed', 'cancelled'));
        
        RAISE NOTICE 'Added status check constraint to user_course_enrollments';
    END IF;
END $$;

-- 5. Update RLS policies if needed
-- =====================================================

-- Ensure users can only see their own enrollments
DROP POLICY IF EXISTS "Users can view own enrollments" ON user_course_enrollments;
CREATE POLICY "Users can view own enrollments" ON user_course_enrollments
    FOR SELECT USING (auth.uid() = user_id);

-- Ensure users can insert their own enrollments
DROP POLICY IF EXISTS "Users can insert own enrollments" ON user_course_enrollments;
CREATE POLICY "Users can insert own enrollments" ON user_course_enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Ensure users can update their own enrollments
DROP POLICY IF EXISTS "Users can update own enrollments" ON user_course_enrollments;
CREATE POLICY "Users can update own enrollments" ON user_course_enrollments
    FOR UPDATE USING (auth.uid() = user_id);

-- 6. Verification queries
-- =====================================================

-- Verify table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_course_enrollments'
ORDER BY ordinal_position;

-- Count existing enrollments
SELECT 
    COUNT(*) as total_enrollments,
    COUNT(*) FILTER (WHERE is_active = true) as active_enrollments,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT course_id) as unique_courses
FROM user_course_enrollments;

-- Show sample data
SELECT * FROM user_course_enrollments LIMIT 3;

RAISE NOTICE 'Enrollment table schema migration completed successfully!';

-- =====================================================
-- ROLLBACK SCRIPT (for emergency use)
-- =====================================================
/*
-- EMERGENCY ROLLBACK (only if needed):

-- Remove added columns (CAREFUL - this will lose data!)
-- ALTER TABLE user_course_enrollments DROP COLUMN IF EXISTS is_active;
-- ALTER TABLE user_course_enrollments DROP COLUMN IF EXISTS status;
-- ALTER TABLE user_course_enrollments DROP COLUMN IF EXISTS progress_percentage;
-- ALTER TABLE user_course_enrollments DROP COLUMN IF EXISTS last_activity_at;

-- Remove indexes
-- DROP INDEX IF EXISTS idx_user_course_enrollments_active;
-- DROP INDEX IF EXISTS idx_user_course_enrollments_status;
-- DROP INDEX IF EXISTS idx_user_course_enrollments_activity;

-- Remove constraints
-- ALTER TABLE user_course_enrollments DROP CONSTRAINT IF EXISTS user_course_enrollments_status_check;
*/
