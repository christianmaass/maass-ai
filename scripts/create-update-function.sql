-- =====================================================
-- CREATE UPDATE FUNCTION TO BYPASS SCHEMA CACHE
-- =====================================================
-- Purpose: Raw SQL function to update foundation_cases without schema cache issues

-- Create the function
CREATE OR REPLACE FUNCTION update_foundation_case(
  case_id TEXT,
  new_description TEXT,
  new_question TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_row foundation_cases%ROWTYPE;
  rows_affected INTEGER;
BEGIN
  -- Perform the update
  UPDATE foundation_cases 
  SET 
    case_description = new_description,
    case_question = new_question,
    updated_at = NOW()
  WHERE id = case_id
  RETURNING * INTO result_row;
  
  -- Check if any rows were affected
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  
  -- Return result as JSON
  IF rows_affected > 0 THEN
    RETURN json_build_object(
      'success', true,
      'rows_affected', rows_affected,
      'updated_case', row_to_json(result_row)
    );
  ELSE
    RETURN json_build_object(
      'success', false,
      'error', 'No rows updated - case ID not found',
      'case_id', case_id
    );
  END IF;
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM,
      'sqlstate', SQLSTATE
    );
END;
$$;

-- Grant execute permission to authenticated users and service_role
GRANT EXECUTE ON FUNCTION update_foundation_case(TEXT, TEXT, TEXT) TO authenticated, service_role;

-- Test the function
SELECT update_foundation_case(
  'foundation-case-1',
  'Test description - ' || NOW()::text,
  'Test question - ' || NOW()::text
);

-- Verify the update worked
SELECT id, case_description, case_question, updated_at 
FROM foundation_cases 
WHERE id = 'foundation-case-1';
