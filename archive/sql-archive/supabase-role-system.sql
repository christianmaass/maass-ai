-- Role-based User Management System
-- Replaces the yellow box test user creation with a professional role system

-- 1. Update user_profiles table with role constraints
ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_role_check 
CHECK (role IN ('admin', 'user', 'test_user'));

-- 2. Add expiration for test users
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- 3. Update trigger function to set default role
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    full_name TEXT;
    name_parts TEXT[];
BEGIN
    -- Get the full name from metadata
    full_name := COALESCE(NEW.raw_user_meta_data->>'name', 'User');
    
    -- Split name into parts
    name_parts := string_to_array(trim(full_name), ' ');
    
    INSERT INTO public.user_profiles (
        id, email, name, first_name, last_name, role, created_at, updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        full_name,
        COALESCE(name_parts[1], 'User'),
        CASE 
            WHEN array_length(name_parts, 1) > 1 THEN 
                array_to_string(name_parts[2:], ' ')
            ELSE 
                '' 
        END,
        'user', -- Default role for new registrations
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
        RAISE LOG 'Error creating user profile: %', SQLERRM;
        RETURN NEW;
END;
$$;

-- 4. Create function to create test users (for admins)
CREATE OR REPLACE FUNCTION public.create_test_user(
    test_email TEXT,
    test_name TEXT DEFAULT 'Test User',
    duration_hours INTEGER DEFAULT 24
)
RETURNS JSON
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    test_user_id TEXT;
    result JSON;
BEGIN
    -- Check if caller is admin (you'll need to implement this check)
    -- For now, we'll create the function and add auth later
    
    -- Generate unique test user ID
    test_user_id := 'test_' || extract(epoch from now())::text;
    
    -- Insert test user
    INSERT INTO public.user_profiles (
        id, email, name, first_name, last_name, role, expires_at, created_at, updated_at
    ) VALUES (
        test_user_id,
        test_email,
        test_name,
        split_part(test_name, ' ', 1),
        CASE WHEN position(' ' in test_name) > 0 
             THEN substring(test_name from position(' ' in test_name) + 1)
             ELSE '' END,
        'test_user',
        NOW() + (duration_hours || ' hours')::INTERVAL,
        NOW(),
        NOW()
    );
    
    -- Return test user info
    SELECT json_build_object(
        'id', test_user_id,
        'email', test_email,
        'name', test_name,
        'role', 'test_user',
        'expires_at', NOW() + (duration_hours || ' hours')::INTERVAL,
        'login_url', '/test-login?user_id=' || test_user_id
    ) INTO result;
    
    RETURN result;
END;
$$;

-- 5. Create function to cleanup expired test users
CREATE OR REPLACE FUNCTION public.cleanup_expired_test_users()
RETURNS INTEGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.user_profiles 
    WHERE role = 'test_user' 
    AND expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

-- 6. Create RLS policy for role-based access (safe approach)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'user_profiles' 
        AND policyname = 'Users can access based on role'
    ) THEN
        CREATE POLICY "Users can access based on role" 
        ON public.user_profiles FOR ALL
        USING (
            -- Users can access their own data
            auth.uid() = id 
            OR 
            -- Admins can access all data
            (
                SELECT role FROM public.user_profiles 
                WHERE id = auth.uid() 
                LIMIT 1
            ) = 'admin'
        );
    END IF;
END $$;

-- 7. Verify the setup
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;
