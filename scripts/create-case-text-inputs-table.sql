-- =====================================================
-- CASE TEXT INPUTS TABLE FOR STEP 3 (Analyse & Zahlenarbeit)
-- Simple text input storage with case and step reference
-- =====================================================

-- Drop table if exists (for clean recreation)
DROP TABLE IF EXISTS case_text_inputs CASCADE;

-- Create case_text_inputs table
CREATE TABLE case_text_inputs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    foundation_case_id TEXT NOT NULL REFERENCES foundation_cases(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL CHECK (step_number >= 1 AND step_number <= 5),
    
    -- Text input fields
    user_input TEXT NOT NULL,
    explanation TEXT, -- Optional explanation/notes
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_case_text_inputs_case_step ON case_text_inputs(foundation_case_id, step_number);
CREATE INDEX idx_case_text_inputs_created_at ON case_text_inputs(created_at);

-- Create unique constraint for upsert functionality
ALTER TABLE case_text_inputs ADD CONSTRAINT unique_case_step UNIQUE (foundation_case_id, step_number);

-- =====================================================
-- RLS POLICIES (REUSING SAME PATTERNS AS OTHER TABLES)
-- =====================================================

-- Enable RLS
ALTER TABLE case_text_inputs ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read their own data
CREATE POLICY "Users can read case text inputs" ON case_text_inputs
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for service role to manage all data (for admin operations)
CREATE POLICY "Service role can manage case text inputs" ON case_text_inputs
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- TRIGGER FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_case_text_inputs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_case_text_inputs_updated_at
    BEFORE UPDATE ON case_text_inputs
    FOR EACH ROW
    EXECUTE FUNCTION update_case_text_inputs_updated_at();

-- =====================================================
-- TEST DATA (using existing case IDs)
-- =====================================================

-- Insert sample text input for step 3
INSERT INTO case_text_inputs (foundation_case_id, step_number, user_input, explanation)
SELECT 
    id,
    3,
    'Umsatzrückgang von 15% in Q3/Q4, besonders stark in der Altersgruppe 25-35. Marktanteil gesunken von 12% auf 9%. Hauptkonkurrenten haben aggressive Preisstrategien eingeführt.',
    'Quantitative Analyse der Kernindikatoren mit Fokus auf Segmentierung und Wettbewerbsvergleich'
FROM foundation_cases 
LIMIT 1;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'case_text_inputs';

-- Verify test data
SELECT 
    cti.id,
    fc.title as case_title,
    cti.step_number,
    LEFT(cti.user_input, 50) || '...' as input_preview,
    cti.explanation,
    cti.created_at
FROM case_text_inputs cti
JOIN foundation_cases fc ON cti.foundation_case_id = fc.id;
