require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function comprehensiveTableAnalysis() {
  console.log('🔍 Comprehensive Database Analysis...');

  try {
    // First, let's see what tables exist
    console.log('\n📊 Checking available tables...');

    const { data: tables, error: tablesError } = await supabase.rpc('get_table_names');

    if (tablesError) {
      console.log('⚠️  Could not get table names via RPC, trying alternative approach...');

      // Alternative: Try to query information_schema
      const { data: schemaInfo, error: schemaError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

      if (schemaError) {
        console.log('⚠️  Information schema not accessible, trying direct table queries...');
      } else {
        console.log(
          '✅ Found tables via information_schema:',
          schemaInfo?.map((t) => t.table_name),
        );
      }
    } else {
      console.log('✅ Found tables via RPC:', tables);
    }

    // Try different possible table names for case_types
    const possibleTableNames = [
      'case_types',
      'case_type',
      'casetypes',
      'casetype',
      'Case_Types',
      'Case_Type',
    ];

    let caseTypesData = null;
    let foundTableName = null;

    for (const tableName of possibleTableNames) {
      try {
        console.log(`\n🔍 Trying table name: "${tableName}"`);
        const { data, error } = await supabase.from(tableName).select('*').limit(5);

        if (!error && data) {
          console.log(`✅ Found table "${tableName}" with ${data.length} sample records`);
          foundTableName = tableName;

          // Get all data from this table
          const { data: allData, error: allError } = await supabase
            .from(tableName)
            .select('*')
            .order('id');

          if (!allError) {
            caseTypesData = allData;
            console.log(`✅ Retrieved ${allData.length} total records from ${tableName}`);
          }
          break;
        } else {
          console.log(`❌ Table "${tableName}" not found or error:`, error?.message);
        }
      } catch (err) {
        console.log(`❌ Error querying "${tableName}":`, err.message);
      }
    }

    if (!caseTypesData) {
      console.log('\n❌ Could not find case_types table with any common name variations');
      console.log('Please check the exact table name in your database');
      return;
    }

    console.log(`\n📋 CASE_TYPES TABLE ANALYSIS (${foundTableName}):`);
    console.log('='.repeat(80));

    // Show structure
    if (caseTypesData.length > 0) {
      console.log('Table columns:', Object.keys(caseTypesData[0]));
      console.log('');
    }

    // Show all records
    caseTypesData.forEach((record, index) => {
      console.log(`${index + 1}. ID: ${record.id}`);
      Object.keys(record).forEach((key) => {
        if (key !== 'id') {
          console.log(`   ${key}: "${record[key] || 'N/A'}"`);
        }
      });
      console.log('');
    });

    // Now get foundation_cases
    console.log('\n📊 FOUNDATION_CASES TABLE:');
    console.log('='.repeat(80));

    const { data: foundationCases, error: foundationError } = await supabase
      .from('foundation_cases')
      .select('id, title, cluster, tool, difficulty')
      .order('difficulty');

    if (foundationError) {
      console.error('❌ Error fetching foundation_cases:', foundationError);
      return;
    }

    foundationCases.forEach((fc, index) => {
      console.log(`${index + 1}. ID: "${fc.id}" | Title: "${fc.title}" | Tool: "${fc.tool}"`);
    });

    // MATCHING ANALYSIS
    console.log('\n🔍 MATCHING ANALYSIS:');
    console.log('='.repeat(80));

    const matches = [];
    const unmatchedFoundation = [];
    const unmatchedCaseTypes = [...caseTypesData];

    foundationCases.forEach((fc) => {
      // Try to find matches by various criteria
      let bestMatch = null;
      let matchScore = 0;

      caseTypesData.forEach((ct) => {
        let score = 0;

        // Check title/name similarity
        const fcTitle = fc.title.toLowerCase();
        const ctName = (ct.name || '').toLowerCase();

        if (fcTitle.includes(ctName) || ctName.includes(fcTitle)) score += 3;

        // Check tool/framework similarity
        const fcTool = fc.tool.toLowerCase();
        const ctFramework = (ct.framework_hints || '').toLowerCase();

        if (fcTool.includes(ctName) || ctName.includes(fcTool)) score += 2;
        if (ctFramework.includes(fcTool) || fcTool.includes(ctFramework)) score += 1;

        // Check cluster similarity
        const fcCluster = fc.cluster.toLowerCase();
        if (ctName.includes(fcCluster) || fcCluster.includes(ctName)) score += 1;

        if (score > matchScore) {
          matchScore = score;
          bestMatch = ct;
        }
      });

      if (bestMatch && matchScore >= 1) {
        matches.push({
          foundation_case: fc,
          case_type: bestMatch,
          match_score: matchScore,
        });

        // Remove from unmatched case types
        const index = unmatchedCaseTypes.findIndex((ct) => ct.id === bestMatch.id);
        if (index > -1) {
          unmatchedCaseTypes.splice(index, 1);
        }
      } else {
        unmatchedFoundation.push(fc);
      }
    });

    console.log('\n✅ MATCHED CASES:');
    matches.forEach((match, index) => {
      console.log(`${index + 1}. Foundation: "${match.foundation_case.title}"`);
      console.log(`   ↔ Case Type: "${match.case_type.name}" (Score: ${match.match_score})`);
      console.log(`   Framework Hints: "${match.case_type.framework_hints || 'N/A'}"`);
      console.log('');
    });

    console.log('\n⚠️  UNMATCHED FOUNDATION CASES:');
    unmatchedFoundation.forEach((fc, index) => {
      console.log(`${index + 1}. "${fc.title}" (${fc.tool})`);
    });

    console.log('\n⚠️  UNMATCHED CASE TYPES:');
    unmatchedCaseTypes.forEach((ct, index) => {
      console.log(`${index + 1}. "${ct.name}" - ${ct.framework_hints || 'No hints'}`);
    });

    // Generate SQL statements
    console.log('\n📝 SQL UPDATE STATEMENTS:');
    console.log('='.repeat(80));

    console.log("-- Add columns if they don't exist");
    console.log('ALTER TABLE foundation_cases ADD COLUMN IF NOT EXISTS case_type TEXT;');
    console.log('ALTER TABLE foundation_cases ADD COLUMN IF NOT EXISTS framework_hints TEXT;');
    console.log('');

    console.log('-- Update matched cases');
    matches.forEach((match) => {
      const escapedHints = (match.case_type.framework_hints || '').replace(/'/g, "''");
      console.log(
        `UPDATE foundation_cases SET case_type = '${match.case_type.name}', framework_hints = '${escapedHints}' WHERE id = '${match.foundation_case.id}';`,
      );
    });

    console.log('\n-- Suggestions for unmatched foundation cases');
    unmatchedFoundation.forEach((fc) => {
      console.log(
        `-- TODO: UPDATE foundation_cases SET case_type = '???', framework_hints = '???' WHERE id = '${fc.id}'; -- "${fc.title}"`,
      );
    });
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

comprehensiveTableAnalysis();
