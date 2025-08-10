// =====================================================
// NODE.JS MIGRATION SCRIPT - MODULE CONFIGURATION
// Führt die Datenbank-Migration über Supabase Client aus
// =====================================================

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function runMigration() {
  console.log('🚀 Starting module configuration migration...');

  // Supabase Client mit Service Role Key (für Admin-Operationen)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  try {
    // 1. Check if column already exists
    console.log('📋 Checking if step_modules column exists...');

    const { data: columns, error: columnError } = await supabase.rpc('get_table_columns', {
      table_name: 'foundation_cases',
    });

    if (columnError) {
      console.log('⚠️  Column check failed, proceeding with migration...');
    }

    // 2. Add step_modules column if it doesn't exist
    console.log('🔧 Adding step_modules column...');

    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ 
        BEGIN
          -- Add step_modules column if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'foundation_cases' 
            AND column_name = 'step_modules'
          ) THEN
            ALTER TABLE foundation_cases 
            ADD COLUMN step_modules JSONB DEFAULT '{
              "step1": {"multiple_choice": true, "content_module": false, "free_text": false, "text_input": false, "decision_matrix": false, "voice_input": false},
              "step2": {"multiple_choice": false, "content_module": true, "free_text": true, "text_input": false, "decision_matrix": false, "voice_input": false},
              "step3": {"multiple_choice": false, "content_module": false, "free_text": false, "text_input": true, "decision_matrix": false, "voice_input": false},
              "step4": {"multiple_choice": false, "content_module": false, "free_text": false, "text_input": true, "decision_matrix": true, "voice_input": false},
              "step5": {"multiple_choice": false, "content_module": false, "free_text": false, "text_input": true, "decision_matrix": false, "voice_input": true}
            }'::jsonb;
            
            RAISE NOTICE 'Column step_modules added successfully';
          ELSE
            RAISE NOTICE 'Column step_modules already exists';
          END IF;
        END $$;
      `,
    });

    if (alterError) {
      console.error('❌ Migration failed:', alterError);
      return;
    }

    // 3. Create index for performance
    console.log('📊 Creating index for step_modules...');

    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_foundation_cases_step_modules 
        ON foundation_cases USING GIN (step_modules);
      `,
    });

    if (indexError) {
      console.log('⚠️  Index creation failed (may already exist):', indexError.message);
    }

    // 4. Verify migration
    console.log('✅ Verifying migration...');

    const { data: testData, error: testError } = await supabase
      .from('foundation_cases')
      .select('id, title, step_modules')
      .limit(1);

    if (testError) {
      console.error('❌ Verification failed:', testError);
      return;
    }

    console.log('🎉 Migration completed successfully!');
    console.log('📋 Sample data:', testData[0]);

    // 5. Update all existing cases with default configuration
    console.log('🔄 Updating existing cases with default configuration...');

    const { error: updateError } = await supabase
      .from('foundation_cases')
      .update({
        step_modules: {
          step1: {
            multiple_choice: true,
            content_module: false,
            free_text: false,
            text_input: false,
            decision_matrix: false,
            voice_input: false,
          },
          step2: {
            multiple_choice: false,
            content_module: true,
            free_text: true,
            text_input: false,
            decision_matrix: false,
            voice_input: false,
          },
          step3: {
            multiple_choice: false,
            content_module: false,
            free_text: false,
            text_input: true,
            decision_matrix: false,
            voice_input: false,
          },
          step4: {
            multiple_choice: false,
            content_module: false,
            free_text: false,
            text_input: true,
            decision_matrix: true,
            voice_input: false,
          },
          step5: {
            multiple_choice: false,
            content_module: false,
            free_text: false,
            text_input: true,
            decision_matrix: false,
            voice_input: true,
          },
        },
      })
      .is('step_modules', null);

    if (updateError) {
      console.log('⚠️  Update existing cases failed:', updateError.message);
    } else {
      console.log('✅ All existing cases updated with default configuration');
    }
  } catch (error) {
    console.error('💥 Migration failed with error:', error);
    process.exit(1);
  }
}

// Alternative: Direct SQL execution if RPC doesn't work
async function runDirectMigration() {
  console.log('🔄 Trying direct SQL approach...');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  try {
    // Simple approach: Try to select with new column
    const { data, error } = await supabase
      .from('foundation_cases')
      .select('id, step_modules')
      .limit(1);

    if (error && error.message.includes('step_modules')) {
      console.log('❌ Column step_modules does not exist. Manual migration required.');
      console.log('📋 Please run the following SQL in your Supabase dashboard:');
      console.log(`
ALTER TABLE foundation_cases 
ADD COLUMN step_modules JSONB DEFAULT '{
  "step1": {"multiple_choice": true, "content_module": false, "free_text": false, "text_input": false, "decision_matrix": false, "voice_input": false},
  "step2": {"multiple_choice": false, "content_module": true, "free_text": true, "text_input": false, "decision_matrix": false, "voice_input": false},
  "step3": {"multiple_choice": false, "content_module": false, "free_text": false, "text_input": true, "decision_matrix": false, "voice_input": false},
  "step4": {"multiple_choice": false, "content_module": false, "free_text": false, "text_input": true, "decision_matrix": true, "voice_input": false},
  "step5": {"multiple_choice": false, "content_module": false, "free_text": false, "text_input": true, "decision_matrix": false, "voice_input": true}
}'::jsonb;

CREATE INDEX idx_foundation_cases_step_modules ON foundation_cases USING GIN (step_modules);
      `);
      return false;
    }

    console.log('✅ Column step_modules already exists or migration successful');
    console.log('📋 Sample data:', data[0]);
    return true;
  } catch (error) {
    console.error('💥 Direct migration check failed:', error);
    return false;
  }
}

// Run migration
if (require.main === module) {
  runDirectMigration()
    .then((success) => {
      if (success) {
        console.log('🎉 Migration verification successful!');
      } else {
        console.log('⚠️  Manual migration required - see instructions above');
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigration, runDirectMigration };
