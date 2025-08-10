-- =====================================================
-- MULTI-COURSE ARCHITECTURE MIGRATION - SAFE VERSION
-- =====================================================
-- WICHTIG: Diese Migration ist 100% BACKWARD COMPATIBLE
-- Erweitert das Schema für mehrere Kurse ohne Breaking Changes
-- Bestehende user_progress Tabelle bleibt unverändert
-- Neue Strukturen werden parallel aufgebaut

-- =====================================================
-- STEP 1: CREATE COURSES TABLE
-- =====================================================

CREATE TABLE courses (
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
-- STEP 2: CREATE USER-COURSE ENROLLMENTS
-- =====================================================

CREATE TABLE user_course_enrollments (
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
-- STEP 3: EXTEND CASE_TYPES WITH COURSE RELATION
-- =====================================================

-- Verbinde case_types mit courses (many-to-many, da ein case_type in mehreren Kursen verwendet werden könnte)
CREATE TABLE course_case_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  case_type_id UUID NOT NULL REFERENCES case_types(id) ON DELETE CASCADE,
  sequence_order INTEGER DEFAULT 0, -- Reihenfolge der case_types im Kurs
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, case_type_id)
);

-- =====================================================
-- STEP 4: CREATE COURSE-SPECIFIC PROGRESS (PARALLEL TO EXISTING)
-- =====================================================

-- WICHTIG: user_progress Tabelle bleibt unverändert für Backward Compatibility
-- Neue Tabelle für kurs-spezifischen Progress (parallel)
CREATE TABLE user_course_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completed_cases INTEGER DEFAULT 0,
  total_cases INTEGER DEFAULT 0, -- Gesamtanzahl Cases im Kurs
  average_score DECIMAL(3,1) DEFAULT 0,
  strong_areas TEXT[],
  weak_areas TEXT[],
  current_case_type_id UUID REFERENCES case_types(id), -- Aktueller case_type im Kurs
  last_case_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- =====================================================
-- STEP 5: SAFE USER_PROFILES EXTENSION
-- =====================================================

-- Erweitere user_profiles um Course-Tracking (nur neue Spalten)
-- SICHER: Bestehende Spalten bleiben unverändert
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS current_course_id UUID REFERENCES courses(id),
ADD COLUMN IF NOT EXISTS completed_courses_count INTEGER DEFAULT 0;

-- Update last_activity_track to be more structured (optional, kann auch String bleiben)
-- ALTER TABLE user_profiles 
-- DROP COLUMN last_activity_track,
-- ADD COLUMN last_activity_course_id UUID REFERENCES courses(id),
-- ADD COLUMN last_activity_case_type_id UUID REFERENCES case_types(id);

-- =====================================================
-- STEP 6: CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_is_active ON courses(is_active);
CREATE INDEX idx_courses_sort_order ON courses(sort_order);

CREATE INDEX idx_user_course_enrollments_user_id ON user_course_enrollments(user_id);
CREATE INDEX idx_user_course_enrollments_course_id ON user_course_enrollments(course_id);
CREATE INDEX idx_user_course_enrollments_status ON user_course_enrollments(status);
CREATE INDEX idx_user_course_enrollments_last_activity ON user_course_enrollments(last_activity_at);

CREATE INDEX idx_course_case_types_course_id ON course_case_types(course_id);
CREATE INDEX idx_course_case_types_sequence ON course_case_types(course_id, sequence_order);

CREATE INDEX idx_user_course_progress_user_id ON user_course_progress(user_id);
CREATE INDEX idx_user_course_progress_course_id ON user_course_progress(course_id);

CREATE INDEX idx_user_profiles_current_course ON user_profiles(current_course_id) WHERE current_course_id IS NOT NULL;

-- =====================================================
-- STEP 7: CREATE RLS POLICIES
-- =====================================================

-- Courses sind public readable
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Courses are publicly readable" ON courses FOR SELECT USING (is_active = true);

-- User Course Enrollments - nur eigene sichtbar
ALTER TABLE user_course_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own enrollments" ON user_course_enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own enrollments" ON user_course_enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own enrollments" ON user_course_enrollments FOR UPDATE USING (auth.uid() = user_id);

-- Course Case Types sind public readable
ALTER TABLE course_case_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Course case types are publicly readable" ON course_case_types FOR SELECT USING (true);

-- User Course Progress - nur eigene sichtbar
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own course progress" ON user_course_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own course progress" ON user_course_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own course progress" ON user_course_progress FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- STEP 8: SEED INITIAL DATA
-- =====================================================

-- Erstelle Strategy Track als ersten Kurs
INSERT INTO courses (slug, name, description, difficulty_level, estimated_duration_hours, is_active, sort_order) VALUES
('strategy-track', 'Strategy Track', 'Strategische Unternehmensberatung: Von Market Entry bis M&A', 4, 40, true, 1);

-- Verbinde existierende case_types mit Strategy Track
INSERT INTO course_case_types (course_id, case_type_id, sequence_order, is_required)
SELECT 
  c.id as course_id,
  ct.id as case_type_id,
  ROW_NUMBER() OVER (ORDER BY ct.name) as sequence_order,
  true as is_required
FROM courses c
CROSS JOIN case_types ct
WHERE c.slug = 'strategy-track';

-- =====================================================
-- STEP 9: HELPER FUNCTIONS
-- =====================================================

-- Funktion um User automatisch in Strategy Track einzuschreiben (für Onboarding)
CREATE OR REPLACE FUNCTION enroll_user_in_strategy_track(user_id UUID)
RETURNS UUID AS $$
DECLARE
  course_id UUID;
  enrollment_id UUID;
BEGIN
  -- Get Strategy Track course ID
  SELECT id INTO course_id FROM courses WHERE slug = 'strategy-track' AND is_active = true;
  
  IF course_id IS NULL THEN
    RAISE EXCEPTION 'Strategy Track course not found';
  END IF;
  
  -- Check if already enrolled
  SELECT id INTO enrollment_id FROM user_course_enrollments 
  WHERE user_course_enrollments.user_id = enroll_user_in_strategy_track.user_id 
  AND course_id = enroll_user_in_strategy_track.course_id;
  
  IF enrollment_id IS NOT NULL THEN
    RETURN enrollment_id; -- Already enrolled
  END IF;
  
  -- Create enrollment
  INSERT INTO user_course_enrollments (user_id, course_id, status, enrolled_at, started_at)
  VALUES (enroll_user_in_strategy_track.user_id, course_id, 'active', NOW(), NOW())
  RETURNING id INTO enrollment_id;
  
  -- Create initial progress tracking
  INSERT INTO user_course_progress (user_id, course_id, total_cases)
  SELECT 
    enroll_user_in_strategy_track.user_id,
    course_id,
    COUNT(cct.id)
  FROM course_case_types cct
  WHERE cct.course_id = enroll_user_in_strategy_track.course_id
  AND cct.is_required = true;
  
  -- Update user_profiles
  UPDATE user_profiles 
  SET current_course_id = course_id
  WHERE id = enroll_user_in_strategy_track.user_id
  AND current_course_id IS NULL; -- Nur setzen wenn noch kein aktueller Kurs
  
  RETURN enrollment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funktion um User-Kurs-Status abzurufen
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
    ucp.completed_cases,
    ucp.total_cases,
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
-- STEP 10: MIGRATION SCRIPT FOR EXISTING USERS
-- =====================================================

-- Migriere existierende User automatisch in Strategy Track
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT up.id 
    FROM user_profiles up 
    WHERE up.role = 'user'
  LOOP
    PERFORM enroll_user_in_strategy_track(user_record.id);
  END LOOP;
END $$;

-- =====================================================
-- COMMENTS & DOCUMENTATION
-- =====================================================

COMMENT ON TABLE courses IS 'Verfügbare Kurse (Strategy Track, Finance Track, etc.)';
COMMENT ON TABLE user_course_enrollments IS 'User-Kurs-Einschreibungen mit Status und Progress';
COMMENT ON TABLE course_case_types IS 'Zuordnung von Case Types zu Kursen mit Reihenfolge';
COMMENT ON TABLE user_course_progress IS 'Kurs-spezifischer Lernfortschritt pro User';

COMMENT ON FUNCTION enroll_user_in_strategy_track(UUID) IS 'Schreibt User automatisch in Strategy Track ein (für Onboarding)';
COMMENT ON FUNCTION get_user_course_status(UUID) IS 'Liefert aktuellen Kurs-Status und Progress für einen User';
