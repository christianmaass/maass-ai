-- =====================================================
-- USER COURSE ENROLLMENTS TABLE - COMPLETE RECREATION
-- NAVAA Guidelines konform - CLEAN VERSION (ohne RAISE NOTICE)
-- 
-- LESSONS LEARNED:
-- - Validierung verhinderte Katastrophe
-- - Ursprüngliche Tabelle hatte falsche Struktur
-- - API erwartet spezifische Spalten (is_active, etc.)
-- - 0 Datensätze vorhanden = sicher zu recreaten
-- 
-- @version 2.1.0 (Clean)
-- @author navaa Development Team
-- =====================================================

-- 1. BACKUP EXISTING DATA (falls vorhanden)
DO $$ 
BEGIN
    -- Check if table exists and has data
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_course_enrollments') THEN
        -- Create backup with timestamp
        EXECUTE format('CREATE TABLE user_course_enrollments_backup_%s AS SELECT * FROM user_course_enrollments', 
                      to_char(NOW(), 'YYYY_MM_DD_HH24_MI_SS'));
    END IF;
END $$;

-- 2. DROP EXISTING TABLE (SAFE - 0 records)
DO $$ 
BEGIN
    DROP TABLE IF EXISTS user_course_enrollments CASCADE;
END $$;

-- 3. CREATE NEW TABLE WITH CORRECT STRUCTURE
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

-- 4. CREATE INDEXES FOR PERFORMANCE
CREATE INDEX idx_user_course_enrollments_user_id 
ON user_course_enrollments (user_id);

CREATE INDEX idx_user_course_enrollments_course_id 
ON user_course_enrollments (course_id);

CREATE INDEX idx_user_course_enrollments_active 
ON user_course_enrollments (user_id, is_active) 
WHERE is_active = true;

CREATE INDEX idx_user_course_enrollments_status 
ON user_course_enrollments (status);

CREATE INDEX idx_user_course_enrollments_activity 
ON user_course_enrollments (last_activity_at DESC);

CREATE INDEX idx_user_course_enrollments_lookup 
ON user_course_enrollments (user_id, course_id, is_active);

-- 5. ADD CONSTRAINTS AND VALIDATION
ALTER TABLE user_course_enrollments 
ADD CONSTRAINT user_course_enrollments_status_check 
CHECK (status IN ('active', 'paused', 'completed', 'cancelled', 'suspended'));

ALTER TABLE user_course_enrollments 
ADD CONSTRAINT user_course_enrollments_enrolled_at_check 
CHECK (enrolled_at <= NOW());

ALTER TABLE user_course_enrollments 
ADD CONSTRAINT user_course_enrollments_activity_check 
CHECK (last_activity_at >= enrolled_at);

-- 6. ENABLE ROW LEVEL SECURITY (RLS)
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

-- 7. CREATE TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_user_course_enrollments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_user_course_enrollments_updated_at
    BEFORE UPDATE ON user_course_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_user_course_enrollments_updated_at();

-- 8. CREATE HELPER FUNCTIONS
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

-- 9. GRANT PERMISSIONS
GRANT SELECT, INSERT, UPDATE ON user_course_enrollments TO authenticated;
-- Note: No sequence needed - using UUID with gen_random_uuid()
GRANT EXECUTE ON FUNCTION get_user_enrollments(UUID) TO authenticated;

-- 10. VALIDATION AND VERIFICATION
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

-- =====================================================
-- MIGRATION COMPLETED SUCCESSFULLY
-- =====================================================
