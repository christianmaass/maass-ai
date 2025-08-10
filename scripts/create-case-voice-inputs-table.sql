-- =====================================================
-- CASE VOICE INPUTS TABLE FOR SPEECH-TO-TEXT RECOMMENDATIONS
-- Stores voice transcripts with text fallback and metadata
-- =====================================================

-- Drop table if exists (for clean recreation)
DROP TABLE IF EXISTS case_voice_inputs CASCADE;

-- Create case_voice_inputs table
CREATE TABLE case_voice_inputs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    foundation_case_id TEXT NOT NULL REFERENCES foundation_cases(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL CHECK (step_number >= 1 AND step_number <= 5),
    
    -- Voice input fields
    voice_transcript TEXT NOT NULL, -- Main transcript from speech recognition
    text_fallback TEXT, -- Optional text fallback/alternative
    input_method VARCHAR(10) NOT NULL CHECK (input_method IN ('voice', 'text')), -- Primary input method
    audio_duration INTEGER, -- Recording duration in seconds
    
    -- GPT Feedback fields (REUSING same pattern as FreeText)
    gpt_feedback TEXT, -- GPT assessment and feedback
    gpt_score INTEGER CHECK (gpt_score >= 1 AND gpt_score <= 10), -- Score from 1-10
    gpt_ideal_answer TEXT, -- GPT-generated ideal answer for comparison
    feedback_requested_at TIMESTAMP WITH TIME ZONE, -- When feedback was requested
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_case_voice_inputs_case_step ON case_voice_inputs(foundation_case_id, step_number);
CREATE INDEX idx_case_voice_inputs_created_at ON case_voice_inputs(created_at);
CREATE INDEX idx_case_voice_inputs_method ON case_voice_inputs(input_method);

-- Create unique constraint for upsert functionality
ALTER TABLE case_voice_inputs ADD CONSTRAINT unique_case_step_voice UNIQUE (foundation_case_id, step_number);

-- =====================================================
-- RLS POLICIES (REUSING SAME PATTERNS AS OTHER TABLES)
-- =====================================================

-- Enable RLS
ALTER TABLE case_voice_inputs ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read their own data
CREATE POLICY "Users can read case voice inputs" ON case_voice_inputs
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for service role to manage all data (for admin operations)
CREATE POLICY "Service role can manage case voice inputs" ON case_voice_inputs
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- TRIGGER FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_case_voice_inputs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_case_voice_inputs_updated_at
    BEFORE UPDATE ON case_voice_inputs
    FOR EACH ROW
    EXECUTE FUNCTION update_case_voice_inputs_updated_at();

-- =====================================================
-- TEST DATA (using existing case IDs)
-- =====================================================

-- Insert sample voice input for step 5
INSERT INTO case_voice_inputs (foundation_case_id, step_number, voice_transcript, text_fallback, input_method, audio_duration)
SELECT 
    id,
    5,
    'Basierend auf meiner Analyse empfehle ich Option A, die Preiserhöhung. Diese Strategie bietet die beste Balance zwischen kurzfristiger Margenwirkung und Umsetzbarkeit. Das Risiko der Kundenabwanderung kann durch gezielte Kommunikation und Wertsteigerung minimiert werden.',
    'Empfehlung: Option A (Preiserhöhung) aufgrund optimaler Balance zwischen Margenwirkung und Umsetzbarkeit.',
    'voice',
    45
FROM foundation_cases 
LIMIT 1;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'case_voice_inputs';

-- Verify test data
SELECT 
    cvi.id,
    fc.title as case_title,
    cvi.step_number,
    LEFT(cvi.voice_transcript, 50) || '...' as transcript_preview,
    cvi.input_method,
    cvi.audio_duration,
    cvi.created_at
FROM case_voice_inputs cvi
JOIN foundation_cases fc ON cvi.foundation_case_id = fc.id;
