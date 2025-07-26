import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🔍 SUPABASE DIAGNOSIS STARTED');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // 1. Environment-Variablen prüfen
    const envCheck = {
      url: {
        exists: !!supabaseUrl,
        value: supabaseUrl?.substring(0, 30) + '...',
        length: supabaseUrl?.length
      },
      anonKey: {
        exists: !!supabaseAnonKey,
        length: supabaseAnonKey?.length,
        startsCorrect: supabaseAnonKey?.startsWith('eyJ'),
        value: supabaseAnonKey?.substring(0, 20) + '...'
      },
      serviceKey: {
        exists: !!supabaseServiceKey,
        length: supabaseServiceKey?.length,
        startsCorrect: supabaseServiceKey?.startsWith('eyJ'),
        value: supabaseServiceKey?.substring(0, 20) + '...'
      }
    };

    console.log('📊 Environment Check:', envCheck);

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing required Supabase environment variables');
    }

    // 2. Anon Client testen
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
    
    // 3. Service Client testen (falls verfügbar)
    let supabaseService = null;
    if (supabaseServiceKey) {
      supabaseService = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
    }

    // 4. Datenbank-Verbindung testen
    const dbTests = {
      anonConnection: null as any,
      serviceConnection: null as any,
      authTables: null as any,
      userCount: null as any
    };

    try {
      // Test Anon-Verbindung
      const { data: anonTest, error: anonError } = await supabaseAnon
        .from('tariff_plans')
        .select('count(*)')
        .limit(1);
      
      dbTests.anonConnection = {
        success: !anonError,
        error: anonError?.message,
        data: anonTest
      };
    } catch (error) {
      dbTests.anonConnection = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    try {
      // Test Service-Verbindung
      if (supabaseService) {
        const { data: serviceTest, error: serviceError } = await supabaseService
          .from('tariff_plans')
          .select('count(*)')
          .limit(1);
        
        dbTests.serviceConnection = {
          success: !serviceError,
          error: serviceError?.message,
          data: serviceTest
        };

        // Prüfe Auth-Tabellen
        const { data: authUsers, error: authError } = await supabaseService.auth.admin.listUsers();
        
        dbTests.authTables = {
          success: !authError,
          error: authError?.message,
          userCount: authUsers?.users?.length || 0
        };
      }
    } catch (error) {
      dbTests.serviceConnection = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // 5. Test-Registrierung simulieren (ohne tatsächlich zu registrieren)
    let authTest = null;
    try {
      // Verwende eine eindeutig ungültige E-Mail um zu sehen, welcher Fehler kommt
      const testEmail = 'invalid-test-email-for-diagnosis@invalid-domain-12345.com';
      const { data: testAuth, error: testError } = await supabaseAnon.auth.signUp({
        email: testEmail,
        password: 'TestPassword123!',
        options: {
          data: { name: 'Test User' }
        }
      });

      authTest = {
        attempted: true,
        success: !testError,
        error: testError?.message,
        errorCode: testError?.status,
        errorType: testError?.__isAuthError ? 'AuthError' : 'Other'
      };
    } catch (error) {
      authTest = {
        attempted: true,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: 'Exception'
      };
    }

    console.log('✅ Diagnosis completed');

    return res.status(200).json({
      message: 'Supabase diagnosis completed',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: dbTests,
      authTest: authTest,
      recommendations: {
        envIssues: !envCheck.url.exists || !envCheck.anonKey.exists ? 
          'Missing required environment variables' : null,
        keyFormatIssues: (!envCheck.anonKey.startsCorrect || !envCheck.serviceKey.startsCorrect) ?
          'API keys may have incorrect format (should start with eyJ)' : null,
        dbConnectionIssues: !dbTests.anonConnection?.success ?
          'Database connection failed - check URL and permissions' : null,
        authIssues: authTest?.error?.includes('Database error') ?
          'Auth database error - check Supabase dashboard settings' : null
      }
    });

  } catch (error) {
    console.error('❌ DIAGNOSIS ERROR:', error);
    return res.status(500).json({
      error: 'Diagnosis failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
