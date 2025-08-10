/**
 * SAFE USER-TRACKING MIGRATION
 * Sichere, schrittweise Migration der User-Tracking-Felder
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
    console.log('🚀 Starting SAFE User-Tracking Migration...');

    const steps = [];
    let currentStep = 0;

    // SCHRITT 1: Spalten hinzufügen (einzeln für bessere Fehlerbehandlung)
    const columns = [
      { name: 'login_count', type: 'INTEGER DEFAULT 0' },
      { name: 'first_login_at', type: 'TIMESTAMP WITH TIME ZONE' },
      { name: 'last_login_at', type: 'TIMESTAMP WITH TIME ZONE' },
      { name: 'last_activity_track', type: 'VARCHAR(50)' },
      { name: 'last_activity_at', type: 'TIMESTAMP WITH TIME ZONE' },
      { name: 'onboarding_completed', type: 'BOOLEAN DEFAULT FALSE' },
    ];

    for (const column of columns) {
      currentStep++;
      console.log(`Step ${currentStep}: Adding column ${column.name}...`);

      try {
        const { error } = await supabase.rpc('exec_sql', {
          sql: `ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS ${column.name} ${column.type};`,
        });

        if (error) {
          throw new Error(`Failed to add column ${column.name}: ${error.message}`);
        }

        steps.push({
          step: currentStep,
          action: `Add column ${column.name}`,
          status: 'success',
          sql: `ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS ${column.name} ${column.type};`,
        });
      } catch (error) {
        steps.push({
          step: currentStep,
          action: `Add column ${column.name}`,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        throw error;
      }
    }

    // SCHRITT 2: Indizes erstellen
    currentStep++;
    console.log(`Step ${currentStep}: Creating indexes...`);

    try {
      const { error: indexError1 } = await supabase.rpc('exec_sql', {
        sql: `CREATE INDEX IF NOT EXISTS idx_user_profiles_login_tracking ON user_profiles(login_count, last_login_at);`,
      });

      const { error: indexError2 } = await supabase.rpc('exec_sql', {
        sql: `CREATE INDEX IF NOT EXISTS idx_user_profiles_activity_tracking ON user_profiles(last_activity_track, last_activity_at);`,
      });

      if (indexError1 || indexError2) {
        throw new Error(`Index creation failed: ${indexError1?.message || indexError2?.message}`);
      }

      steps.push({
        step: currentStep,
        action: 'Create performance indexes',
        status: 'success',
        sql: 'CREATE INDEX IF NOT EXISTS...',
      });
    } catch (error) {
      steps.push({
        step: currentStep,
        action: 'Create performance indexes',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }

    // SCHRITT 3: Bestehende User mit Default-Werten aktualisieren
    currentStep++;
    console.log(`Step ${currentStep}: Updating existing users...`);

    try {
      const { error: updateError } = await supabase.rpc('exec_sql', {
        sql: `
          UPDATE user_profiles 
          SET 
            login_count = COALESCE(login_count, 1),
            first_login_at = COALESCE(first_login_at, created_at),
            last_login_at = COALESCE(last_login_at, updated_at),
            onboarding_completed = COALESCE(onboarding_completed, FALSE)
          WHERE login_count IS NULL OR onboarding_completed IS NULL;
        `,
      });

      if (updateError) {
        throw new Error(`User update failed: ${updateError.message}`);
      }

      steps.push({
        step: currentStep,
        action: 'Update existing users with defaults',
        status: 'success',
        sql: 'UPDATE user_profiles SET...',
      });
    } catch (error) {
      steps.push({
        step: currentStep,
        action: 'Update existing users with defaults',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }

    // SCHRITT 4: Helper-Funktion erstellen
    currentStep++;
    console.log(`Step ${currentStep}: Creating helper function...`);

    try {
      const { error: functionError } = await supabase.rpc('exec_sql', {
        sql: `
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
        `,
      });

      if (functionError) {
        throw new Error(`Function creation failed: ${functionError.message}`);
      }

      steps.push({
        step: currentStep,
        action: 'Create helper function get_user_welcome_status',
        status: 'success',
        sql: 'CREATE OR REPLACE FUNCTION...',
      });
    } catch (error) {
      steps.push({
        step: currentStep,
        action: 'Create helper function',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }

    // SCHRITT 5: Verifikation
    currentStep++;
    console.log(`Step ${currentStep}: Verifying migration...`);

    const { data: verifyData, error: verifyError } = await supabase
      .from('user_profiles')
      .select('id, login_count, onboarding_completed, first_login_at, last_login_at')
      .limit(1);

    if (verifyError) {
      steps.push({
        step: currentStep,
        action: 'Verify migration',
        status: 'error',
        error: verifyError.message,
      });
      throw new Error(`Verification failed: ${verifyError.message}`);
    }

    steps.push({
      step: currentStep,
      action: 'Verify migration success',
      status: 'success',
      sampleData: verifyData?.[0],
    });

    console.log('✅ Migration completed successfully');

    return res.status(200).json({
      success: true,
      message: 'User-Tracking Migration completed successfully',
      totalSteps: currentStep,
      steps,
      sampleUserData: verifyData?.[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Migration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Migration failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      completedSteps: steps.filter((s) => s.status === 'success').length,
      steps,
      timestamp: new Date().toISOString(),
    });
  }
}
