require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function analyzeCaseTypeTable() {
  console.log('🔍 Analyzing case_type table and foundation_cases...');

  try {
    // Fetch case_type table
    console.log('\n📊 Fetching case_type table...');
    const { data: caseTypes, error: caseTypeError } = await supabase
      .from('case_type')
      .select('*')
      .order('id');

    if (caseTypeError) {
      console.error('❌ Error fetching case_type:', caseTypeError);
      return;
    }

    console.log(`✅ Found ${caseTypes?.length || 0} case types:`);
    caseTypes?.forEach((caseType, index) => {
      console.log(
        `${index + 1}. ID: ${caseType.id} | Name: "${caseType.name}" | Framework Hints: "${caseType.framework_hints || 'N/A'}"`,
      );
    });

    // Fetch foundation_cases table
    console.log('\n📊 Fetching foundation_cases table...');
    const { data: foundationCases, error: foundationError } = await supabase
      .from('foundation_cases')
      .select('id, title, cluster, tool')
      .order('id');

    if (foundationError) {
      console.error('❌ Error fetching foundation_cases:', foundationError);
      return;
    }

    console.log(`✅ Found ${foundationCases?.length || 0} foundation cases:`);
    foundationCases?.forEach((foundationCase, index) => {
      console.log(
        `${index + 1}. ID: "${foundationCase.id}" | Title: "${foundationCase.title}" | Tool: "${foundationCase.tool}"`,
      );
    });

    // Analysis and matching
    console.log('\n🔍 ANALYSIS & MATCHING:');
    console.log('='.repeat(50));

    if (caseTypes && foundationCases) {
      // Try to match by title/name similarity
      const matches = [];
      const unmatched = [];

      foundationCases.forEach((fc) => {
        const match = caseTypes.find(
          (ct) =>
            fc.title.toLowerCase().includes(ct.name.toLowerCase()) ||
            ct.name.toLowerCase().includes(fc.title.toLowerCase()) ||
            fc.tool.toLowerCase().includes(ct.name.toLowerCase()) ||
            ct.name.toLowerCase().includes(fc.tool.toLowerCase()),
        );

        if (match) {
          matches.push({
            foundation_case: fc,
            case_type: match,
          });
        } else {
          unmatched.push(fc);
        }
      });

      console.log('\n✅ MATCHED CASES:');
      matches.forEach((match, index) => {
        console.log(
          `${index + 1}. Foundation: "${match.foundation_case.title}" ↔ Case Type: "${match.case_type.name}"`,
        );
        console.log(`   Framework Hints: "${match.case_type.framework_hints || 'N/A'}"`);
      });

      console.log('\n⚠️  UNMATCHED FOUNDATION CASES:');
      unmatched.forEach((fc, index) => {
        console.log(`${index + 1}. ID: "${fc.id}" | Title: "${fc.title}" | Tool: "${fc.tool}"`);
      });

      console.log('\n📋 SUGGESTIONS FOR UNMATCHED CASES:');
      unmatched.forEach((fc, index) => {
        let suggestedCaseType = '';
        let suggestedFrameworkHints = '';

        // Generate suggestions based on tool/title
        if (fc.tool.includes('Profit Tree')) {
          suggestedCaseType = 'Profitability Analysis';
          suggestedFrameworkHints =
            'Strukturiere den Gewinn in Umsatz und Kosten. Analysiere jeden Bereich systematisch und identifiziere Hebel zur Gewinnsteigerung.';
        } else if (fc.tool.includes('Market Entry')) {
          suggestedCaseType = 'Market Entry Strategy';
          suggestedFrameworkHints =
            'Bewerte Marktattraktivität, Wettbewerbsposition und Eintrittsbarrieren. Entwickle eine strukturierte Go-to-Market Strategie.';
        } else if (fc.tool.includes('MECE')) {
          suggestedCaseType = 'Structured Problem Solving';
          suggestedFrameworkHints =
            'Verwende das MECE-Prinzip (Mutually Exclusive, Collectively Exhaustive) für strukturierte Problemanalyse.';
        } else if (fc.tool.includes('Porter')) {
          suggestedCaseType = 'Competitive Analysis';
          suggestedFrameworkHints =
            'Analysiere die fünf Wettbewerbskräfte: Rivalität, Lieferantenmacht, Kundenmacht, Substitute und Markteintrittsbarrieren.';
        } else {
          suggestedCaseType = fc.tool.replace(/[^a-zA-Z\s]/g, '').trim();
          suggestedFrameworkHints = `Verwende ${fc.tool} als strukturiertes Framework für die Analyse. Gehe systematisch vor und dokumentiere deine Erkenntnisse.`;
        }

        console.log(`${index + 1}. "${fc.title}"`);
        console.log(`   Suggested case_type: "${suggestedCaseType}"`);
        console.log(`   Suggested framework_hints: "${suggestedFrameworkHints}"`);
        console.log('');
      });

      // Generate SQL for updating foundation_cases
      console.log('\n📝 SQL UPDATE STATEMENTS:');
      console.log('='.repeat(50));

      matches.forEach((match) => {
        console.log(
          `UPDATE foundation_cases SET case_type = '${match.case_type.name}', framework_hints = '${match.case_type.framework_hints || ''}' WHERE id = '${match.foundation_case.id}';`,
        );
      });

      unmatched.forEach((fc) => {
        let suggestedCaseType = '';
        let suggestedFrameworkHints = '';

        if (fc.tool.includes('Profit Tree')) {
          suggestedCaseType = 'Profitability Analysis';
          suggestedFrameworkHints =
            'Strukturiere den Gewinn in Umsatz und Kosten. Analysiere jeden Bereich systematisch und identifiziere Hebel zur Gewinnsteigerung.';
        } else if (fc.tool.includes('Market Entry')) {
          suggestedCaseType = 'Market Entry Strategy';
          suggestedFrameworkHints =
            'Bewerte Marktattraktivität, Wettbewerbsposition und Eintrittsbarrieren. Entwickle eine strukturierte Go-to-Market Strategie.';
        } else {
          suggestedCaseType = fc.tool.replace(/[^a-zA-Z\s]/g, '').trim();
          suggestedFrameworkHints = `Verwende ${fc.tool} als strukturiertes Framework für die Analyse. Gehe systematisch vor und dokumentiere deine Erkenntnisse.`;
        }

        console.log(
          `UPDATE foundation_cases SET case_type = '${suggestedCaseType}', framework_hints = '${suggestedFrameworkHints}' WHERE id = '${fc.id}';`,
        );
      });
    }
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

analyzeCaseTypeTable();
