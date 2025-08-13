require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function executeCaseTypeMigration() {
  console.log('🚀 Executing case_type and framework_hints migration...');

  try {
    // Step 1: Add columns
    console.log('\n📝 Step 1: Adding columns to foundation_cases table...');

    const { error: alterError1 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE foundation_cases ADD COLUMN IF NOT EXISTS case_type TEXT;',
    });

    if (alterError1) {
      console.log('⚠️  Could not use RPC, trying direct column addition...');
      // Alternative approach - try to update a record to see if column exists
      const { error: testError } = await supabase
        .from('foundation_cases')
        .update({ case_type: 'test' })
        .eq('id', 'non-existent-id');

      if (
        testError &&
        testError.message.includes(
          'column "case_type" of relation "foundation_cases" does not exist',
        )
      ) {
        console.log('❌ case_type column does not exist and cannot be added via API');
        console.log('Please add the columns manually in Supabase SQL Editor:');
        console.log('ALTER TABLE foundation_cases ADD COLUMN IF NOT EXISTS case_type TEXT;');
        console.log('ALTER TABLE foundation_cases ADD COLUMN IF NOT EXISTS framework_hints TEXT;');
        return;
      }
    }

    const { error: _alterError2 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE foundation_cases ADD COLUMN IF NOT EXISTS framework_hints TEXT;',
    });

    console.log('✅ Columns added (or already exist)');

    // Step 2: Update records with automatic matches
    console.log('\n📝 Step 2: Updating foundation cases with case_type and framework_hints...');

    const updates = [
      // Automatic matches
      {
        id: 'foundation-case-1',
        case_type: 'Profitability',
        framework_hints: 'Cost Structure Analysis, Revenue Optimization, Profit Tree',
      },
      {
        id: 'foundation-case-2',
        case_type: 'Growth Strategy',
        framework_hints: 'Ansoff Matrix, Blue Ocean Strategy, Platform Strategy',
      },
      {
        id: 'foundation-case-3',
        case_type: 'Market Entry',
        framework_hints: 'Porter 5 Forces, Market Sizing, Go-to-Market Strategy',
      },
      {
        id: 'foundation-case-4',
        case_type: 'Operations',
        framework_hints: 'Process Optimization, Lean Management, Supply Chain',
      },
      {
        id: 'foundation-case-8',
        case_type: 'M&A',
        framework_hints: 'Synergy Analysis, Due Diligence, Integration Planning',
      },
      {
        id: 'foundation-case-9',
        case_type: 'Digital Transformation',
        framework_hints: 'Digital Maturity Assessment, Technology Roadmap, Change',
      },
      {
        id: 'foundation-case-10',
        case_type: 'Pricing Strategy',
        framework_hints: 'Price Elasticity, Value-Based Pricing, Competitive Pricing',
      },
      {
        id: 'foundation-case-12',
        case_type: 'Restructuring',
        framework_hints: 'Financial Restructuring, Operational Turnaround, Stakeholder',
      },
      // Manual assignments
      {
        id: 'foundation-case-5',
        case_type: 'Market Entry',
        framework_hints:
          'Porter 5 Forces, Competitive Landscape Analysis, Market Attractiveness Assessment',
      },
      {
        id: 'foundation-case-6',
        case_type: 'Market Entry',
        framework_hints: 'Go-to-Market Strategy, Product Launch Framework, Market Penetration',
      },
      {
        id: 'foundation-case-7',
        case_type: 'Operations',
        framework_hints: 'Process Optimization, Operational Excellence, Efficiency Improvement',
      },
      {
        id: 'foundation-case-11',
        case_type: 'Growth Strategy',
        framework_hints:
          'Scaling Framework, Business Model Scalability, Growth Strategy Implementation',
      },
    ];

    let successCount = 0;
    let errorCount = 0;

    for (const update of updates) {
      try {
        const { error } = await supabase
          .from('foundation_cases')
          .update({
            case_type: update.case_type,
            framework_hints: update.framework_hints,
          })
          .eq('id', update.id);

        if (error) {
          console.error(`❌ Error updating ${update.id}:`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Updated ${update.id} → ${update.case_type}`);
          successCount++;
        }
      } catch (err) {
        console.error(`💥 Unexpected error updating ${update.id}:`, err.message);
        errorCount++;
      }
    }

    console.log(`\n📊 Migration Results:`);
    console.log(`✅ Successful updates: ${successCount}`);
    console.log(`❌ Failed updates: ${errorCount}`);
    console.log(`📋 Total cases processed: ${updates.length}`);

    // Step 3: Verify the results
    console.log('\n🔍 Step 3: Verifying migration results...');

    const { data: verificationData, error: verifyError } = await supabase
      .from('foundation_cases')
      .select('id, title, case_type, framework_hints')
      .order('difficulty');

    if (verifyError) {
      console.error('❌ Error verifying results:', verifyError);
      return;
    }

    console.log('\n📋 VERIFICATION - All Foundation Cases:');
    console.log('='.repeat(80));

    verificationData?.forEach((case_, index) => {
      console.log(`${index + 1}. "${case_.title}"`);
      console.log(`   ID: ${case_.id}`);
      console.log(`   Case Type: ${case_.case_type || 'NOT SET'}`);
      console.log(
        `   Framework Hints: ${case_.framework_hints ? case_.framework_hints.substring(0, 60) + '...' : 'NOT SET'}`,
      );
      console.log('');
    });

    // Summary
    const withCaseType = verificationData?.filter((c) => c.case_type) || [];
    const withFrameworkHints = verificationData?.filter((c) => c.framework_hints) || [];

    console.log('📊 FINAL SUMMARY:');
    console.log(`Total Foundation Cases: ${verificationData?.length || 0}`);
    console.log(`Cases with case_type: ${withCaseType.length}`);
    console.log(`Cases with framework_hints: ${withFrameworkHints.length}`);
    console.log(
      `Migration Coverage: ${Math.round((withCaseType.length / (verificationData?.length || 1)) * 100)}%`,
    );

    if (withCaseType.length === verificationData?.length) {
      console.log(
        '\n🎉 MIGRATION SUCCESSFUL! All Foundation Cases now have case_type and framework_hints.',
      );
    } else {
      console.log('\n⚠️  Migration partially successful. Some cases may need manual updates.');
    }
  } catch (error) {
    console.error('💥 Migration failed:', error);
  }
}

executeCaseTypeMigration();
