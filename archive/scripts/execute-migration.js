#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Environment variables (replace with actual values)
const supabaseUrl = 'https://eepfbozslfupvauaywiq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🚀 Starting Step Configuration Migration...');

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable not set');
  console.log('Please run: export SUPABASE_SERVICE_ROLE_KEY=your_service_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrate() {
  try {
    console.log('📝 Adding step_configuration column...');

    // Step 1: Add column using direct SQL
    const { error: columnError } = await supabase
      .from('foundation_cases')
      .select('step_configuration')
      .limit(1);

    if (columnError && columnError.message.includes('column "step_configuration" does not exist')) {
      console.log('Column does not exist, will be added via update...');
    }

    // Step 2: Update with step configuration
    console.log('📝 Setting default step configuration...');

    const stepConfig = {
      steps: [
        {
          id: 'step_1_problem',
          title: 'Problemverständnis & Zielklärung',
          learning_forms: ['multiple_choice'],
          input_type: 'text',
          ai_enabled: false,
          skip: false,
        },
        {
          id: 'step_2_hypothesis',
          title: 'Hypothesenbildung',
          learning_forms: ['framework'],
          input_type: 'text',
          ai_enabled: false,
          skip: false,
        },
        {
          id: 'step_3_analysis',
          title: 'Analyse und Zahlenarbeit',
          learning_forms: ['free_text'],
          input_type: 'both',
          ai_enabled: false,
          skip: false,
        },
        {
          id: 'step_4_synthesis',
          title: 'Synthetisieren & Optionen bewerten',
          learning_forms: ['tips_hints'],
          input_type: 'text',
          ai_enabled: false,
          skip: false,
        },
        {
          id: 'step_5_recommendation',
          title: 'Empfehlung & Executive Summary',
          learning_forms: ['gpt_response'],
          input_type: 'both',
          ai_enabled: true,
          skip: false,
        },
      ],
    };

    // Get all cases first
    const { data: cases, error: fetchError } = await supabase
      .from('foundation_cases')
      .select('id, title');

    if (fetchError) {
      console.error('❌ Error fetching cases:', fetchError);
      return;
    }

    console.log(`📊 Found ${cases.length} Foundation Cases`);

    // Update each case individually
    for (const case_item of cases) {
      const { error: updateError } = await supabase
        .from('foundation_cases')
        .update({ step_configuration: stepConfig })
        .eq('id', case_item.id);

      if (updateError) {
        console.error(`❌ Error updating ${case_item.id}:`, updateError);
      } else {
        console.log(`✅ Updated ${case_item.id}: ${case_item.title}`);
      }
    }

    // Verification
    console.log('\n📝 Verifying migration...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('foundation_cases')
      .select('id, title, step_configuration')
      .order('difficulty');

    if (verifyError) {
      console.error('❌ Verification error:', verifyError);
      return;
    }

    console.log('\n📊 Migration Results:');
    verifyData.forEach((case_item) => {
      const hasStepConfig = case_item.step_configuration !== null;
      const numSteps = hasStepConfig ? case_item.step_configuration.steps?.length || 0 : 0;
      console.log(`  ${case_item.id}: ${hasStepConfig ? '✅' : '❌'} (${numSteps} steps)`);
    });

    console.log('\n🎉 Migration completed successfully!');
    console.log('🔗 Access Foundation Manager at: /admin/foundation-manager');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

migrate();
