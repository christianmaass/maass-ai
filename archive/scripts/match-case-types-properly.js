require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// Based on the visible table data from the screenshot
const CASE_TYPES_DATA = [
  {
    id: '026f75f4-91d3-4980-9f35-18391636b8fd',
    name: 'Digital Transformation',
    description: 'Digitalisierungsstrategie',
    framework_hints: 'Digital Maturity Assessment, Technology Roadmap, Change',
  },
  {
    id: '1009eba4-5e77-4f08-b50e-8b8fa65f3b25',
    name: 'Sustainability',
    description: 'Nachhaltigkeitsstrategie',
    framework_hints: 'ESG Framework, Circular Economy, Impact Measurement',
  },
  {
    id: '1818ef6e-6b9a-4bc5-8a4a-f6dc4cae1976',
    name: 'Innovation',
    description: 'Innovationsmanagement und R&D',
    framework_hints: 'Innovation Funnel, Design Thinking, Technology Scouting',
  },
  {
    id: '456d9b4f-6a31-4e6f-8b0c-1d3b5f681374',
    name: 'Restructuring',
    description: 'Restrukturierung und Turnaround',
    framework_hints: 'Financial Restructuring, Operational Turnaround, Stakeholder',
  },
  {
    id: '5856d686-e40e-4ada-a7a9-09c85dd4f3dc',
    name: 'Pricing Strategy',
    description: 'Preisstrategie und -optimierung',
    framework_hints: 'Price Elasticity, Value-Based Pricing, Competitive Pricing',
  },
  {
    id: '62a79aa5-74c7-4811-8fc6-05f50a357786',
    name: 'M&A',
    description: 'Merger & Acquisition Bewertung',
    framework_hints: 'Synergy Analysis, Due Diligence, Integration Planning',
  },
  {
    id: '781e6d2f-ea37-4817-9016-d500bae5976a',
    name: 'Market Entry',
    description: 'Markteintrittstrategie für neue Märkte',
    framework_hints: 'Porter 5 Forces, Market Sizing, Go-to-Market Strategy',
  },
  {
    id: '89b0eaff-53e4-4bcf-a6bf-99ad48aac1b0',
    name: 'Profitability',
    description: 'Gewinnsteigerung und Kostenoptimierung',
    framework_hints: 'Cost Structure Analysis, Revenue Optimization, Profit Tree',
  },
  {
    id: '8cc022a9f-6f50-4fed-b0f6-f72dd7d4fd09',
    name: 'Operations',
    description: 'Operative Effizienzsteigerung',
    framework_hints: 'Process Optimization, Lean Management, Supply Chain',
  },
  {
    id: 'b088ba6f-524e-415a-b4ed-3b1e4c3da1da',
    name: 'Growth Strategy',
    description: 'Wachstumsstrategien für etablierte Unternehmen',
    framework_hints: 'Ansoff Matrix, Blue Ocean Strategy, Platform Strategy',
  },
];

async function matchCaseTypesProperly() {
  console.log('🔍 Matching Foundation Cases with Case Types Table...');

  try {
    // Get foundation_cases
    const { data: foundationCases, error: foundationError } = await supabase
      .from('foundation_cases')
      .select('id, title, cluster, tool, difficulty')
      .order('difficulty');

    if (foundationError) {
      console.error('❌ Error fetching foundation_cases:', foundationError);
      return;
    }

    console.log(`\n📊 FOUNDATION CASES (${foundationCases.length} total):`);
    foundationCases.forEach((fc, index) => {
      console.log(`${index + 1}. "${fc.title}" | Tool: "${fc.tool}" | Cluster: "${fc.cluster}"`);
    });

    console.log(`\n📋 CASE TYPES (${CASE_TYPES_DATA.length} total):`);
    CASE_TYPES_DATA.forEach((ct, index) => {
      console.log(`${index + 1}. "${ct.name}" | Description: "${ct.description}"`);
      console.log(`   Framework Hints: "${ct.framework_hints}"`);
      console.log('');
    });

    // INTELLIGENT MATCHING
    console.log('\n🎯 INTELLIGENT MATCHING ANALYSIS:');
    console.log('='.repeat(80));

    const matches = [];
    const unmatchedFoundation = [];
    const usedCaseTypes = new Set();

    foundationCases.forEach((fc) => {
      let bestMatch = null;
      let matchScore = 0;
      let matchReason = '';

      CASE_TYPES_DATA.forEach((ct) => {
        let score = 0;
        let reasons = [];

        const fcTitle = fc.title.toLowerCase();
        const fcTool = fc.tool.toLowerCase();
        const fcCluster = fc.cluster.toLowerCase();
        const ctName = ct.name.toLowerCase();
        const ctDesc = ct.description.toLowerCase();
        const ctHints = ct.framework_hints.toLowerCase();

        // Direct tool/framework matches (highest priority)
        if (fcTool.includes('profit') && ctName.includes('profitability')) {
          score += 10;
          reasons.push('Profit Tree → Profitability');
        }
        if (fcTool.includes('market entry') && ctName.includes('market entry')) {
          score += 10;
          reasons.push('Market Entry → Market Entry');
        }
        if (fcTool.includes('porter') && ctHints.includes('porter')) {
          score += 10;
          reasons.push('Porter 5 Forces → Market Entry');
        }
        if (fcTool.includes('m&a') && ctName.includes('m&a')) {
          score += 10;
          reasons.push('M&A Framework → M&A');
        }
        if (fcTool.includes('digital') && ctName.includes('digital')) {
          score += 10;
          reasons.push('Digital Transformation → Digital Transformation');
        }
        if (fcTool.includes('pricing') && ctName.includes('pricing')) {
          score += 10;
          reasons.push('Pricing Framework → Pricing Strategy');
        }
        if (fcTool.includes('restructuring') && ctName.includes('restructuring')) {
          score += 10;
          reasons.push('Restructuring → Restructuring');
        }
        if (fcTool.includes('process') && ctName.includes('operations')) {
          score += 8;
          reasons.push('Process Optimization → Operations');
        }
        if (fcTool.includes('scaling') && ctName.includes('growth')) {
          score += 8;
          reasons.push('Scaling Framework → Growth Strategy');
        }

        // Title/cluster matches
        if (fcTitle.includes('gewinn') && ctName.includes('profitability')) {
          score += 7;
          reasons.push('Gewinnoptimierung → Profitability');
        }
        if (fcTitle.includes('umsatz') && ctName.includes('growth')) {
          score += 6;
          reasons.push('Umsatzsteigerung → Growth Strategy');
        }
        if (fcTitle.includes('kosten') && ctName.includes('operations')) {
          score += 6;
          reasons.push('Kostenoptimierung → Operations');
        }
        if (fcTitle.includes('wettbewerb') && ctHints.includes('porter')) {
          score += 7;
          reasons.push('Wettbewerbsanalyse → Market Entry (Porter)');
        }
        if (fcTitle.includes('markteintritt') && ctName.includes('market entry')) {
          score += 9;
          reasons.push('Markteintritt → Market Entry');
        }

        // Cluster-based matches
        if (fcCluster.includes('leistung') && ctName.includes('operations')) {
          score += 3;
          reasons.push('Leistung & Wirtschaftlichkeit → Operations');
        }
        if (fcCluster.includes('wachstum') && ctName.includes('growth')) {
          score += 3;
          reasons.push('Wachstum → Growth Strategy');
        }

        if (score > matchScore && !usedCaseTypes.has(ct.id)) {
          matchScore = score;
          bestMatch = ct;
          matchReason = reasons.join(', ');
        }
      });

      if (bestMatch && matchScore >= 3) {
        matches.push({
          foundation_case: fc,
          case_type: bestMatch,
          match_score: matchScore,
          match_reason: matchReason,
        });
        usedCaseTypes.add(bestMatch.id);
      } else {
        unmatchedFoundation.push(fc);
      }
    });

    console.log('\n✅ SUCCESSFUL MATCHES:');
    matches.forEach((match, index) => {
      console.log(`${index + 1}. "${match.foundation_case.title}"`);
      console.log(`   ↔ "${match.case_type.name}" (Score: ${match.match_score})`);
      console.log(`   Reason: ${match.match_reason}`);
      console.log(`   Framework Hints: "${match.case_type.framework_hints}"`);
      console.log('');
    });

    console.log('\n⚠️  UNMATCHED FOUNDATION CASES (need manual assignment):');
    unmatchedFoundation.forEach((fc, index) => {
      console.log(`${index + 1}. "${fc.title}" | Tool: "${fc.tool}"`);
    });

    // Find unused case types
    const unusedCaseTypes = CASE_TYPES_DATA.filter((ct) => !usedCaseTypes.has(ct.id));
    console.log('\n📋 UNUSED CASE TYPES (available for manual assignment):');
    unusedCaseTypes.forEach((ct, index) => {
      console.log(`${index + 1}. "${ct.name}" - ${ct.description}`);
    });

    // Generate suggestions for unmatched cases
    console.log('\n💡 SUGGESTIONS FOR UNMATCHED CASES:');
    unmatchedFoundation.forEach((fc) => {
      let suggestion = '';
      if (fc.tool.includes('Go-to-Market')) {
        suggestion = 'Market Entry (closest match for Go-to-Market Strategy)';
      } else if (fc.tool.includes('Cost Structure')) {
        suggestion = 'Operations (for cost structure analysis)';
      } else if (fc.tool.includes('Innovation')) {
        suggestion = 'Innovation (if available) or Growth Strategy';
      } else {
        suggestion = 'Growth Strategy (generic strategic analysis)';
      }
      console.log(`- "${fc.title}": Suggested → ${suggestion}`);
    });

    // Generate SQL statements
    console.log('\n📝 SQL MIGRATION STATEMENTS:');
    console.log('='.repeat(80));

    console.log('-- Add columns to foundation_cases table');
    console.log('ALTER TABLE foundation_cases ADD COLUMN IF NOT EXISTS case_type TEXT;');
    console.log('ALTER TABLE foundation_cases ADD COLUMN IF NOT EXISTS framework_hints TEXT;');
    console.log('');

    console.log('-- Update matched foundation cases');
    matches.forEach((match) => {
      const escapedHints = match.case_type.framework_hints.replace(/'/g, "''");
      console.log(
        `UPDATE foundation_cases SET case_type = '${match.case_type.name}', framework_hints = '${escapedHints}' WHERE id = '${match.foundation_case.id}';`,
      );
    });

    console.log('\n-- Manual assignments needed for unmatched cases:');
    unmatchedFoundation.forEach((fc) => {
      console.log(
        `-- TODO: UPDATE foundation_cases SET case_type = '???', framework_hints = '???' WHERE id = '${fc.id}'; -- "${fc.title}"`,
      );
    });

    console.log('\n✅ Analysis complete! Ready for migration.');
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

matchCaseTypesProperly();
