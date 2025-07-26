-- SIMPLE ASSESSMENTS TABLE CHECK
-- Quick diagnosis of assessments table structure

-- 1. CHECK IF TABLE EXISTS
SELECT EXISTS (
  SELECT 1 
  FROM information_schema.tables 
  WHERE table_name = 'assessments'
) as table_exists;

-- 2. SHOW ALL COLUMNS
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'assessments' 
ORDER BY ordinal_position;

-- 3. COUNT ROWS
SELECT COUNT(*) as total_rows FROM assessments;

-- 4. SHOW FIRST ROW (if any)
SELECT * FROM assessments LIMIT 1;
