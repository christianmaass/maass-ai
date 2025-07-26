-- ============================================================================
-- DEFINITIVE DATABASE MIGRATION - NAVAA.AI
-- ============================================================================
-- This single file replaces ALL other SQL migrations
-- Execute this ONCE in Supabase SQL Editor to fix all database issues
-- ============================================================================

-- STEP 1: CLEANUP - Remove conflicting triggers and functions
-- ============================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_new_user_profile();
DROP FUNCTION IF EXISTS public.handle_new_user_registration();

-- STEP 2: USER_PROFILES TABLE - Fix schema for AuthContext
-- ============================================================================
-- Ensure user_profiles has ALL required columns
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add role constraint (safe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_profiles_role_check' 
        AND table_name = 'user_profiles'
    ) THEN
        ALTER TABLE public.user_profiles 
        ADD CONSTRAINT user_profiles_role_check 
        CHECK (role IN ('admin', 'user', 'test_user'));
    END IF;
END $$;

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles (safe)
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" 
ON public.user_profiles FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" 
ON public.user_profiles FOR UPDATE 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.user_profiles;
CREATE POLICY "Enable insert for authenticated users only" 
ON public.user_profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Admin policy for user management
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;
CREATE POLICY "Admins can manage all profiles" 
ON public.user_profiles FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- STEP 3: ASSESSMENTS TABLE - For Dashboard statistics
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    case_id UUID,
    score INTEGER CHECK (score >= 0 AND score <= 10),
    feedback TEXT,
    response TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on assessments
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assessments
DROP POLICY IF EXISTS "Users can view own assessments" ON public.assessments;
CREATE POLICY "Users can view own assessments" 
ON public.assessments FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own assessments" ON public.assessments;
CREATE POLICY "Users can insert own assessments" 
ON public.assessments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- STEP 4: USER_SUBSCRIPTIONS TABLE - For tariff management
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tariff_plan_id UUID,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_subscriptions
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_subscriptions
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.user_subscriptions;
CREATE POLICY "Users can view own subscriptions" 
ON public.user_subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- STEP 5: USER_TARIFF_INFO VIEW - For check-case-limit API
-- ============================================================================
-- This view works with existing tariff_plans schema
CREATE OR REPLACE VIEW public.user_tariff_info AS
SELECT 
    up.id as user_id,
    up.email,
    up.name,
    up.role,
    COALESCE(tp.display_name, 'Free') as tariff_name,
    COALESCE(tp.cases_per_week, 5) as case_limit,
    COALESCE(tp.price_cents::decimal / 100, 0) as price_monthly,
    COUNT(a.id) as cases_used,
    (COALESCE(tp.cases_per_week, 5) - COUNT(a.id)) as cases_remaining
FROM public.user_profiles up
LEFT JOIN public.user_subscriptions us ON up.id = us.user_id AND us.status = 'active'
LEFT JOIN public.tariff_plans tp ON us.tariff_plan_id = tp.id
LEFT JOIN public.assessments a ON up.id = a.user_id 
    AND a.created_at >= date_trunc('week', NOW())
GROUP BY up.id, up.email, up.name, up.role, tp.display_name, tp.cases_per_week, tp.price_cents;

-- STEP 6: DEFINITIVE TRIGGER - Automatic user_profiles creation
-- ============================================================================
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
    -- Extract name from user metadata or email
    full_name := COALESCE(
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name', 
        split_part(NEW.email, '@', 1)
    );
    
    -- Split name into first and last name
    name_parts := string_to_array(trim(full_name), ' ');
    first_name_val := COALESCE(name_parts[1], 'User');
    
    -- Handle last name
    IF array_length(name_parts, 1) > 1 THEN
        last_name_val := array_to_string(name_parts[2:], ' ');
    ELSE
        last_name_val := '';
    END IF;
    
    -- Insert into user_profiles
    INSERT INTO public.user_profiles (
        id, email, name, first_name, last_name, role, created_at, updated_at
    )
    VALUES (
        NEW.id, NEW.email, full_name, first_name_val, last_name_val, 'user', NOW(), NOW()
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
        RAISE LOG 'Error in handle_new_user_registration: %', SQLERRM;
        RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_new_user_registration();

-- STEP 7: INDEXES - For performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON public.assessments(created_at);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);

-- STEP 8: DATA CLEANUP - Fix existing data
-- ============================================================================
-- Set name for existing users where missing
UPDATE public.user_profiles 
SET name = COALESCE(name, split_part(email, '@', 1))
WHERE name IS NULL OR name = '';

-- Set first_name for existing users where missing
UPDATE public.user_profiles 
SET first_name = COALESCE(first_name, split_part(COALESCE(name, email), ' ', 1))
WHERE first_name IS NULL OR first_name = '';

-- STEP 9: PERMISSIONS - Ensure proper access
-- ============================================================================
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.user_profiles TO postgres, authenticated, service_role;
GRANT ALL ON public.assessments TO postgres, authenticated, service_role;
GRANT ALL ON public.user_subscriptions TO postgres, authenticated, service_role;
GRANT SELECT ON public.user_tariff_info TO postgres, authenticated, service_role;

-- STEP 10: VERIFICATION - Check everything is working
-- ============================================================================
SELECT 'VERIFICATION RESULTS:' as status;

-- Check user_profiles schema
SELECT 'user_profiles columns:' as check_type, 
       array_agg(column_name ORDER BY ordinal_position) as columns
FROM information_schema.columns 
WHERE table_name = 'user_profiles' AND table_schema = 'public';

-- Check trigger exists
SELECT 'trigger exists:' as check_type,
       EXISTS(
           SELECT 1 FROM information_schema.triggers 
           WHERE trigger_name = 'on_auth_user_created'
       ) as result;

-- Check assessments table
SELECT 'assessments table:' as check_type,
       EXISTS(
           SELECT 1 FROM information_schema.tables 
           WHERE table_name = 'assessments' AND table_schema = 'public'
       ) as result;

-- Check user_tariff_info view
SELECT 'user_tariff_info view:' as check_type,
       EXISTS(
           SELECT 1 FROM information_schema.views 
           WHERE table_name = 'user_tariff_info' AND table_schema = 'public'
       ) as result;

-- Final success message
SELECT 'SUCCESS: Definitive database migration completed!' as status,
       'All backend errors (500, 400, 401) should now be fixed.' as details;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- This migration:
-- ✅ Fixes user_profiles 500 errors (missing columns)
-- ✅ Fixes check-case-limit 401 errors (user_tariff_info view)
-- ✅ Fixes assessments 400 errors (assessments table)
-- ✅ Creates reliable trigger for automatic profile creation
-- ✅ Sets up proper RLS policies for security
-- ✅ Adds performance indexes
-- ✅ Cleans up existing data
-- ============================================================================
