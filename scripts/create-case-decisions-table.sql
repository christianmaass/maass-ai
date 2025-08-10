-- =====================================================
-- CASE DECISIONS TABLE FOR STRUCTURED DECISION MATRIX
-- Stores user decisions with selected option and reasoning
-- =====================================================

-- Drop table if exists (for clean recreation)
DROP TABLE IF EXISTS case_decisions CASCADE;

-- Create case_decisions table
CREATE TABLE case_decisions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    foundation_case_id TEXT NOT NULL REFERENCES foundation_cases(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL CHECK (step_number >= 1 AND step_number <= 5),
    
    -- Decision fields
    selected_option VARCHAR(10) NOT NULL, -- A, B, C, etc.
    reasoning TEXT NOT NULL, -- User's reasoning for the choice
    
    -- Optional: Store the decision matrix data (for flexibility)
    decision_matrix JSONB, -- Store the options and criteria
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_case_decisions_case_step ON case_decisions(foundation_case_id, step_number);
CREATE INDEX idx_case_decisions_created_at ON case_decisions(created_at);
CREATE INDEX idx_case_decisions_option ON case_decisions(selected_option);

-- Create unique constraint for upsert functionality
ALTER TABLE case_decisions ADD CONSTRAINT unique_case_step_decision UNIQUE (foundation_case_id, step_number);

-- =====================================================
-- RLS POLICIES (REUSING SAME PATTERNS AS OTHER TABLES)
-- =====================================================

-- Enable RLS
ALTER TABLE case_decisions ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read their own data
CREATE POLICY "Users can read case decisions" ON case_decisions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for service role to manage all data (for admin operations)
CREATE POLICY "Service role can manage case decisions" ON case_decisions
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- TRIGGER FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_case_decisions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_case_decisions_updated_at
    BEFORE UPDATE ON case_decisions
    FOR EACH ROW
    EXECUTE FUNCTION update_case_decisions_updated_at();

-- =====================================================
-- TEST DATA (using existing case IDs)
-- =====================================================

-- Insert sample decision for step 5
INSERT INTO case_decisions (foundation_case_id, step_number, selected_option, reasoning, decision_matrix)
SELECT 
    id,
    5,
    'A',
    'Preiserhöhung ist die beste Option, da sie kurzfristig hohe Margenwirkung zeigt und das Risiko der Kundenabwanderung durch gezielte Kommunikation und Wertsteigerung minimiert werden kann.',
    '{
        "options": [
            {
                "id": "A",
                "name": "Preiserhöhung",
                "marge": "Hoch",
                "umsetzbarkeit": "Mittel", 
                "zeit": "Kurzfristig",
                "risiken": "Kundenabwanderung möglich"
            },
            {
                "id": "B", 
                "name": "R&D-Kürzung",
                "marge": "Mittel",
                "umsetzbarkeit": "Hoch",
                "zeit": "Sofort", 
                "risiken": "Innovation bremst"
            },
            {
                "id": "C",
                "name": "Neue Linie", 
                "marge": "Hoch",
                "umsetzbarkeit": "Gering",
                "zeit": "Langfristig",
                "risiken": "Hoher CAPEX, unsicher"
            }
        ]
    }'::jsonb
FROM foundation_cases 
LIMIT 1;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'case_decisions';

-- Verify test data
SELECT 
    cd.id,
    fc.title as case_title,
    cd.step_number,
    cd.selected_option,
    LEFT(cd.reasoning, 50) || '...' as reasoning_preview,
    cd.decision_matrix->'options'->0->>'name' as first_option,
    cd.created_at
FROM case_decisions cd
JOIN foundation_cases fc ON cd.foundation_case_id = fc.id;
