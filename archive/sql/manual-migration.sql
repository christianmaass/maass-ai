-- MANUAL MIGRATION: Execute this in Supabase SQL Editor
-- Creates the proper create_test_user_profile function

CREATE OR REPLACE FUNCTION public.create_test_user_profile(
    user_id UUID,
    test_email TEXT,
    test_first_name TEXT,
    test_last_name TEXT,
    duration_hours INTEGER DEFAULT 24
)
RETURNS JSON
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    expires_at TIMESTAMP WITH TIME ZONE;
    result JSON;
BEGIN
    -- Calculate expiration time
    expires_at := NOW() + (duration_hours || ' hours')::INTERVAL;
    
    -- Create user profile with provided user_id from auth creation
    INSERT INTO public.user_profiles (
        id,
        email,
        first_name,
        last_name,
        role,
        expires_at,
        created_at,
        updated_at
    ) VALUES (
        user_id,
        test_email,
        test_first_name,
        test_last_name,
        'test_user',
        expires_at,
        NOW(),
        NOW()
    );
    
    -- Return result
    result := json_build_object(
        'id', user_id,
        'email', test_email,
        'first_name', test_first_name,
        'last_name', test_last_name,
        'expires_at', expires_at,
        'role', 'test_user'
    );
    
    RETURN result;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Log error and re-raise
        RAISE EXCEPTION 'Error creating test user profile: %', SQLERRM;
END;
$$;

-- Grant execute permission to authenticated users (admin role check will be done in API)
GRANT EXECUTE ON FUNCTION public.create_test_user_profile TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION public.create_test_user_profile IS 'Creates a test user profile after auth user creation. Should only be called by admin users.';
