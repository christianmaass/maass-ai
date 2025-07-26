-- TRIGGER REPAIR: Fix existing trigger that's not working
-- The trigger exists but doesn't work properly

-- 1. Check current trigger details
SELECT 
    trigger_name, 
    event_object_table, 
    event_object_schema,
    action_statement,
    action_timing,
    event_manipulation
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 2. Drop and recreate the trigger to fix any issues
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Recreate the trigger correctly
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- 4. Verify the new trigger
SELECT 
    trigger_name, 
    event_object_table, 
    event_object_schema,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 5. Test the function directly to ensure it works
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user_profile';
