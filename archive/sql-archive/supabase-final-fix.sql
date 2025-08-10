-- FINAL FIX: Create missing trigger on auth.users
-- The function exists, but the trigger is missing!

-- 1. First, check if trigger exists (should return empty)
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created' 
AND event_object_table = 'users'
AND event_object_schema = 'auth';

-- 2. Create the missing trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- 3. Verify trigger was created
SELECT trigger_name, event_object_table, event_object_schema 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 4. Test the function manually (optional)
-- SELECT public.handle_new_user_profile();
