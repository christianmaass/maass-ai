-- Add first_name and last_name columns to user_profiles
-- This allows for better personalization ("Hallo, Christian!" instead of "Hallo, Christian Maass!")

-- 1. Add new columns for first and last name
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT;

-- 2. Update existing trigger function to handle first/last name
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
    
    -- Split name into parts (simple approach: first word = first name, rest = last name)
    name_parts := string_to_array(trim(full_name), ' ');
    
    INSERT INTO public.user_profiles (id, email, name, first_name, last_name, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        full_name,
        COALESCE(name_parts[1], 'User'), -- first name
        CASE 
            WHEN array_length(name_parts, 1) > 1 THEN 
                array_to_string(name_parts[2:], ' ') -- last name (everything after first word)
            ELSE 
                '' 
        END,
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
        -- Log the error but don't fail the auth process
        RAISE LOG 'Error creating user profile: %', SQLERRM;
        RETURN NEW;
END;
$$;

-- 3. Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;
