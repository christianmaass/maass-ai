-- =====================================================
-- USER TRACKING MIGRATION FOR WELCOMESECTION
-- =====================================================
-- Adds login tracking and activity tracking to user_profiles
-- for personalized welcome experience

-- Add new columns to user_profiles for tracking
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS first_login_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_activity_track VARCHAR(50), -- "Onboarding", "Foundation Track", etc.
ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP WITH TIME ZONE;

-- Create index for performance on frequently queried columns
CREATE INDEX IF NOT EXISTS idx_user_profiles_login_tracking 
ON user_profiles(login_count, last_login_at);

CREATE INDEX IF NOT EXISTS idx_user_profiles_activity_tracking 
ON user_profiles(last_activity_track, last_activity_at);

-- =====================================================
-- LOGIN TRACKING FUNCTION
-- =====================================================
-- Function to update login tracking when user logs in
CREATE OR REPLACE FUNCTION update_user_login_tracking()
RETURNS TRIGGER AS $$
BEGIN
  -- Update login tracking in user_profiles
  UPDATE user_profiles 
  SET 
    login_count = COALESCE(login_count, 0) + 1,
    last_login_at = NOW(),
    first_login_at = CASE 
      WHEN first_login_at IS NULL THEN NOW() 
      ELSE first_login_at 
    END,
    updated_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- ACTIVITY TRACKING FUNCTION
-- =====================================================
-- Function to update activity tracking
CREATE OR REPLACE FUNCTION update_user_activity_tracking(
  user_id UUID,
  track_name VARCHAR(50)
)
RETURNS VOID AS $$
BEGIN
  UPDATE user_profiles 
  SET 
    last_activity_track = track_name,
    last_activity_at = NOW(),
    updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGER FOR AUTOMATIC LOGIN TRACKING
-- =====================================================
-- Note: This trigger fires when user_profiles is updated during login
-- We'll integrate this with the auth flow in the application code

-- =====================================================
-- SEED DATA UPDATE
-- =====================================================
-- Update existing users with default values
UPDATE user_profiles 
SET 
  login_count = 1,
  first_login_at = created_at,
  last_login_at = created_at
WHERE login_count IS NULL OR login_count = 0;

-- =====================================================
-- HELPER FUNCTION FOR WELCOME STATUS
-- =====================================================
-- Function to get welcome status for a user
CREATE OR REPLACE FUNCTION get_user_welcome_status(user_id UUID)
RETURNS TABLE(
  is_first_time BOOLEAN,
  login_count INTEGER,
  first_name VARCHAR(100),
  last_activity_track VARCHAR(50),
  last_activity_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (up.login_count <= 1) as is_first_time,
    up.login_count,
    up.first_name,
    up.last_activity_track,
    up.last_activity_at
  FROM user_profiles up
  WHERE up.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- RLS POLICIES UPDATE
-- =====================================================
-- Ensure new columns are covered by existing RLS policies
-- (Existing policies should already cover these columns)

COMMENT ON COLUMN user_profiles.login_count IS 'Number of times user has logged in';
COMMENT ON COLUMN user_profiles.first_login_at IS 'Timestamp of first login';
COMMENT ON COLUMN user_profiles.last_login_at IS 'Timestamp of most recent login';
COMMENT ON COLUMN user_profiles.last_activity_track IS 'Last track/area user was active in (Onboarding, Foundation Track, etc.)';
COMMENT ON COLUMN user_profiles.last_activity_at IS 'Timestamp of last activity in any track';
