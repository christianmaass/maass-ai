-- Simplified Supabase Auth Fix
-- Run this in your Supabase SQL Editor

-- 1. Temporarily disable RLS to test if that's the issue
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- 2. Drop existing trigger and function to recreate them properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_profile();

-- 3. Create a simpler trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User')
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't fail the auth process
    RAISE LOG 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- 4. Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- 5. Test if the setup works by checking the function
SELECT proname FROM pg_proc WHERE proname = 'handle_new_user_profile';

-- 6. Re-enable RLS after testing
-- ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
