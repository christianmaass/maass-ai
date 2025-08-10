/**
 * ADMIN MIGRATION RUNNER
 * Führt die User-Tracking-Migration aus
 *
 * @version 1.0.0
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🚀 Starting User-Tracking Migration...');

    // 1. Add missing columns to user_profiles
    const migrationSQL = `
      -- Add new columns to user_profiles for tracking
      ALTER TABLE user_profiles 
      ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS first_login_at TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS last_activity_track VARCHAR(50),
      ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

      -- Create indexes for performance
      CREATE INDEX IF NOT EXISTS idx_user_profiles_login_tracking 
      ON user_profiles(login_count, last_login_at);

      CREATE INDEX IF NOT EXISTS idx_user_profiles_activity_tracking 
      ON user_profiles(last_activity_track, last_activity_at);

      -- Update existing users with default values
      UPDATE user_profiles 
      SET 
        login_count = COALESCE(login_count, 1),
        first_login_at = COALESCE(first_login_at, created_at),
        last_login_at = COALESCE(last_login_at, updated_at),
        onboarding_completed = COALESCE(onboarding_completed, FALSE)
      WHERE login_count IS NULL OR onboarding_completed IS NULL;
    `;

    const { error: migrationError } = await supabase.rpc('exec_sql', {
      sql: migrationSQL,
    });

    if (migrationError) {
      console.error('Migration error:', migrationError);
      return res.status(500).json({
        error: 'Migration failed',
        details: migrationError.message,
      });
    }

    // 2. Create helper function for user welcome status
    const functionSQL = `
      CREATE OR REPLACE FUNCTION get_user_welcome_status(user_id UUID)
      RETURNS JSON AS $$
      DECLARE
        result JSON;
      BEGIN
        SELECT json_build_object(
          'user_id', up.id,
          'is_first_time', COALESCE(up.login_count, 0) <= 1,
          'login_count', COALESCE(up.login_count, 0),
          'onboarding_completed', COALESCE(up.onboarding_completed, false),
          'last_activity_track', up.last_activity_track,
          'last_activity_at', up.last_activity_at,
          'first_login_at', up.first_login_at,
          'last_login_at', up.last_login_at
        ) INTO result
        FROM user_profiles up
        WHERE up.id = user_id;
        
        RETURN COALESCE(result, json_build_object(
          'user_id', user_id,
          'is_first_time', true,
          'login_count', 0,
          'onboarding_completed', false,
          'last_activity_track', null,
          'last_activity_at', null,
          'first_login_at', null,
          'last_login_at', null
        ));
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    const { error: functionError } = await supabase.rpc('exec_sql', {
      sql: functionSQL,
    });

    if (functionError) {
      console.error('Function creation error:', functionError);
      return res.status(500).json({
        error: 'Function creation failed',
        details: functionError.message,
      });
    }

    // 3. Verify migration success
    const { data: verifyData, error: verifyError } = await supabase
      .from('user_profiles')
      .select('id, login_count, onboarding_completed, first_login_at')
      .limit(1);

    if (verifyError) {
      console.error('Verification error:', verifyError);
      return res.status(500).json({
        error: 'Verification failed',
        details: verifyError.message,
      });
    }

    console.log('✅ Migration completed successfully');
    console.log('Sample user data:', verifyData?.[0]);

    return res.status(200).json({
      success: true,
      message: 'User-Tracking Migration completed successfully',
      sampleData: verifyData?.[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Migration error:', error);
    return res.status(500).json({
      error: 'Migration failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
