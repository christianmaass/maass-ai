/**
 * CHECK USER MIGRATION
 * Prüft ob ein spezifischer User die Migration erhalten hat
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

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID required' });
  }

  try {
    console.log(`🔍 Checking migration for user: ${userId}`);

    // Prüfe ob User in user_profiles existiert
    const { data: userData, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('User lookup error:', userError);
      return res.status(500).json({
        error: 'User lookup failed',
        details: userError.message,
      });
    }

    const userExists = !userError && userData;

    // Prüfe welche Tracking-Felder vorhanden sind
    const requiredFields = [
      'login_count',
      'first_login_at',
      'last_login_at',
      'last_activity_track',
      'last_activity_at',
      'onboarding_completed',
    ];

    let missingFields = [];
    let hasTrackingFields = false;

    if (userExists) {
      // Prüfe welche Felder undefined/null sind
      missingFields = requiredFields.filter(
        (field) => userData[field] === null || userData[field] === undefined,
      );

      hasTrackingFields = missingFields.length === 0;

      console.log(`User exists: ${userExists}`);
      console.log(`Missing fields: ${missingFields.join(', ')}`);
      console.log(`Has all tracking fields: ${hasTrackingFields}`);
    } else {
      missingFields = requiredFields;
      console.log('User not found in user_profiles table');
    }

    // Zusätzlich: Prüfe Schema-Struktur
    const { data: schemaData, error: schemaError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name IN ('login_count', 'onboarding_completed', 'first_login_at', 'last_login_at', 'last_activity_track', 'last_activity_at');
      `,
    });

    const schemaFields = schemaError ? [] : (schemaData || []).map((row) => row.column_name);
    const schemaComplete = requiredFields.every((field) => schemaFields.includes(field));

    return res.status(200).json({
      success: true,
      userId,
      userExists,
      hasTrackingFields,
      missingFields,
      userData: userExists
        ? {
            id: userData.id,
            email: userData.email,
            login_count: userData.login_count,
            onboarding_completed: userData.onboarding_completed,
            first_login_at: userData.first_login_at,
            last_login_at: userData.last_login_at,
            last_activity_track: userData.last_activity_track,
            last_activity_at: userData.last_activity_at,
            created_at: userData.created_at,
            updated_at: userData.updated_at,
          }
        : null,
      schema: {
        fieldsInSchema: schemaFields,
        schemaComplete,
        missingFromSchema: requiredFields.filter((field) => !schemaFields.includes(field)),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Check user migration error:', error);
    return res.status(500).json({
      error: 'Check failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
