import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Dev-only guard: disable in non-development environments
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).end();
  }

  const diagnosis = {
    timestamp: new Date().toISOString(),
    environment: {},
    supabase_config: {},
    auth_test: {},
    database_check: {},
  };

  try {
    // 1. Environment Variables Check
    diagnosis.environment = {
      has_supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      has_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    };

    // 2. Supabase Connection Test
    const { data: connectionTest, error: connectionError } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);

    diagnosis.supabase_config = {
      connection_success: !connectionError,
      connection_error: connectionError?.message || null,
    };

    // 3. Auth Service Test (simple check)
    try {
      // Try to list existing users (this tests service role permissions)
      const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();

      diagnosis.auth_test = {
        service_role_works: !usersError,
        user_count: usersData?.users?.length || 0,
        auth_error: usersError?.message || null,
      };
    } catch (authTestError) {
      diagnosis.auth_test = {
        service_role_works: false,
        auth_error: authTestError.message || 'Unknown auth error',
      };
    }

    // 4. Database Schema Check
    const { data: schemaData, error: schemaError } = await supabase.rpc('exec_sql', {
      sql: `
          SELECT 
            table_name, 
            column_name, 
            data_type 
          FROM information_schema.columns 
          WHERE table_name IN ('user_profiles') 
          ORDER BY table_name, ordinal_position;
        `,
    });

    diagnosis.database_check = {
      schema_query_success: !schemaError,
      schema_error: schemaError?.message || null,
      user_profiles_columns: schemaData || [],
    };

    return res.status(200).json({
      success: true,
      diagnosis,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      diagnosis,
    });
  }
}
