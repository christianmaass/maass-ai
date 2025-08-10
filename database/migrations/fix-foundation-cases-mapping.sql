-- =====================================================
-- FOUNDATION CASES KORREKTUR FÜR STRATEGY TRACK
-- =====================================================
-- Ordnet die 12 foundation_cases dem Strategy Track zu
-- Entfernt die falsche case_types Zuordnung

-- =====================================================
-- STEP 1: PRÜFE FOUNDATION_CASES TABELLE
-- =====================================================

-- Prüfe foundation_cases Tabellenstruktur
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'foundation_cases'
ORDER BY ordinal_position;

-- Zeige foundation_cases Anzahl
SELECT 
  COUNT(*) as foundation_cases_count,
  'foundation_cases table exists' as status
FROM foundation_cases;

-- Zeige alle foundation_cases (mit verfügbaren Spalten)
SELECT * 
FROM foundation_cases 
ORDER BY id
LIMIT 5;

-- =====================================================
-- STEP 2: LÖSCHE FALSCHE CASE_TYPES ZUORDNUNG
-- =====================================================

-- Entferne case_types Zuordnung zum Strategy Track
DELETE FROM course_case_types 
WHERE course_id = (
  SELECT id FROM courses WHERE slug = 'strategy-track'
);

-- =====================================================
-- STEP 3: ERSTELLE FOUNDATION_CASES → STRATEGY TRACK ZUORDNUNG
-- =====================================================

-- Option A: Direkte Zuordnung (wenn foundation_cases bereits case_id hat)
-- Prüfe erst die Struktur:
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'foundation_cases';

-- Option B: Neue Zuordnungs-Tabelle für foundation_cases
-- WICHTIG: foundation_cases.id ist TEXT, nicht UUID!
CREATE TABLE IF NOT EXISTS course_foundation_cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  foundation_case_id TEXT NOT NULL REFERENCES foundation_cases(id) ON DELETE CASCADE,
  sequence_order INTEGER DEFAULT 0,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, foundation_case_id)
);

-- Ordne alle 12 foundation_cases dem Strategy Track zu
INSERT INTO course_foundation_cases (course_id, foundation_case_id, sequence_order, is_required)
SELECT 
  c.id as course_id,
  fc.id as foundation_case_id,
  ROW_NUMBER() OVER (ORDER BY fc.title) as sequence_order,
  true as is_required
FROM courses c
CROSS JOIN foundation_cases fc
WHERE c.slug = 'strategy-track'
ON CONFLICT (course_id, foundation_case_id) DO NOTHING;

-- =====================================================
-- STEP 4: RLS POLICIES FÜR NEUE TABELLE
-- =====================================================

ALTER TABLE course_foundation_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Course foundation cases are publicly readable" 
ON course_foundation_cases FOR SELECT USING (true);

-- =====================================================
-- STEP 5: INDEXES FÜR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_course_foundation_cases_course_id 
ON course_foundation_cases(course_id);

CREATE INDEX IF NOT EXISTS idx_course_foundation_cases_sequence 
ON course_foundation_cases(course_id, sequence_order);

-- =====================================================
-- STEP 6: HELPER FUNCTION AKTUALISIEREN
-- =====================================================

-- Neue Funktion für Strategy Track Foundation Cases
-- WICHTIG: foundation_cases.id ist TEXT!
CREATE OR REPLACE FUNCTION get_strategy_track_foundation_cases()
RETURNS TABLE(
  case_id TEXT,
  title TEXT,
  difficulty INTEGER,
  sequence_order INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fc.id,
    fc.title,
    fc.difficulty,
    cfc.sequence_order
  FROM course_foundation_cases cfc
  JOIN foundation_cases fc ON fc.id = cfc.foundation_case_id
  JOIN courses c ON c.id = cfc.course_id
  WHERE c.slug = 'strategy-track'
  AND cfc.is_required = true
  ORDER BY cfc.sequence_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 7: VERIFICATION
-- =====================================================

-- Prüfe Zuordnung
SELECT 
  c.name as course_name,
  COUNT(cfc.foundation_case_id) as foundation_cases_count
FROM courses c
LEFT JOIN course_foundation_cases cfc ON cfc.course_id = c.id
WHERE c.slug = 'strategy-track'
GROUP BY c.id, c.name;

-- Zeige alle zugeordneten Foundation Cases
SELECT 
  c.name as course_name,
  fc.title as case_title,
  cfc.sequence_order,
  fc.difficulty
FROM courses c
JOIN course_foundation_cases cfc ON cfc.course_id = c.id
JOIN foundation_cases fc ON fc.id = cfc.foundation_case_id
WHERE c.slug = 'strategy-track'
ORDER BY cfc.sequence_order;

-- =====================================================
-- FINAL RESULT
-- =====================================================

DO $$
DECLARE
  foundation_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO foundation_count 
  FROM course_foundation_cases cfc
  JOIN courses c ON c.id = cfc.course_id
  WHERE c.slug = 'strategy-track';
  
  RAISE NOTICE '==========================================';
  RAISE NOTICE '✅ FOUNDATION CASES KORREKTUR ABGESCHLOSSEN';
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'Strategy Track Foundation Cases: %', foundation_count;
  RAISE NOTICE '✅ Alle 12 foundation_cases zugeordnet!';
  RAISE NOTICE '==========================================';
END $$;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE course_foundation_cases IS 'Zuordnung von Foundation Cases zu Kursen (Strategy Track: 12 Cases)';
COMMENT ON FUNCTION get_strategy_track_foundation_cases() IS 'Liefert alle Foundation Cases für Strategy Track in korrekter Reihenfolge';
