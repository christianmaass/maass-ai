-- DEFINITIVE TRIGGER SOLUTION
-- Ensures automatic user_profiles creation on registration
-- Cleans up any existing conflicting triggers

-- 1. CLEANUP: Remove all existing conflicting triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_new_user_profile();

-- 2. CREATE DEFINITIVE TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_new_user_registration()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    full_name TEXT;
    name_parts TEXT[];
    first_name_val TEXT;
    last_name_val TEXT;
BEGIN
    -- Extract name from user metadata
    full_name := COALESCE(
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name', 
        split_part(NEW.email, '@', 1) -- fallback: use email prefix
    );
    
    -- Split name into first and last name
    name_parts := string_to_array(trim(full_name), ' ');
    first_name_val := COALESCE(name_parts[1], 'User');
    
    -- Handle last name (everything after first word)
    IF array_length(name_parts, 1) > 1 THEN
        last_name_val := array_to_string(name_parts[2:], ' ');
    ELSE
        last_name_val := '';
    END IF;
    
    -- Insert into user_profiles with all required fields
    INSERT INTO public.user_profiles (
        id,
        email,
        name,
        first_name,
        last_name,
        role,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        full_name,
        first_name_val,
        last_name_val,
        'user', -- default role
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        updated_at = NOW();
    
    RETURN NEW;
EXCEPTION
    WHEN others THEN
        -- Log error but don't break auth process
        RAISE LOG 'Error in handle_new_user_registration: %', SQLERRM;
        RETURN NEW;
END;
$$;

-- 3. CREATE DEFINITIVE TRIGGER
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_new_user_registration();

-- 4. VERIFY TRIGGER IS ACTIVE
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created'
AND event_object_schema = 'auth'
AND event_object_table = 'users';

-- 5. VERIFY FUNCTION EXISTS
SELECT 
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user_registration'
AND routine_schema = 'public';

-- 6. TEST TRIGGER (Optional - for verification)
-- This will show if the trigger function can be called
-- SELECT public.handle_new_user_registration();

-- 7. GRANT NECESSARY PERMISSIONS
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.user_profiles TO postgres, anon, authenticated, service_role;

-- 8. FINAL VERIFICATION MESSAGE
SELECT 'Trigger setup complete! New users will automatically get user_profiles entries.' as status;
