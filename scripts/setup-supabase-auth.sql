-- ============================================================================
-- NAVAA SUPABASE AUTH SETUP (WP-A1)
-- ============================================================================
-- This script configures Supabase Auth for production-ready email delivery
-- and proper authentication settings for navaa.ai
-- 
-- USAGE:
-- 1. Run this script in Supabase SQL Editor
-- 2. Configure SMTP settings in Supabase Dashboard
-- 3. Test email delivery with test user creation
-- ============================================================================

-- Note: auth.users RLS is managed by Supabase automatically
-- We only configure user_profiles table which we own

-- Create or update auth configuration
DO $$
BEGIN
    -- Log the setup process
    RAISE NOTICE 'Starting navaa Supabase Auth Setup (WP-A1)...';
    
    -- Ensure user_profiles table has proper constraints
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_profiles_id_fkey'
    ) THEN
        ALTER TABLE user_profiles 
        ADD CONSTRAINT user_profiles_id_fkey 
        FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
        
        RAISE NOTICE '✅ Added foreign key constraint for user_profiles';
    END IF;
    
    -- Create index for better performance
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_user_profiles_role'
    ) THEN
        CREATE INDEX idx_user_profiles_role ON user_profiles(role);
        RAISE NOTICE '✅ Added index for user roles';
    END IF;
    
    RAISE NOTICE '✅ navaa Supabase Auth Setup completed successfully!';
END $$;

-- ============================================================================
-- AUTH POLICIES FOR SECURE ACCESS
-- ============================================================================

-- Policy: Users can read their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
CREATE POLICY "Users can read own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Policy: Admins can read all profiles (using function to avoid recursion)
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;
CREATE POLICY "Admins can read all profiles" ON user_profiles
    FOR SELECT USING (get_user_role() IN ('admin', 'super_admin'));

-- Policy: Admins can update all profiles (using function to avoid recursion)
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
CREATE POLICY "Admins can update all profiles" ON user_profiles
    FOR UPDATE USING (get_user_role() IN ('admin', 'super_admin'));

-- Policy: Admins can insert new profiles (using function to avoid recursion)
DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;
CREATE POLICY "Admins can insert profiles" ON user_profiles
    FOR INSERT WITH CHECK (get_user_role() IN ('admin', 'super_admin'));

-- ============================================================================
-- AUTH HELPER FUNCTIONS
-- ============================================================================

-- Function: Get current user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT role FROM user_profiles 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT role IN ('admin', 'super_admin') 
        FROM user_profiles 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- EMAIL TEMPLATE CONFIGURATION
-- ============================================================================

-- Note: Email templates must be configured in Supabase Dashboard
-- Go to: Authentication > Settings > Email Templates
-- 
-- CONFIRMATION EMAIL TEMPLATE:
-- Subject: Willkommen bei navaa - Bestätige deine Email
-- Body: See email-templates/confirmation.html
--
-- RECOVERY EMAIL TEMPLATE:  
-- Subject: navaa - Passwort zurücksetzen
-- Body: See email-templates/recovery.html
--
-- INVITE EMAIL TEMPLATE:
-- Subject: Du wurdest zu navaa eingeladen
-- Body: See email-templates/invite.html

-- ============================================================================
-- VERIFICATION AND TESTING
-- ============================================================================

-- Verify setup
DO $$
DECLARE
    policy_count INTEGER;
    function_count INTEGER;
BEGIN
    -- Check policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE tablename = 'user_profiles';
    
    -- Check functions
    SELECT COUNT(*) INTO function_count
    FROM pg_proc 
    WHERE proname IN ('get_user_role', 'is_admin');
    
    RAISE NOTICE '📊 Setup Verification:';
    RAISE NOTICE '   - RLS Policies: % created', policy_count;
    RAISE NOTICE '   - Helper Functions: % created', function_count;
    
    IF policy_count >= 5 AND function_count >= 2 THEN
        RAISE NOTICE '✅ WP-A1 Database Setup: SUCCESSFUL';
    ELSE
        RAISE NOTICE '❌ WP-A1 Database Setup: INCOMPLETE';
    END IF;
END $$;

-- ============================================================================
-- NEXT STEPS FOR WP-A1 COMPLETION
-- ============================================================================

/*
🎯 MANUAL STEPS REQUIRED IN SUPABASE DASHBOARD:

1. SMTP CONFIGURATION:
   - Go to Authentication > Settings > SMTP Settings
   - Host: smtp.sendgrid.net
   - Port: 587
   - Username: apikey
   - Password: [Your SendGrid API Key]
   - Sender email: admin@navaa.ai
   - Sender name: navaa Team

2. EMAIL TEMPLATES:
   - Go to Authentication > Settings > Email Templates
   - Update Confirmation, Recovery, and Invite templates
   - Use custom navaa branding and messaging

3. AUTH SETTINGS:
   - Enable email confirmations: YES
   - Enable new user signups: YES (for registration)
   - Site URL: https://navaa.ai
   - Redirect URLs: https://navaa.ai/auth/callback

4. TESTING:
   - Create test user via admin panel
   - Verify email delivery
   - Test login/logout flow
   - Verify JWT token generation

✅ Once completed, WP-A1 is ready for user acceptance testing!
*/
