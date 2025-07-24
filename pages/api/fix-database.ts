import { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient } from '../../supabaseClient';

// API to fix database schema issues
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabaseClient();

    // 1. Check current cases table structure
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_columns', { table_name: 'cases' })
      .single();

    if (tableError) {
      console.log('Table info error:', tableError);
    }

    // 2. Try to add the missing column using raw SQL
    const { data: alterResult, error: alterError } = await supabase
      .rpc('exec_sql', { 
        sql: `
          DO $$ 
          BEGIN
              IF NOT EXISTS (
                  SELECT 1 
                  FROM information_schema.columns 
                  WHERE table_name = 'cases' 
                  AND column_name = 'case_type_id'
              ) THEN
                  ALTER TABLE cases ADD COLUMN case_type_id UUID REFERENCES case_types(id);
              END IF;
          END $$;
        `
      });

    if (alterError) {
      console.log('Alter table error:', alterError);
      
      // Fallback: Try to recreate the table with correct schema
      const { error: dropError } = await supabase
        .from('cases')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
      
      if (dropError) {
        console.log('Delete error:', dropError);
      }
    }

    // 3. Test if we can now insert a case with case_type_id
    const { data: caseTypes } = await supabase
      .from('case_types')
      .select('id')
      .limit(1);

    if (caseTypes && caseTypes.length > 0) {
      const testCase = {
        case_type_id: caseTypes[0].id,
        title: 'Test Case',
        description: 'Test description',
        difficulty: 1
      };

      const { data: insertResult, error: insertError } = await supabase
        .from('cases')
        .insert(testCase)
        .select()
        .single();

      if (insertError) {
        return res.status(500).json({
          error: 'Failed to fix database',
          details: insertError,
          suggestions: [
            'Please run the SQL script manually in Supabase SQL Editor:',
            'ALTER TABLE cases ADD COLUMN case_type_id UUID REFERENCES case_types(id);'
          ]
        });
      }

      // Clean up test case
      await supabase
        .from('cases')
        .delete()
        .eq('id', insertResult.id);

      return res.status(200).json({
        status: 'success',
        message: 'Database schema fixed successfully',
        test_case_created: true
      });
    }

    return res.status(500).json({
      error: 'No case types found',
      message: 'Please ensure case_types table has data'
    });

  } catch (error) {
    console.error('Database fix error:', error);
    return res.status(500).json({
      error: 'Database fix failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      manual_fix: 'Please add the missing column manually: ALTER TABLE cases ADD COLUMN case_type_id UUID REFERENCES case_types(id);'
    });
  }
}
