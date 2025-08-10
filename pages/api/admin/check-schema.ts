/**
 * SCHEMA CHECKER
 * Prüft ob User-Tracking-Felder in der Datenbank vorhanden sind
 *
 * @version 1.0.0
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface SchemaCheckResult {
  table: string;
  column: string;
  exists: boolean;
  dataType?: string;
  isNullable?: boolean;
  defaultValue?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔍 Checking database schema for user-tracking fields...');

    // Felder die wir prüfen wollen
    const requiredFields = [
      'login_count',
      'first_login_at',
      'last_login_at',
      'last_activity_track',
      'last_activity_at',
      'onboarding_completed',
    ];

    const results: SchemaCheckResult[] = [];

    // Prüfe jedes Feld in user_profiles Tabelle
    for (const field of requiredFields) {
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: `
          SELECT 
            column_name,
            data_type,
            is_nullable,
            column_default
          FROM information_schema.columns 
          WHERE table_name = 'user_profiles' 
          AND column_name = '${field}';
        `,
      });

      if (error) {
        console.error(`Error checking field ${field}:`, error);
        results.push({
          table: 'user_profiles',
          column: field,
          exists: false,
        });
      } else {
        const fieldExists = data && data.length > 0;
        results.push({
          table: 'user_profiles',
          column: field,
          exists: fieldExists,
          dataType: fieldExists ? data[0].data_type : undefined,
          isNullable: fieldExists ? data[0].is_nullable === 'YES' : undefined,
          defaultValue: fieldExists ? data[0].column_default : undefined,
        });
      }
    }

    // Prüfe auch ob user_profiles Tabelle existiert
    const { data: tableData, error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_name = 'user_profiles';
      `,
    });

    const tableExists = !tableError && tableData && tableData.length > 0;

    // Sample user data abrufen (falls Tabelle existiert)
    let sampleUserData = null;
    if (tableExists) {
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('id, login_count, onboarding_completed, first_login_at, last_login_at, created_at')
        .limit(1);

      if (!userError && userData && userData.length > 0) {
        sampleUserData = userData[0];
      }
    }

    // Zusammenfassung erstellen
    const missingFields = results.filter((r) => !r.exists);
    const existingFields = results.filter((r) => r.exists);

    const summary = {
      tableExists,
      totalFields: requiredFields.length,
      existingFields: existingFields.length,
      missingFields: missingFields.length,
      migrationRequired: missingFields.length > 0,
      allFieldsPresent: missingFields.length === 0,
    };

    console.log('✅ Schema check completed');
    console.log('Summary:', summary);
    console.log(
      'Missing fields:',
      missingFields.map((f) => f.column),
    );

    return res.status(200).json({
      success: true,
      summary,
      tableExists,
      results,
      missingFields: missingFields.map((f) => f.column),
      existingFields: existingFields.map((f) => ({
        column: f.column,
        dataType: f.dataType,
        isNullable: f.isNullable,
        defaultValue: f.defaultValue,
      })),
      sampleUserData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Schema check error:', error);
    return res.status(500).json({
      error: 'Schema check failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
