const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateStepTitles() {
  console.log('🚀 Updating Foundation Cases Step Titles to German...\n');

  try {
    // Correct German step configuration
    const correctedStepConfig = {
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

    // Get all foundation cases
    const { data: cases, error: fetchError } = await supabase
      .from('foundation_cases')
      .select('id, title');

    if (fetchError) {
      console.error('❌ Error fetching cases:', fetchError);
      return;
    }

    console.log(`📊 Found ${cases.length} Foundation Cases to update`);

    // Update each case with correct German titles
    for (const case_item of cases) {
      const { error: updateError } = await supabase
        .from('foundation_cases')
        .update({ step_configuration: correctedStepConfig })
        .eq('id', case_item.id);

      if (updateError) {
        console.error(`❌ Error updating ${case_item.id}:`, updateError);
      } else {
        console.log(`✅ Updated ${case_item.id}: ${case_item.title}`);
      }
    }

    // Verification
    console.log('\n📝 Verifying updated titles...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('foundation_cases')
      .select('id, title, step_configuration')
      .limit(1);

    if (verifyError) {
      console.error('❌ Verification error:', verifyError);
      return;
    }

    if (verifyData.length > 0 && verifyData[0].step_configuration) {
      console.log('\n📋 Updated Step Titles:');
      const steps = verifyData[0].step_configuration.steps;
      steps.forEach((step, index) => {
        console.log(`  Step ${index + 1}: ${step.title}`);
      });
    }

    console.log('\n🎉 Step titles updated successfully!');
    console.log('🔄 Please refresh the Foundation Manager to see the changes.');
  } catch (error) {
    console.error('❌ Update failed:', error);
  }
}

updateStepTitles();
