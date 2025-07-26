-- Fix cases table - add missing case_type_id column if it doesn't exist
-- This script is safe to run multiple times

-- Check if case_type_id column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'cases' 
        AND column_name = 'case_type_id'
    ) THEN
        ALTER TABLE cases ADD COLUMN case_type_id UUID REFERENCES case_types(id);
        RAISE NOTICE 'Added case_type_id column to cases table';
    ELSE
        RAISE NOTICE 'case_type_id column already exists in cases table';
    END IF;
END $$;

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'cases' 
ORDER BY ordinal_position;
