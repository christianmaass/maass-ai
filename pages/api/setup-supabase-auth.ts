import { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient } from '@supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabaseClient();
    
    console.log('🔧 Setting up Supabase Auth tables...');
    
    // 1. Create users table if it doesn't exist
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    const { data: createResult, error: createError } = await supabase
      .rpc('exec_sql', { sql: createUsersTable });
    
    console.log('📊 Create users table:', { createResult, createError });
    
    // 2. Enable RLS on users table
    const enableRLS = `
      ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    `;
    
    const { data: rlsResult, error: rlsError } = await supabase
      .rpc('exec_sql', { sql: enableRLS });
    
    console.log('🛡️ Enable RLS:', { rlsResult, rlsError });
    
    // 3. Create RLS policies
    const createPolicies = `
      -- Policy: Users can read their own data
      CREATE POLICY IF NOT EXISTS "Users can read own data" 
      ON public.users FOR SELECT 
      USING (auth.uid() = id);
      
      -- Policy: Users can update their own data
      CREATE POLICY IF NOT EXISTS "Users can update own data" 
      ON public.users FOR UPDATE 
      USING (auth.uid() = id);
      
      -- Policy: Enable insert for authenticated users
      CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users" 
      ON public.users FOR INSERT 
      WITH CHECK (auth.uid() = id);
    `;
    
    const { data: policiesResult, error: policiesError } = await supabase
      .rpc('exec_sql', { sql: createPolicies });
    
    console.log('🔐 Create policies:', { policiesResult, policiesError });
    
    // 4. Create trigger for automatic user creation
    const createTrigger = `
      -- Function to handle new user creation
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO public.users (id, email, name)
        VALUES (
          NEW.id,
          NEW.email,
          COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
        );
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
      
      -- Trigger to automatically create user profile
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    `;
    
    const { data: triggerResult, error: triggerError } = await supabase
      .rpc('exec_sql', { sql: createTrigger });
    
    console.log('⚡ Create trigger:', { triggerResult, triggerError });
    
    // 5. Test the setup
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    console.log('✅ Test setup:', { testData, testError });
    
    return res.status(200).json({
      success: true,
      message: 'Supabase Auth setup completed',
      results: {
        createTable: { createResult, createError },
        enableRLS: { rlsResult, rlsError },
        createPolicies: { policiesResult, policiesError },
        createTrigger: { triggerResult, triggerError },
        test: { testData, testError }
      }
    });
    
  } catch (error) {
    console.error('❌ SUPABASE SETUP ERROR:', error);
    return res.status(500).json({
      error: 'Setup failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}
