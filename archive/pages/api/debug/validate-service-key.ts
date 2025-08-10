import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('🔍 Validating Service Role Key...');
    // Dev-only guard: disable in non-development environments
    if (process.env.NODE_ENV !== 'development') {
      return res.status(404).end();
    }

    // Test 1: Environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return res.status(500).json({
        success: false,
        error: 'Missing environment variables',
        details: {
          has_url: !!supabaseUrl,
          has_service_key: !!serviceKey,
        },
      });
    }

    // Test 2: Create client with service key
    const supabase = createClient(supabaseUrl, serviceKey);

    // Test 3: Test service role permissions (list users)
    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      return res.status(500).json({
        success: false,
        error: 'Service Role Key invalid or expired',
        details: {
          message: usersError.message,
          status: usersError.status,
          name: usersError.name,
          full_error: usersError,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Service Role Key is valid',
      details: {
        user_count: usersData.users.length,
        url_present: !!supabaseUrl,
        service_key_present: !!serviceKey,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Validation failed',
      details: error.message,
    });
  }
}
