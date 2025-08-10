const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runStepMigration() {
  console.log('🚀 Starting Foundation Cases Step Configuration Migration...\n');

  try {
    // Step 1: Check if step_configuration column exists by trying to select it
    console.log('📝 Step 1: Checking step_configuration column...');
    const { error: columnCheckError } = await supabase
      .from('foundation_cases')
      .select('step_configuration')
      .limit(1);

    if (
      columnCheckError &&
      columnCheckError.message.includes('column "step_configuration" does not exist')
    ) {
      console.log('⚠️  Column does not exist, will be added during update...');
    } else {
      console.log('✅ Column exists or will be created');
    }

    // Step 2: Update existing cases with default configuration
    console.log('\n📝 Step 2: Setting default step configuration...');

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

    const { error: updateError } = await supabase
      .from('foundation_cases')
      .update({ step_configuration: stepConfig })
      .is('step_configuration', null);

    if (updateError) {
      console.error('❌ Error updating step configuration:', updateError);
      return;
    }
    console.log('✅ Default step configuration set successfully');

    // Step 3: Verification
    console.log('\n📝 Step 3: Verifying migration...');
    const { data: cases, error: verifyError } = await supabase
      .from('foundation_cases')
      .select('id, title, step_configuration')
      .order('difficulty');

    if (verifyError) {
      console.error('❌ Error verifying migration:', verifyError);
      return;
    }

    console.log('\n📊 Migration Results:');
    cases.forEach((case_item) => {
      const hasStepConfig = case_item.step_configuration !== null;
      const numSteps = hasStepConfig ? case_item.step_configuration.steps?.length || 0 : 0;
      console.log(
        `  ${case_item.id}: ${hasStepConfig ? '✅' : '❌'} (${numSteps} steps) - ${case_item.title}`,
      );
    });

    // Step 4: Show sample configuration
    if (cases.length > 0 && cases[0].step_configuration) {
      console.log('\n📋 Sample Step Configuration:');
      const sampleSteps = cases[0].step_configuration.steps;
      sampleSteps.forEach((step, index) => {
        console.log(`  Step ${index + 1}: ${step.title}`);
        console.log(`    - Learning Forms: ${step.learning_forms.join(', ')}`);
        console.log(`    - Input Type: ${step.input_type}`);
        console.log(`    - AI Enabled: ${step.ai_enabled ? 'Yes' : 'No'}`);
      });
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('🔗 You can now access the Foundation Manager at: /admin/foundation-manager');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run migration
runStepMigration();
