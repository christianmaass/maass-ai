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

async function importAllFoundationCases() {
  console.log('🚀 Importing all 12 Foundation Cases...\n');

  try {
    // Define all 12 Foundation Cases with their tools and frameworks
    const foundationCases = [
      {
        id: 'foundation-case-1',
        title: 'TechCorp Gewinnrückgang analysieren',
        category: 'foundation',
        cluster: 'Leistung & Wirtschaftlichkeit',
        tool: 'Profit Tree',
        difficulty: 1,
        estimated_duration: 15,
        interaction_type: 'multiple_choice_with_hypotheses',
        learning_objectives: [
          'Profit Tree Methodik verstehen',
          'Strukturierte Problemdiagnose',
          'MECE-Prinzip anwenden',
        ],
        content: {
          introduction:
            'Ein Profit Tree ist ein strukturiertes Framework zur systematischen Analyse von Gewinnveränderungen.',
          situation:
            'TechCorp ist ein Software-Unternehmen mit sinkendem Gewinn bei stabilem Umsatz.',
          framework: 'profit_tree',
        },
      },
      {
        id: 'foundation-case-2',
        title: 'RetailMax Umsatzanalyse',
        category: 'foundation',
        cluster: 'Leistung & Wirtschaftlichkeit',
        tool: 'Revenue Tree',
        difficulty: 2,
        estimated_duration: 20,
        interaction_type: 'multiple_choice_with_hypotheses',
        learning_objectives: [
          'Revenue Tree Aufbau',
          'Umsatzkomponenten analysieren',
          'Wachstumshebel identifizieren',
        ],
        content: {
          introduction:
            'Revenue Trees zerlegen Umsatz in Anzahl Kunden × Preis pro Kunde oder andere relevante Komponenten.',
          situation: 'RetailMax verzeichnet stagnierende Umsätze trotz Marktexpansion.',
          framework: 'revenue_tree',
        },
      },
      {
        id: 'foundation-case-3',
        title: 'StartupTech Markteintrittsstrategie',
        category: 'foundation',
        cluster: 'Strategie & Wachstum',
        tool: 'Market Entry Framework',
        difficulty: 3,
        estimated_duration: 25,
        interaction_type: 'structured_mbb',
        learning_objectives: [
          'Market Entry Strategien',
          'Marktattraktivität bewerten',
          'Entry-Modi vergleichen',
        ],
        content: {
          introduction:
            'Market Entry Frameworks helfen bei der systematischen Bewertung neuer Märkte.',
          situation: 'StartupTech möchte in den europäischen Markt expandieren.',
          framework: 'market_entry',
        },
      },
      {
        id: 'foundation-case-4',
        title: 'GlobalCorp Kostenoptimierung',
        category: 'foundation',
        cluster: 'Leistung & Wirtschaftlichkeit',
        tool: 'Cost Structure Analysis',
        difficulty: 4,
        estimated_duration: 20,
        interaction_type: 'multiple_choice_with_hypotheses',
        learning_objectives: [
          'Kostenstruktur analysieren',
          'Fix vs. variable Kosten',
          'Optimierungshebel identifizieren',
        ],
        content: {
          introduction:
            'Cost Structure Analysis systematisiert die Kostenanalyse nach Kategorien und Beeinflussbarkeit.',
          situation: 'GlobalCorp muss Kosten um 15% reduzieren ohne Qualitätsverlust.',
          framework: 'cost_structure',
        },
      },
      {
        id: 'foundation-case-5',
        title: 'FinanceFirst Wettbewerbsanalyse',
        category: 'foundation',
        cluster: 'Strategie & Wachstum',
        tool: 'Porter 5 Forces',
        difficulty: 5,
        estimated_duration: 30,
        interaction_type: 'structured_mbb',
        learning_objectives: [
          'Porter 5 Forces anwenden',
          'Branchenattraktivität bewerten',
          'Competitive Positioning',
        ],
        content: {
          introduction:
            "Porter's 5 Forces analysiert die Wettbewerbsintensität und Profitabilität einer Branche.",
          situation: 'FinanceFirst evaluiert die Attraktivität des FinTech-Marktes.',
          framework: 'porter_5_forces',
        },
      },
      {
        id: 'foundation-case-6',
        title: 'MedDevice Produktlaunch',
        category: 'foundation',
        cluster: 'Innovation & Transformation',
        tool: 'Go-to-Market Strategy',
        difficulty: 6,
        estimated_duration: 35,
        interaction_type: 'free_form_with_hints',
        learning_objectives: [
          'Go-to-Market Strategie entwickeln',
          'Zielgruppen definieren',
          'Launch-Planung',
        ],
        content: {
          introduction:
            'Go-to-Market Strategien definieren wie neue Produkte erfolgreich am Markt eingeführt werden.',
          situation: 'MedDevice launcht ein innovatives Medizingerät in einem regulierten Markt.',
          framework: 'go_to_market',
        },
      },
      {
        id: 'foundation-case-7',
        title: 'LogisticsPro Effizienzsteigerung',
        category: 'foundation',
        cluster: 'Operations & Prozesse',
        tool: 'Process Optimization',
        difficulty: 7,
        estimated_duration: 25,
        interaction_type: 'structured_mbb',
        learning_objectives: ['Prozessanalyse', 'Bottleneck-Identifikation', 'Effizienzsteigerung'],
        content: {
          introduction:
            'Process Optimization identifiziert und behebt Ineffizienzen in Geschäftsprozessen.',
          situation: 'LogisticsPro hat Lieferzeiten-Probleme und steigende Betriebskosten.',
          framework: 'process_optimization',
        },
      },
      {
        id: 'foundation-case-8',
        title: 'TechGiant M&A Bewertung',
        category: 'foundation',
        cluster: 'Strategie & Wachstum',
        tool: 'M&A Framework',
        difficulty: 8,
        estimated_duration: 40,
        interaction_type: 'free_form_with_hints',
        learning_objectives: ['M&A Bewertung', 'Synergien identifizieren', 'Due Diligence'],
        content: {
          introduction: 'M&A Frameworks strukturieren die Bewertung von Akquisitionsmöglichkeiten.',
          situation: 'TechGiant evaluiert die Übernahme eines KI-Startups für 500M€.',
          framework: 'ma_framework',
        },
      },
      {
        id: 'foundation-case-9',
        title: 'EnergyFuture Digitalisierung',
        category: 'foundation',
        cluster: 'Innovation & Transformation',
        tool: 'Digital Transformation',
        difficulty: 9,
        estimated_duration: 35,
        interaction_type: 'free_form_with_hints',
        learning_objectives: ['Digital Strategy', 'Transformation Roadmap', 'Change Management'],
        content: {
          introduction:
            'Digital Transformation Frameworks leiten systematische Digitalisierungsprozesse.',
          situation: 'EnergyFuture muss traditionelle Energieversorgung digitalisieren.',
          framework: 'digital_transformation',
        },
      },
      {
        id: 'foundation-case-10',
        title: 'ConsumerBrand Pricing-Strategie',
        category: 'foundation',
        cluster: 'Operations & Prozesse',
        tool: 'Pricing Framework',
        difficulty: 10,
        estimated_duration: 30,
        interaction_type: 'structured_mbb',
        learning_objectives: ['Pricing Strategien', 'Value-based Pricing', 'Competitive Pricing'],
        content: {
          introduction:
            'Pricing Frameworks optimieren Preisstrategien basierend auf Wert, Kosten und Wettbewerb.',
          situation: 'ConsumerBrand muss Preise für Premium-Produktlinie neu positionieren.',
          framework: 'pricing_framework',
        },
      },
      {
        id: 'foundation-case-11',
        title: 'HealthTech Skalierungsstrategie',
        category: 'foundation',
        cluster: 'Innovation & Transformation',
        tool: 'Scaling Framework',
        difficulty: 11,
        estimated_duration: 45,
        interaction_type: 'minimal_support',
        learning_objectives: ['Skalierungsstrategien', 'Growth Metrics', 'Operational Scaling'],
        content: {
          introduction:
            'Scaling Frameworks strukturieren das Wachstum von Startups zu etablierten Unternehmen.',
          situation: 'HealthTech muss von 50 auf 500 Mitarbeiter skalieren bei 10x Umsatzwachstum.',
          framework: 'scaling_framework',
        },
      },
      {
        id: 'foundation-case-12',
        title: 'GlobalBank Restrukturierung',
        category: 'foundation',
        cluster: 'Operations & Prozesse',
        tool: 'Restructuring Framework',
        difficulty: 12,
        estimated_duration: 50,
        interaction_type: 'minimal_support',
        learning_objectives: [
          'Restrukturierung',
          'Turnaround Management',
          'Stakeholder Management',
        ],
        content: {
          introduction:
            'Restructuring Frameworks leiten Unternehmen durch Krisenzeiten und Turnaround-Situationen.',
          situation: 'GlobalBank steht vor Restrukturierung aufgrund regulatorischer Änderungen.',
          framework: 'restructuring_framework',
        },
      },
    ];

    // Clear existing cases first
    console.log('🧹 Clearing existing Foundation Cases...');
    const { error: deleteError } = await supabase
      .from('foundation_cases')
      .delete()
      .neq('id', 'non-existent-id');

    if (deleteError) {
      console.error('❌ Error clearing cases:', deleteError);
      return;
    }

    // Insert all cases
    console.log('📝 Inserting Foundation Cases...\n');

    for (const caseData of foundationCases) {
      const { error } = await supabase.from('foundation_cases').insert({
        ...caseData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error(`❌ Error inserting ${caseData.id}:`, error);
      } else {
        console.log(
          `✅ ${caseData.difficulty.toString().padStart(2)}: ${caseData.title} (${caseData.tool})`,
        );
      }
    }

    // Verification
    console.log('\n📝 Verifying import...');
    const { data: allCases, error: verifyError } = await supabase
      .from('foundation_cases')
      .select('id, title, tool, cluster, difficulty')
      .order('difficulty');

    if (verifyError) {
      console.error('❌ Verification error:', verifyError);
      return;
    }

    console.log(`\n📊 Successfully imported ${allCases.length} Foundation Cases:`);
    console.log('\n🎯 BY CLUSTER:');

    const clusters = {};
    allCases.forEach((c) => {
      if (!clusters[c.cluster]) clusters[c.cluster] = [];
      clusters[c.cluster].push(c);
    });

    Object.keys(clusters).forEach((cluster) => {
      console.log(`\n  📋 ${cluster}:`);
      clusters[cluster].forEach((c) => {
        console.log(`    ${c.difficulty.toString().padStart(2)}: ${c.title} (${c.tool})`);
      });
    });

    console.log('\n🎉 All Foundation Cases imported successfully!');
    console.log('🔗 Access Foundation Manager at: /admin/foundation-manager');
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

importAllFoundationCases();
