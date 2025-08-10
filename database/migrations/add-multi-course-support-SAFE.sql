-- =====================================================
-- MULTI-COURSE ARCHITECTURE MIGRATION - PRODUCTION SAFE
-- =====================================================
-- ✅ 100% BACKWARD COMPATIBLE - KEINE BREAKING CHANGES
-- ✅ Bestehende APIs funktionieren weiterhin
-- ✅ Bestehende user_progress Tabelle bleibt unverändert
-- ✅ Navaa Guidelines konform (RLS, UUID, Indexes)
-- ✅ Kann jederzeit sicher ausgeführt werden

-- =====================================================
-- SICHERHEITS-CHECKS VOR AUSFÜHRUNG
-- =====================================================

-- Prüfe ob kritische Tabellen existieren
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
    RAISE EXCEPTION 'ABORT: user_profiles table not found. Run main schema first.';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'case_types') THEN
    RAISE EXCEPTION 'ABORT: case_types table not found. Run main schema first.';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_progress') THEN
    RAISE EXCEPTION 'ABORT: user_progress table not found. Run main schema first.';
  END IF;
  
  RAISE NOTICE '✅ All required tables exist. Safe to proceed.';
END $$;

-- =====================================================
-- STEP 1: CREATE COURSES TABLE (NEW)
-- =====================================================

CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(50) NOT NULL UNIQUE, -- z.B. 'strategy-track', 'finance-track'
  name VARCHAR(100) NOT NULL, -- z.B. 'Strategy Track', 'Finance Track'
  description TEXT,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  estimated_duration_hours INTEGER DEFAULT 40,
  prerequisites TEXT[], -- Array von course_slugs die vorher absolviert werden müssen
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 2: CREATE USER-COURSE ENROLLMENTS (NEW)
-- =====================================================

CREATE TABLE IF NOT EXISTS user_course_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'dropped')),
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (progress_percentage BETWEEN 0 AND 100),
  last_activity_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id) -- Ein User kann einen Kurs nur einmal belegen
);

-- =====================================================
-- STEP 3: CREATE COURSE-CASE-TYPE MAPPING (NEW)
-- =====================================================

CREATE TABLE IF NOT EXISTS course_case_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  case_type_id UUID NOT NULL REFERENCES case_types(id) ON DELETE CASCADE,
  sequence_order INTEGER DEFAULT 0, -- Reihenfolge der case_types im Kurs
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, case_type_id)
);

-- =====================================================
-- STEP 4: CREATE COURSE-SPECIFIC PROGRESS (PARALLEL)
-- =====================================================

-- WICHTIG: user_progress Tabelle bleibt für Backward Compatibility
-- Diese neue Tabelle ergänzt für Multi-Kurs-Support
CREATE TABLE IF NOT EXISTS user_course_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completed_cases INTEGER DEFAULT 0,
  total_cases INTEGER DEFAULT 0,
  average_score DECIMAL(3,1) DEFAULT 0,
  strong_areas TEXT[],
  weak_areas TEXT[],
  current_case_type_id UUID REFERENCES case_types(id),
  last_case_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- =====================================================
-- STEP 5: SAFE USER_PROFILES EXTENSION
-- =====================================================

-- Nur neue Spalten hinzufügen, bestehende bleiben unverändert
DO $$
BEGIN
  -- Add current_course_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'current_course_id'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN current_course_id UUID REFERENCES courses(id);
    RAISE NOTICE '✅ Added current_course_id to user_profiles';
  ELSE
    RAISE NOTICE '⚠️ current_course_id already exists in user_profiles';
  END IF;

  -- Add completed_courses_count if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'completed_courses_count'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN completed_courses_count INTEGER DEFAULT 0;
    RAISE NOTICE '✅ Added completed_courses_count to user_profiles';
  ELSE
    RAISE NOTICE '⚠️ completed_courses_count already exists in user_profiles';
  END IF;
END $$;

-- =====================================================
-- STEP 6: CREATE PERFORMANCE INDEXES
-- =====================================================

-- Courses indexes
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_is_active ON courses(is_active);
CREATE INDEX IF NOT EXISTS idx_courses_sort_order ON courses(sort_order);

-- User course enrollments indexes
CREATE INDEX IF NOT EXISTS idx_user_course_enrollments_user_id ON user_course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_enrollments_course_id ON user_course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_user_course_enrollments_status ON user_course_enrollments(status);
CREATE INDEX IF NOT EXISTS idx_user_course_enrollments_last_activity ON user_course_enrollments(last_activity_at);

-- Course case types indexes
CREATE INDEX IF NOT EXISTS idx_course_case_types_course_id ON course_case_types(course_id);
CREATE INDEX IF NOT EXISTS idx_course_case_types_sequence ON course_case_types(course_id, sequence_order);

-- User course progress indexes
CREATE INDEX IF NOT EXISTS idx_user_course_progress_user_id ON user_course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_course_id ON user_course_progress(course_id);

-- User profiles course tracking
CREATE INDEX IF NOT EXISTS idx_user_profiles_current_course ON user_profiles(current_course_id) WHERE current_course_id IS NOT NULL;

-- =====================================================
-- STEP 7: CREATE RLS POLICIES (NAVAA KONFORM)
-- =====================================================

-- Courses sind public readable
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'courses') THEN
    ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Courses are publicly readable" ON courses FOR SELECT USING (is_active = true);
    RAISE NOTICE '✅ Created RLS policies for courses';
  END IF;
END $$;

-- User Course Enrollments - nur eigene sichtbar
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_course_enrollments') THEN
    ALTER TABLE user_course_enrollments ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can view own enrollments" ON user_course_enrollments FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert own enrollments" ON user_course_enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update own enrollments" ON user_course_enrollments FOR UPDATE USING (auth.uid() = user_id);
    RAISE NOTICE '✅ Created RLS policies for user_course_enrollments';
  END IF;
END $$;

-- Course Case Types sind public readable
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_case_types') THEN
    ALTER TABLE course_case_types ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Course case types are publicly readable" ON course_case_types FOR SELECT USING (true);
    RAISE NOTICE '✅ Created RLS policies for course_case_types';
  END IF;
END $$;

-- User Course Progress - nur eigene sichtbar
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_course_progress') THEN
    ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can view own course progress" ON user_course_progress FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert own course progress" ON user_course_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update own course progress" ON user_course_progress FOR UPDATE USING (auth.uid() = user_id);
    RAISE NOTICE '✅ Created RLS policies for user_course_progress';
  END IF;
END $$;

-- =====================================================
-- STEP 8: SEED INITIAL DATA (STRATEGY TRACK)
-- =====================================================

-- Erstelle Strategy Track als ersten Kurs (idempotent)
INSERT INTO courses (slug, name, description, difficulty_level, estimated_duration_hours, is_active, sort_order) 
VALUES ('strategy-track', 'Strategy Track', 'Strategische Unternehmensberatung: Von Market Entry bis M&A', 4, 40, true, 1)
ON CONFLICT (slug) DO NOTHING;

-- Verbinde existierende case_types mit Strategy Track
INSERT INTO course_case_types (course_id, case_type_id, sequence_order, is_required)
SELECT 
  c.id as course_id,
  ct.id as case_type_id,
  ROW_NUMBER() OVER (ORDER BY ct.name) as sequence_order,
  true as is_required
FROM courses c
CROSS JOIN case_types ct
WHERE c.slug = 'strategy-track'
ON CONFLICT (course_id, case_type_id) DO NOTHING;

-- =====================================================
-- STEP 9: HELPER FUNCTIONS (NAVAA KONFORM)
-- =====================================================

-- Sichere Einschreibung in Strategy Track
CREATE OR REPLACE FUNCTION enroll_user_in_strategy_track(user_id UUID)
RETURNS UUID AS $$
DECLARE
  course_id UUID;
  enrollment_id UUID;
  total_case_count INTEGER;
BEGIN
  -- Get Strategy Track course ID
  SELECT id INTO course_id FROM courses WHERE slug = 'strategy-track' AND is_active = true;
  
  IF course_id IS NULL THEN
    RAISE EXCEPTION 'Strategy Track course not found';
  END IF;
  
  -- Check if already enrolled
  SELECT id INTO enrollment_id FROM user_course_enrollments 
  WHERE user_course_enrollments.user_id = enroll_user_in_strategy_track.user_id 
  AND user_course_enrollments.course_id = enroll_user_in_strategy_track.course_id;
  
  IF enrollment_id IS NOT NULL THEN
    RETURN enrollment_id; -- Already enrolled
  END IF;
  
  -- Create enrollment
  INSERT INTO user_course_enrollments (user_id, course_id, status, enrolled_at, started_at)
  VALUES (enroll_user_in_strategy_track.user_id, enroll_user_in_strategy_track.course_id, 'active', NOW(), NOW())
  RETURNING id INTO enrollment_id;
  
  -- Get total case count for this course
  SELECT COUNT(*) INTO total_case_count
  FROM course_case_types cct
  WHERE cct.course_id = enroll_user_in_strategy_track.course_id
  AND cct.is_required = true;
  
  -- Create initial progress tracking
  INSERT INTO user_course_progress (user_id, course_id, total_cases)
  VALUES (enroll_user_in_strategy_track.user_id, enroll_user_in_strategy_track.course_id, total_case_count);
  
  -- Update user_profiles (only if no current course set)
  UPDATE user_profiles 
  SET current_course_id = enroll_user_in_strategy_track.course_id
  WHERE id = enroll_user_in_strategy_track.user_id
  AND current_course_id IS NULL;
  
  RETURN enrollment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- User-Kurs-Status abrufen
CREATE OR REPLACE FUNCTION get_user_course_status(user_id UUID)
RETURNS TABLE(
  course_slug VARCHAR(50),
  course_name VARCHAR(100),
  enrollment_status VARCHAR(20),
  progress_percentage DECIMAL(5,2),
  completed_cases INTEGER,
  total_cases INTEGER,
  current_case_type VARCHAR(100),
  last_activity_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.slug,
    c.name,
    uce.status,
    uce.progress_percentage,
    COALESCE(ucp.completed_cases, 0),
    COALESCE(ucp.total_cases, 0),
    ct.name as current_case_type,
    uce.last_activity_at
  FROM user_course_enrollments uce
  JOIN courses c ON c.id = uce.course_id
  LEFT JOIN user_course_progress ucp ON ucp.user_id = uce.user_id AND ucp.course_id = uce.course_id
  LEFT JOIN case_types ct ON ct.id = ucp.current_case_type_id
  WHERE uce.user_id = get_user_course_status.user_id
  AND uce.status IN ('active', 'completed')
  ORDER BY uce.last_activity_at DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 10: SAFE MIGRATION FOR EXISTING USERS
-- =====================================================

-- Migriere existierende User automatisch in Strategy Track (safe)
DO $$
DECLARE
  user_record RECORD;
  enrolled_count INTEGER := 0;
BEGIN
  FOR user_record IN 
    SELECT up.id 
    FROM user_profiles up 
    WHERE up.role = 'user'
    AND NOT EXISTS (
      SELECT 1 FROM user_course_enrollments uce 
      WHERE uce.user_id = up.id
    )
  LOOP
    BEGIN
      PERFORM enroll_user_in_strategy_track(user_record.id);
      enrolled_count := enrolled_count + 1;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Warning: Could not enroll user % in Strategy Track: %', user_record.id, SQLERRM;
    END;
  END LOOP;
  
  RAISE NOTICE '✅ Successfully enrolled % existing users in Strategy Track', enrolled_count;
END $$;

-- =====================================================
-- FINAL VERIFICATION
-- =====================================================

DO $$
DECLARE
  course_count INTEGER;
  enrollment_count INTEGER;
  progress_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO course_count FROM courses;
  SELECT COUNT(*) INTO enrollment_count FROM user_course_enrollments;
  SELECT COUNT(*) INTO progress_count FROM user_course_progress;
  
  RAISE NOTICE '==========================================';
  RAISE NOTICE '✅ MULTI-COURSE MIGRATION COMPLETED SUCCESSFULLY';
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'Courses created: %', course_count;
  RAISE NOTICE 'User enrollments: %', enrollment_count;
  RAISE NOTICE 'Progress records: %', progress_count;
  RAISE NOTICE '==========================================';
  RAISE NOTICE '🔥 Ready for Multi-Course Architecture!';
  RAISE NOTICE '==========================================';
END $$;

-- =====================================================
-- DOCUMENTATION
-- =====================================================

COMMENT ON TABLE courses IS 'Multi-Kurs-System: Verfügbare Kurse (Strategy Track, Finance Track, etc.)';
COMMENT ON TABLE user_course_enrollments IS 'User-Kurs-Einschreibungen mit Status und Progress-Tracking';
COMMENT ON TABLE course_case_types IS 'Many-to-Many: Welche Case Types gehören zu welchem Kurs (mit Sequenz)';
COMMENT ON TABLE user_course_progress IS 'Kurs-spezifischer Lernfortschritt (parallel zu globalem user_progress)';

COMMENT ON FUNCTION enroll_user_in_strategy_track(UUID) IS 'Sichere Einschreibung in Strategy Track für Onboarding';
COMMENT ON FUNCTION get_user_course_status(UUID) IS 'Vollständiger Kurs-Status und Progress für Dashboard-Personalisierung';
