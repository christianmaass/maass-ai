-- =====================================================
-- USER COURSE ENROLLMENTS TABLE - COMPLETE RECREATION
-- NAVAA Guidelines konform mit allem Debugging-Wissen
-- 
-- LESSONS LEARNED:
-- - Validierung verhinderte Katastrophe
-- - Ursprüngliche Tabelle hatte falsche Struktur
-- - API erwartet spezifische Spalten (is_active, etc.)
-- - 0 Datensätze vorhanden = sicher zu recreaten
-- 
-- SICHERHEIT:
-- - Backup-Strategie implementiert
-- - Rollback-Plan vorhanden
-- - Validierung vor und nach Migration
-- - Schrittweise Ausführung
-- 
-- @version 2.0.0
-- @author navaa Development Team
-- =====================================================

-- 1. BACKUP EXISTING DATA (falls vorhanden)
-- =====================================================

-- Create backup table (falls Daten vorhanden sind)
DO $$ 
BEGIN
    -- Check if table exists and has data
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_course_enrollments') THEN
        -- Create backup with timestamp
        EXECUTE format('CREATE TABLE user_course_enrollments_backup_%s AS SELECT * FROM user_course_enrollments', 
                      to_char(NOW(), 'YYYY_MM_DD_HH24_MI_SS'));
        RAISE NOTICE 'Backup created: user_course_enrollments_backup_%', to_char(NOW(), 'YYYY_MM_DD_HH24_MI_SS');
    END IF;
END $$;

-- 2. DROP EXISTING TABLE (SAFE - 0 records)
-- =====================================================

-- Drop existing table (validation showed 0 records)
DO $$ 
BEGIN
    DROP TABLE IF EXISTS user_course_enrollments CASCADE;
    RAISE NOTICE 'Dropped existing user_course_enrollments table';
END $$;

-- 3. CREATE NEW TABLE WITH CORRECT STRUCTURE
-- =====================================================

-- Create user_course_enrollments with all required columns
CREATE TABLE user_course_enrollments (
    -- Primary Key
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Foreign Keys (REQUIRED - from debugging)
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    
    -- Enrollment Tracking (REQUIRED - from debugging)
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Status Management (REQUIRED - from API error)
    is_active BOOLEAN NOT NULL DEFAULT true,
    status TEXT NOT NULL DEFAULT 'active',
    
    -- Progress Tracking (REQUIRED - from API)
    progress_percentage INTEGER NOT NULL DEFAULT 0 
        CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    
    -- Activity Tracking (REQUIRED - from API)
    last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, course_id) -- Prevent duplicate enrollments
);

RAISE NOTICE 'Created new user_course_enrollments table with correct structure';

-- 4. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Index for user lookups (most common query)
CREATE INDEX idx_user_course_enrollments_user_id 
ON user_course_enrollments (user_id);

-- Index for course lookups
CREATE INDEX idx_user_course_enrollments_course_id 
ON user_course_enrollments (course_id);

-- Index for active enrollments (from API debugging)
CREATE INDEX idx_user_course_enrollments_active 
ON user_course_enrollments (user_id, is_active) 
WHERE is_active = true;

-- Index for status filtering (from API requirements)
CREATE INDEX idx_user_course_enrollments_status 
ON user_course_enrollments (status);

-- Index for activity tracking (from API requirements)
CREATE INDEX idx_user_course_enrollments_activity 
ON user_course_enrollments (last_activity_at DESC);

-- Composite index for enrollment queries
CREATE INDEX idx_user_course_enrollments_lookup 
ON user_course_enrollments (user_id, course_id, is_active);

RAISE NOTICE 'Created performance indexes';

-- 5. ADD CONSTRAINTS AND VALIDATION
-- =====================================================

-- Status constraint (from API requirements)
ALTER TABLE user_course_enrollments 
ADD CONSTRAINT user_course_enrollments_status_check 
CHECK (status IN ('active', 'paused', 'completed', 'cancelled', 'suspended'));

-- Progress percentage constraint (already added above)
-- Enrollment date constraint (cannot be in future)
ALTER TABLE user_course_enrollments 
ADD CONSTRAINT user_course_enrollments_enrolled_at_check 
CHECK (enrolled_at <= NOW());

-- Activity tracking constraint (cannot be before enrollment)
ALTER TABLE user_course_enrollments 
ADD CONSTRAINT user_course_enrollments_activity_check 
CHECK (last_activity_at >= enrolled_at);

RAISE NOTICE 'Added data validation constraints';

-- 6. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on the table
ALTER TABLE user_course_enrollments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own enrollments
CREATE POLICY "Users can view own enrollments" ON user_course_enrollments
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own enrollments
CREATE POLICY "Users can insert own enrollments" ON user_course_enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own enrollments
CREATE POLICY "Users can update own enrollments" ON user_course_enrollments
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Admins can manage all enrollments
CREATE POLICY "Admins can manage all enrollments" ON user_course_enrollments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

RAISE NOTICE 'Configured Row Level Security policies';

-- 7. CREATE TRIGGER FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_course_enrollments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_user_course_enrollments_updated_at
    BEFORE UPDATE ON user_course_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_user_course_enrollments_updated_at();

RAISE NOTICE 'Created updated_at trigger';

-- 8. CREATE HELPER FUNCTIONS
-- =====================================================

-- Function to get user enrollments with course info
CREATE OR REPLACE FUNCTION get_user_enrollments(p_user_id UUID)
RETURNS TABLE (
    enrollment_id UUID,
    course_id UUID,
    course_name TEXT,
    course_slug TEXT,
    enrolled_at TIMESTAMPTZ,
    is_active BOOLEAN,
    status TEXT,
    progress_percentage INTEGER,
    last_activity_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        uce.id as enrollment_id,
        uce.course_id,
        c.name as course_name,
        c.slug as course_slug,
        uce.enrolled_at,
        uce.is_active,
        uce.status,
        uce.progress_percentage,
        uce.last_activity_at
    FROM user_course_enrollments uce
    JOIN courses c ON c.id = uce.course_id
    WHERE uce.user_id = p_user_id
    AND uce.is_active = true
    ORDER BY uce.last_activity_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

RAISE NOTICE 'Created helper functions';

-- 9. GRANT PERMISSIONS
-- =====================================================

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON user_course_enrollments TO authenticated;
GRANT USAGE ON SEQUENCE user_course_enrollments_id_seq TO authenticated;

-- Grant execute permission on helper function
GRANT EXECUTE ON FUNCTION get_user_enrollments(UUID) TO authenticated;

RAISE NOTICE 'Granted permissions';

-- 10. VALIDATION AND VERIFICATION
-- =====================================================

-- Verify table structure
DO $$
DECLARE
    column_count INTEGER;
    index_count INTEGER;
    policy_count INTEGER;
BEGIN
    -- Check columns
    SELECT COUNT(*) INTO column_count
    FROM information_schema.columns 
    WHERE table_name = 'user_course_enrollments';
    
    -- Check indexes
    SELECT COUNT(*) INTO index_count
    FROM pg_indexes 
    WHERE tablename = 'user_course_enrollments';
    
    -- Check policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE tablename = 'user_course_enrollments';
    
    RAISE NOTICE 'Table verification:';
    RAISE NOTICE '- Columns: %', column_count;
    RAISE NOTICE '- Indexes: %', index_count;
    RAISE NOTICE '- RLS Policies: %', policy_count;
    
    -- Verify required columns exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_course_enrollments' AND column_name = 'is_active') THEN
        RAISE EXCEPTION 'CRITICAL: is_active column missing!';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_course_enrollments' AND column_name = 'user_id') THEN
        RAISE EXCEPTION 'CRITICAL: user_id column missing!';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_course_enrollments' AND column_name = 'course_id') THEN
        RAISE EXCEPTION 'CRITICAL: course_id column missing!';
    END IF;
    
    RAISE NOTICE '✅ All required columns verified!';
END $$;

-- Show final table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_course_enrollments'
ORDER BY ordinal_position;

-- 11. SUCCESS MESSAGE
-- =====================================================

RAISE NOTICE '';
RAISE NOTICE '🎉 USER_COURSE_ENROLLMENTS TABLE RECREATION COMPLETED SUCCESSFULLY!';
RAISE NOTICE '';
RAISE NOTICE 'FEATURES IMPLEMENTED:';
RAISE NOTICE '✅ Correct table structure (user_id, course_id, enrolled_at, is_active, status, progress_percentage, last_activity_at)';
RAISE NOTICE '✅ Performance indexes for all common queries';
RAISE NOTICE '✅ Data validation constraints';
RAISE NOTICE '✅ Row Level Security (RLS) policies';
RAISE NOTICE '✅ Automatic updated_at trigger';
RAISE NOTICE '✅ Helper functions for common operations';
RAISE NOTICE '✅ Proper permissions and security';
RAISE NOTICE '';
RAISE NOTICE 'NEXT STEPS:';
RAISE NOTICE '1. Test enrollment API with new table structure';
RAISE NOTICE '2. Verify all API endpoints work correctly';
RAISE NOTICE '3. Run validation tool to confirm success';
RAISE NOTICE '4. Test frontend enrollment flow';
RAISE NOTICE '';

-- =====================================================
-- ROLLBACK SCRIPT (for emergency use)
-- =====================================================
/*
-- EMERGENCY ROLLBACK (only if needed):

-- 1. Drop the new table
DROP TABLE IF EXISTS user_course_enrollments CASCADE;

-- 2. Drop helper functions
DROP FUNCTION IF EXISTS get_user_enrollments(UUID);
DROP FUNCTION IF EXISTS update_user_course_enrollments_updated_at();

-- 3. Restore from backup (if exists)
-- Find backup table: SELECT tablename FROM pg_tables WHERE tablename LIKE 'user_course_enrollments_backup_%';
-- Restore: ALTER TABLE user_course_enrollments_backup_YYYY_MM_DD_HH24_MI_SS RENAME TO user_course_enrollments;

RAISE NOTICE 'Rollback completed - table restored to previous state';
*/
