require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function analyzeFoundationCases() {
  console.log('🔍 Analyzing Foundation Cases for case_type and framework_hints...');

  try {
    // Fetch foundation_cases table
    console.log('\n📊 Fetching foundation_cases table...');
    const { data: foundationCases, error: foundationError } = await supabase
      .from('foundation_cases')
      .select('id, title, cluster, tool, difficulty, interaction_type')
      .order('difficulty');

    if (foundationError) {
      console.error('❌ Error fetching foundation_cases:', foundationError);
      return;
    }

    console.log(`✅ Found ${foundationCases?.length || 0} foundation cases:`);
    console.log('='.repeat(80));

    foundationCases?.forEach((fc, index) => {
      console.log(`${index + 1}. ID: "${fc.id}"`);
      console.log(`   Title: "${fc.title}"`);
      console.log(`   Cluster: "${fc.cluster}"`);
      console.log(`   Tool: "${fc.tool}"`);
      console.log(`   Difficulty: ${fc.difficulty}`);
      console.log(`   Interaction Type: "${fc.interaction_type}"`);
      console.log('');
    });

    // Generate case_type and framework_hints suggestions
    console.log('\n📋 SUGGESTED case_type AND framework_hints:');
    console.log('='.repeat(80));

    const suggestions = foundationCases?.map((fc) => {
      let caseType = '';
      let frameworkHints = '';

      // Generate case_type based on tool and cluster
      if (fc.tool.includes('Profit Tree')) {
        caseType = 'Profitability Analysis';
        frameworkHints =
          'Strukturiere den Gewinn systematisch in Umsatz und Kosten. Beginne mit der Gewinnformel (Profit = Revenue - Costs) und zerlege jeden Bereich in seine Komponenten. Identifiziere die größten Hebel und priorisiere deine Analyse entsprechend.';
      } else if (fc.tool.includes('Revenue Tree')) {
        caseType = 'Revenue Growth';
        frameworkHints =
          'Zerlege den Umsatz in seine Grundkomponenten (Anzahl Kunden × Preis pro Kunde oder Volumen × Preis). Analysiere jeden Treiber systematisch und identifiziere Wachstumshebel in allen Bereichen.';
      } else if (fc.tool.includes('Market Entry')) {
        caseType = 'Market Entry Strategy';
        frameworkHints =
          'Bewerte systematisch: 1) Marktattraktivität (Größe, Wachstum, Profitabilität), 2) Wettbewerbsposition (Stärken, Differenzierung), 3) Eintrittsbarrieren und Risiken, 4) Go-to-Market Strategie. Nutze Frameworks wie Porter 5 Forces für die Wettbewerbsanalyse.';
      } else if (fc.tool.includes('Porter')) {
        caseType = 'Competitive Analysis';
        frameworkHints =
          'Analysiere die fünf Wettbewerbskräfte systematisch: 1) Rivalität unter bestehenden Wettbewerbern, 2) Verhandlungsmacht der Lieferanten, 3) Verhandlungsmacht der Kunden, 4) Bedrohung durch Substitute, 5) Bedrohung durch neue Marktteilnehmer.';
      } else if (fc.tool.includes('MECE')) {
        caseType = 'Structured Problem Solving';
        frameworkHints =
          'Verwende das MECE-Prinzip (Mutually Exclusive, Collectively Exhaustive) für strukturierte Problemanalyse. Stelle sicher, dass deine Kategorien sich nicht überschneiden und alle relevanten Aspekte abdecken. Beginne mit einer klaren Problemdefinition.';
      } else if (fc.tool.includes('Issue Tree')) {
        caseType = 'Problem Structuring';
        frameworkHints =
          'Erstelle einen strukturierten Issue Tree: Beginne mit der Hauptfrage, zerlege sie in 2-4 Hauptäste (MECE), und unterteile jeden Ast weiter. Priorisiere die wichtigsten Äste und fokussiere deine Analyse auf die größten Hebel.';
      } else if (fc.tool.includes('SWOT')) {
        caseType = 'Strategic Assessment';
        frameworkHints =
          'Führe eine systematische SWOT-Analyse durch: Interne Stärken und Schwächen vs. externe Chancen und Bedrohungen. Leite konkrete strategische Optionen ab: Stärken nutzen, Schwächen beheben, Chancen ergreifen, Bedrohungen abwehren.';
      } else if (fc.tool.includes('Entscheidungsbaum') || fc.tool.includes('Decision Tree')) {
        caseType = 'Decision Analysis';
        frameworkHints =
          'Strukturiere komplexe Entscheidungen mit einem Entscheidungsbaum. Identifiziere alle Optionen, bewerte Wahrscheinlichkeiten und Outcomes, berechne Expected Values. Berücksichtige Risiken und entwickle Contingency-Pläne.';
      } else if (fc.tool.includes('BCG Matrix')) {
        caseType = 'Portfolio Analysis';
        frameworkHints =
          'Nutze die BCG-Matrix für Portfolioanalyse: Bewerte Geschäftsbereiche nach Marktanteil (relativ) und Marktwachstum. Kategorisiere in Stars, Cash Cows, Question Marks und Dogs. Entwickle spezifische Strategien für jede Kategorie.';
      } else if (fc.tool.includes('Value Chain')) {
        caseType = 'Value Chain Analysis';
        frameworkHints =
          'Analysiere die Wertschöpfungskette systematisch: Primäre Aktivitäten (Eingangslogistik, Produktion, Ausgangslogistik, Marketing, Service) und unterstützende Aktivitäten (Infrastruktur, HR, Technologie, Beschaffung). Identifiziere Kostentreiber und Differenzierungspotentiale.';
      } else if (fc.tool.includes('Ansoff')) {
        caseType = 'Growth Strategy';
        frameworkHints =
          'Verwende die Ansoff-Matrix für Wachstumsstrategien: Marktdurchdringung (bestehende Produkte/Märkte), Marktentwicklung (bestehende Produkte/neue Märkte), Produktentwicklung (neue Produkte/bestehende Märkte), Diversifikation (neue Produkte/neue Märkte). Bewerte Risiken und Ressourcenanforderungen.';
      } else {
        // Fallback based on cluster and title
        if (fc.cluster.includes('Leistung')) {
          caseType = 'Performance Improvement';
          frameworkHints = `Nutze ${fc.tool} als strukturiertes Framework für die Leistungsanalyse. Identifiziere Leistungslücken, analysiere Ursachen systematisch und entwickle konkrete Verbesserungsmaßnahmen.`;
        } else if (fc.cluster.includes('Wachstum')) {
          caseType = 'Growth Strategy';
          frameworkHints = `Verwende ${fc.tool} für strukturierte Wachstumsanalyse. Bewerte interne und externe Wachstumstreiber und entwickle eine kohärente Wachstumsstrategie.`;
        } else {
          caseType = 'Strategic Analysis';
          frameworkHints = `Nutze ${fc.tool} als strukturiertes Analyseframework. Gehe systematisch vor, dokumentiere deine Erkenntnisse und leite konkrete Handlungsempfehlungen ab.`;
        }
      }

      return {
        id: fc.id,
        title: fc.title,
        tool: fc.tool,
        cluster: fc.cluster,
        difficulty: fc.difficulty,
        suggested_case_type: caseType,
        suggested_framework_hints: frameworkHints,
      };
    });

    // Display suggestions
    suggestions?.forEach((suggestion, index) => {
      console.log(`${index + 1}. "${suggestion.title}" (${suggestion.id})`);
      console.log(`   Tool: ${suggestion.tool}`);
      console.log(`   Suggested case_type: "${suggestion.suggested_case_type}"`);
      console.log(`   Suggested framework_hints: "${suggestion.suggested_framework_hints}"`);
      console.log('');
    });

    // Generate SQL ALTER and UPDATE statements
    console.log('\n📝 SQL STATEMENTS TO ADD COLUMNS AND UPDATE DATA:');
    console.log('='.repeat(80));

    console.log('-- Add new columns to foundation_cases table');
    console.log('ALTER TABLE foundation_cases ADD COLUMN IF NOT EXISTS case_type TEXT;');
    console.log('ALTER TABLE foundation_cases ADD COLUMN IF NOT EXISTS framework_hints TEXT;');
    console.log('');

    console.log('-- Update foundation_cases with suggested values');
    suggestions?.forEach((suggestion) => {
      console.log(
        `UPDATE foundation_cases SET case_type = '${suggestion.suggested_case_type}', framework_hints = '${suggestion.suggested_framework_hints.replace(/'/g, "''")}' WHERE id = '${suggestion.id}';`,
      );
    });

    console.log('\n✅ Analysis complete!');
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

analyzeFoundationCases();
