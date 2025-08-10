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

async function updateFullCaseDescriptions() {
  console.log('🚀 Updating Foundation Cases with full detailed descriptions...\n');

  try {
    // Define complete case descriptions with full content
    const fullCaseDescriptions = [
      {
        id: 'foundation-case-1',
        content: {
          introduction:
            'Ein Profit Tree ist ein strukturiertes Framework zur systematischen Analyse von Gewinnveränderungen. Es zerlegt den Gewinn in seine Grundkomponenten: Gewinn = Umsatz - Kosten. Diese Methodik ermöglicht es, komplexe Gewinnprobleme in handhabbare Teilbereiche zu unterteilen und systematisch die Ursachen für Gewinnveränderungen zu identifizieren.',
          situation:
            'TechCorp ist ein mittelständisches Software-Unternehmen mit 200 Mitarbeitern, das ERP-Lösungen für kleine und mittlere Unternehmen entwickelt. Das Unternehmen hat sich in den letzten 5 Jahren erfolgreich am Markt etabliert und eine solide Kundenbasis aufgebaut. In den letzten 12 Monaten ist jedoch ein besorgniserregender Trend zu beobachten: Obwohl der Umsatz stabil bei €15 Mio. geblieben ist, ist der Gewinn dramatisch um 35% von €3 Mio. auf €1,95 Mio. gesunken. Die Gewinnmarge ist damit von 20% auf nur noch 13% gefallen. Das Management ist alarmiert, da diese Entwicklung die geplanten Investitionen in neue Produktentwicklung und Marktexpansion gefährdet.',
          question:
            'Warum ist der Gewinn von TechCorp um 35% gesunken, obwohl der Umsatz stabil geblieben ist? Welche spezifischen Kostentreiber sind verantwortlich und wie können diese optimiert werden?',
          context: [
            'Umsatz 2023: €15 Mio. (stabil zu 2022)',
            'Gewinn 2022: €3 Mio. (20% Marge)',
            'Gewinn 2023: €1,95 Mio. (13% Marge)',
            'Mitarbeiteranzahl: von 180 auf 200 gestiegen (+11%)',
            'Hauptprodukt: ERP-Software für KMU',
            'Marktposition: Etablierter Player im deutschen Mittelstand',
            'Kundenstamm: 450 aktive Kunden (stabil)',
            'Durchschnittlicher Kundenvertragswert: €33.333 (stabil)',
          ],
          framework: 'profit_tree',
        },
      },
      {
        id: 'foundation-case-2',
        content: {
          introduction:
            'Revenue Trees zerlegen Umsatz systematisch in seine Grundkomponenten wie Anzahl Kunden × Preis pro Kunde oder Anzahl Transaktionen × durchschnittlicher Transaktionswert. Diese Methodik hilft dabei, Umsatzprobleme zu diagnostizieren und Wachstumshebel zu identifizieren.',
          situation:
            'RetailMax ist eine deutsche Einzelhandelskette mit 85 Filialen, die Elektronik und Haushaltsgeräte verkauft. Trotz einer aggressiven Expansionsstrategie mit 15 neuen Filialen in den letzten 18 Monaten stagniert der Gesamtumsatz bei €120 Mio. Das Management hatte mit einem Umsatzwachstum von mindestens 20% gerechnet. Gleichzeitig beobachtet das Unternehmen einen intensiveren Wettbewerb durch Online-Händler und veränderte Kundengewohnheiten seit der Pandemie.',
          question:
            'Warum stagniert der Umsatz von RetailMax trotz der Expansion um 15 neue Filialen? Welche Umsatzkomponenten sind problematisch und wie kann das Wachstum wieder angekurbelt werden?',
          context: [
            'Gesamtumsatz 2023: €120 Mio. (stagnierend)',
            'Anzahl Filialen: von 70 auf 85 gestiegen (+21%)',
            'Durchschnittlicher Umsatz pro Filiale: gesunken von €1,71 Mio. auf €1,41 Mio.',
            'Kundenfrequenz: -15% im Vergleich zum Vorjahr',
            'Durchschnittlicher Kassenbetrag: +8% gestiegen',
            'Online-Konkurrenz: Amazon, MediaMarkt, Otto wachsen stark',
            'Neue Filialen: Hauptsächlich in kleineren Städten (20.000-50.000 Einwohner)',
            'Produktmix: 60% Elektronik, 40% Haushaltsgeräte',
          ],
          framework: 'revenue_tree',
        },
      },
      {
        id: 'foundation-case-3',
        content: {
          introduction:
            'Market Entry Frameworks strukturieren die Bewertung neuer Märkte anhand von Marktattraktivität, Wettbewerbsintensität, erforderlichen Ressourcen und strategischen Optionen. Sie helfen dabei, fundierte Entscheidungen über Expansionsstrategien zu treffen.',
          situation:
            'StartupTech ist ein deutsches FinTech-Startup mit 45 Mitarbeitern, das eine innovative Mobile-Payment-Lösung für kleine Händler entwickelt hat. In Deutschland haben sie bereits 2.500 Händler als Kunden gewonnen und einen Marktanteil von 3% im Segment der kleinen Einzelhändler erreicht. Das Unternehmen hat gerade eine Series-B-Finanzierung über €25 Mio. abgeschlossen und möchte nun international expandieren. Die Geschäftsführung erwägt eine Expansion nach Frankreich, Italien oder die Niederlande als ersten Schritt.',
          question:
            'In welchen europäischen Markt sollte StartupTech zuerst expandieren? Welche Markteintrittsstrategie ist am erfolgversprechendsten und welche Ressourcen sind erforderlich?',
          context: [
            'Aktueller Umsatz Deutschland: €8 Mio. ARR (Annual Recurring Revenue)',
            'Kundenstamm Deutschland: 2.500 Händler',
            'Marktanteil Deutschland: 3% bei kleinen Einzelhändlern',
            'Verfügbares Kapital für Expansion: €15 Mio.',
            'Team: 45 Mitarbeiter (25 Entwickler, 10 Sales, 10 Operations)',
            'Hauptkonkurrenten: Square, SumUp, iZettle',
            'Regulatorische Anforderungen: PCI-DSS, PSD2-Compliance erforderlich',
            'Technologie: Cloud-basiert, mehrsprachig erweiterbar',
          ],
          framework: 'market_entry',
        },
      },
      {
        id: 'foundation-case-4',
        content: {
          introduction:
            'Cost Structure Analysis systematisiert die Kostenanalyse nach Kategorien (Personal, Material, Overhead), Beeinflussbarkeit (fix vs. variabel) und Wertschöpfung. Diese Methodik identifiziert Optimierungshebel und priorisiert Kostensenkungsmaßnahmen.',
          situation:
            'GlobalCorp ist ein deutscher Automobilzulieferer mit 1.200 Mitarbeitern an 4 Standorten, der Präzisionsteile für Premium-Fahrzeughersteller produziert. Aufgrund sinkender Nachfrage nach Verbrennungsmotoren und dem Übergang zur Elektromobilität ist der Umsatz in den letzten 2 Jahren um 25% auf €180 Mio. gesunken. Gleichzeitig sind die Kosten nur um 8% gesunken, was zu einer dramatischen Verschlechterung der Profitabilität geführt hat. Das Unternehmen muss die Kosten um mindestens 15% reduzieren, um wieder profitabel zu werden.',
          question:
            'Wie kann GlobalCorp die Kosten um 15% reduzieren, ohne die Qualität und Lieferfähigkeit zu gefährden? Welche Kostenkategorien bieten das größte Optimierungspotential?',
          context: [
            'Umsatz 2023: €180 Mio. (Rückgang von €240 Mio. in 2021)',
            'Aktuelle Kostenstruktur: €195 Mio. (Verlust von €15 Mio.)',
            'Personalkosten: €85 Mio. (44% der Gesamtkosten)',
            'Materialkosten: €65 Mio. (33% der Gesamtkosten)',
            'Produktionskosten: €30 Mio. (15% der Gesamtkosten)',
            'Overhead/Verwaltung: €15 Mio. (8% der Gesamtkosten)',
            'Standorte: Deutschland (2), Tschechien (1), Polen (1)',
            'Hauptkunden: BMW, Mercedes, Audi (70% des Umsatzes)',
            'Auslastung: 65% (runter von 85% in 2021)',
          ],
          framework: 'cost_structure',
        },
      },
      {
        id: 'foundation-case-5',
        content: {
          introduction:
            "Porter's 5 Forces analysiert die Wettbewerbsintensität einer Branche anhand von fünf Kräften: Rivalität unter Wettbewerbern, Verhandlungsmacht der Lieferanten und Kunden, Bedrohung durch neue Marktteilnehmer und Substitute. Diese Analyse hilft bei der Bewertung der Branchenattraktivität.",
          situation:
            'FinanceFirst ist eine etablierte deutsche Privatbank mit €8 Mrd. Assets under Management, die vermögende Privatkunden betreut. Das Unternehmen spürt zunehmenden Druck durch FinTech-Startups, Robo-Advisor und Direktbanken. Gleichzeitig verschärfen sich regulatorische Anforderungen und die Zinsmarge ist aufgrund der Niedrigzinspolitik stark unter Druck. Das Management überlegt, ob eine Spezialisierung auf bestimmte Kundensegmente oder eine Diversifikation in neue Geschäftsfelder sinnvoll ist.',
          question:
            'Wie attraktiv ist der deutsche Private Banking Markt langfristig? Welche strategischen Optionen hat FinanceFirst, um ihre Wettbewerbsposition zu stärken?',
          context: [
            'Assets under Management: €8 Mrd.',
            'Kundenstamm: 12.000 vermögende Privatkunden (>€500k Vermögen)',
            'Durchschnittliche Kundenbeziehung: 15 Jahre',
            'Hauptkonkurrenten: Deutsche Bank PWM, Berenberg, Hauck & Aufhäuser',
            'FinTech-Konkurrenz: Scalable Capital, Trade Republic, Weltsparen',
            'Regulatorische Belastung: MiFID II, DSGVO, Geldwäschegesetz',
            'Zinsmarge: 0,8% (runter von 2,1% in 2010)',
            'Cost-Income-Ratio: 75% (Branchendurchschnitt: 65%)',
            'Mitarbeiter: 180 (davon 45 Kundenberater)',
          ],
          framework: 'porter_5_forces',
        },
      },
      {
        id: 'foundation-case-6',
        content: {
          introduction:
            'Go-to-Market Strategien definieren, wie neue Produkte erfolgreich am Markt eingeführt werden. Sie umfassen Zielgruppendefinition, Positionierung, Pricing, Vertriebskanäle und Launch-Timing. Besonders in regulierten Märkten wie dem Gesundheitswesen sind spezielle Überlegungen erforderlich.',
          situation:
            'MedDevice ist ein deutsches MedTech-Unternehmen mit 120 Mitarbeitern, das ein revolutionäres KI-basiertes Diagnosegerät für Hautkrebs entwickelt hat. Das Gerät kann mit 95% Genauigkeit Melanome erkennen und könnte die Früherkennung deutlich verbessern. Nach 4 Jahren Entwicklung und erfolgreichen klinischen Studien steht nun die CE-Zertifizierung kurz bevor. Das Unternehmen muss eine Go-to-Market-Strategie für den europäischen Markt entwickeln.',
          question:
            'Wie sollte MedDevice ihr KI-Diagnosegerät erfolgreich in Europa launchen? Welche Zielgruppen, Vertriebskanäle und Pricing-Strategien sind optimal?',
          context: [
            'Produktentwicklung: 4 Jahre, €12 Mio. investiert',
            'Klinische Studien: 95% Genauigkeit bei Melanom-Erkennung',
            'Regulatorischer Status: CE-Zertifizierung in 3 Monaten erwartet',
            'Zielmarkt Europa: 28 Länder, 450 Mio. potentielle Patienten',
            'Hautkrebs-Inzidenz: 250.000 neue Fälle/Jahr in Europa',
            'Potentielle Kunden: Dermatologen (8.500), Hausärzte (180.000), Kliniken (2.800)',
            'Hauptkonkurrenten: Traditionelle Dermatoskope, Biopsie-Verfahren',
            'Produktionskosten: €2.500 pro Gerät',
            'Verfügbares Marketing-Budget: €8 Mio. für ersten Launch',
          ],
          framework: 'go_to_market',
        },
      },
      {
        id: 'foundation-case-7',
        content: {
          introduction:
            'Process Optimization identifiziert und behebt Ineffizienzen in Geschäftsprozessen durch systematische Analyse von Durchlaufzeiten, Bottlenecks, Qualitätsproblemen und Ressourcenverbrauch. Ziel ist die Steigerung von Effizienz, Qualität und Kundenzufriedenheit.',
          situation:
            'LogisticsPro ist ein mittelständischer Logistikdienstleister mit 350 Mitarbeitern, der E-Commerce-Fulfillment für Online-Händler anbietet. Das Unternehmen betreibt 3 Distributionszentren und wickelt täglich 25.000 Sendungen ab. In den letzten Monaten häufen sich Kundenbeschwerden über verspätete Lieferungen und falsche Sendungen. Gleichzeitig sind die Betriebskosten um 18% gestiegen, während der Umsatz nur um 12% gewachsen ist.',
          question:
            'Wie kann LogisticsPro ihre Fulfillment-Prozesse optimieren, um Lieferzeiten zu verkürzen, Fehlerquoten zu reduzieren und Kosten zu senken?',
          context: [
            'Tägliches Sendungsvolumen: 25.000 Pakete',
            'Durchschnittliche Lieferzeit: 2,8 Tage (Ziel: 2,0 Tage)',
            'Fehlerquote: 2,1% (Branchenbenchmark: 1,2%)',
            'Betriebskosten: +18% vs. Vorjahr',
            'Umsatzwachstum: +12% vs. Vorjahr',
            'Mitarbeiter: 350 (davon 280 in der Logistik)',
            'Distributionszentren: Hamburg (12.000 qm), Köln (8.000 qm), München (6.000 qm)',
            'Hauptkunden: 45 Online-Händler (Fashion, Elektronik, Home & Garden)',
            'Peak-Zeiten: Black Friday (+300%), Weihnachten (+250%)',
            'Automatisierungsgrad: 35% (Branchendurchschnitt: 55%)',
          ],
          framework: 'process_optimization',
        },
      },
      {
        id: 'foundation-case-8',
        content: {
          introduction:
            'M&A Frameworks strukturieren die Bewertung von Akquisitionsmöglichkeiten durch systematische Analyse von strategischem Fit, Synergien, Bewertung und Integrationsrisiken. Sie helfen dabei, fundierte Kauf-/Verkaufsentscheidungen zu treffen.',
          situation:
            'TechGiant ist ein börsennotiertes deutsches Softwareunternehmen mit €2,5 Mrd. Umsatz, das ERP-Lösungen für Großunternehmen entwickelt. Um im Bereich Künstliche Intelligenz zu wachsen, evaluiert das Unternehmen die Übernahme von AI-Innovations, einem vielversprechenden KI-Startup mit 85 Mitarbeitern. AI-Innovations hat eine fortschrittliche Machine Learning Plattform entwickelt, die bereits von 150 Unternehmen genutzt wird. Der Kaufpreis liegt bei €500 Mio.',
          question:
            'Sollte TechGiant AI-Innovations für €500 Mio. übernehmen? Welche Synergien sind realisierbar und rechtfertigen den Kaufpreis?',
          context: [
            'TechGiant Umsatz: €2,5 Mrd., EBITDA-Marge: 22%',
            'AI-Innovations Umsatz: €25 Mio. ARR, Wachstum: +180% YoY',
            'Kaufpreis: €500 Mio. (20x Revenue Multiple)',
            'AI-Innovations Team: 85 Mitarbeiter (65 Entwickler)',
            'Kundenstamm AI-Innovations: 150 Unternehmen',
            'TechGiant Kundenstamm: 2.800 Großunternehmen',
            'Marktgröße KI-Software: €45 Mrd. global, +25% CAGR',
            'Hauptkonkurrenten: SAP, Oracle, Microsoft',
            'Technologie-Overlap: 30% komplementär, 70% neue Capabilities',
            'Retention-Anforderungen: 80% des AI-Innovations Teams für 3 Jahre',
          ],
          framework: 'ma_framework',
        },
      },
      {
        id: 'foundation-case-9',
        content: {
          introduction:
            'Digital Transformation Frameworks leiten systematische Digitalisierungsprozesse durch Analyse der aktuellen digitalen Reife, Definition der Zielarchitektur, Priorisierung von Initiativen und Change Management. Sie helfen traditionellen Unternehmen beim Übergang ins digitale Zeitalter.',
          situation:
            'EnergyFuture ist ein traditioneller deutscher Energieversorger mit 2.500 Mitarbeitern, der 1,2 Millionen Haushalte und 45.000 Geschäftskunden versorgt. Das Unternehmen spürt massiven Druck durch die Energiewende, neue Wettbewerber und veränderte Kundenerwartungen. Viele Prozesse sind noch papierbasiert, die IT-Landschaft ist fragmentiert und das Unternehmen hinkt bei digitalen Services deutlich hinterher. Der neue CEO hat eine umfassende Digitalisierungsinitiative angekündigt.',
          question:
            'Wie sollte EnergyFuture ihre Digitalisierung strategisch angehen? Welche Bereiche sind prioritär und wie kann der Wandel erfolgreich gestaltet werden?',
          context: [
            'Umsatz: €850 Mio., EBITDA-Marge: 8%',
            'Kunden: 1,2 Mio. Haushalte, 45.000 Geschäftskunden',
            'Mitarbeiter: 2.500 (Durchschnittsalter: 48 Jahre)',
            'Digitalisierungsgrad: 25% (Branchenbenchmark: 60%)',
            'IT-Budget: 2,1% vom Umsatz (Benchmark: 4,5%)',
            'Kundenservice: 70% telefonisch, 30% digital',
            'Hauptkonkurrenten: E.ON, Vattenfall, sowie neue Player wie Tibber',
            'Regulatorische Anforderungen: Smart Meter Rollout bis 2032',
            'Erneuerbare Energien: 35% des Portfolios',
            'Verfügbares Digitalisierungsbudget: €120 Mio. über 3 Jahre',
          ],
          framework: 'digital_transformation',
        },
      },
      {
        id: 'foundation-case-10',
        content: {
          introduction:
            'Pricing Frameworks optimieren Preisstrategien basierend auf Wert für den Kunden, Kosten, Wettbewerbsposition und strategischen Zielen. Sie helfen dabei, die optimale Balance zwischen Profitabilität und Marktanteil zu finden.',
          situation:
            'ConsumerBrand ist ein deutscher Premiumhersteller von Küchengeräten mit 450 Mitarbeitern, der hochwertige Kaffeemaschinen, Mixer und Küchenmaschinen produziert. Das Unternehmen hat eine starke Markenposition im Premium-Segment aufgebaut, spürt aber zunehmenden Preisdruck durch asiatische Konkurrenz und Handelsmarken. Gleichzeitig steigen die Rohstoffkosten kontinuierlich. Das Management überlegt eine Neupositionierung der Preise.',
          question:
            'Wie sollte ConsumerBrand ihre Pricing-Strategie anpassen, um Profitabilität zu sichern und gleichzeitig die Premiumposition zu verteidigen?',
          context: [
            'Umsatz: €180 Mio., Bruttomarge: 45%',
            'Produktportfolio: Kaffeemaschinen (60%), Mixer (25%), Küchenmaschinen (15%)',
            'Marktposition: #3 im deutschen Premium-Segment',
            "Hauptkonkurrenten: WMF, Krups, De'Longhi",
            'Preispremium vs. Massenmarkt: +85%',
            'Rohstoffkosten: +22% in den letzten 2 Jahren',
            'Kundensegmente: Premium-Haushalte (70%), Gastronomie (30%)',
            'Vertriebskanäle: Fachhandel (50%), Online (35%), Direktvertrieb (15%)',
            'Markenbekanntheit: 78% in der Zielgruppe',
            'Kundenloyalität: 65% Wiederkaufrate',
          ],
          framework: 'pricing_framework',
        },
      },
      {
        id: 'foundation-case-11',
        content: {
          introduction:
            'Scaling Frameworks strukturieren das Wachstum von Startups zu etablierten Unternehmen durch systematische Planung von Organisationsstrukturen, Prozessen, Systemen und Kultur. Sie adressieren die typischen Herausforderungen beim Übergang von der Startup- zur Scale-up-Phase.',
          situation:
            'HealthTech ist ein deutsches Digital Health Startup mit 50 Mitarbeitern, das eine Telemedizin-Plattform für chronische Krankheiten betreibt. Nach erfolgreichem Proof of Concept mit 15.000 Patienten und einer Series-B-Finanzierung über €40 Mio. plant das Unternehmen eine aggressive Skalierung auf 500 Mitarbeiter und 150.000 Patienten in den nächsten 18 Monaten. Gleichzeitig soll international expandiert werden.',
          question:
            'Wie kann HealthTech erfolgreich von 50 auf 500 Mitarbeiter skalieren, ohne die Startup-Agilität und Qualität zu verlieren? Welche Systeme und Prozesse sind kritisch?',
          context: [
            'Aktueller Stand: 50 Mitarbeiter, 15.000 Patienten',
            'Skalierungsziel: 500 Mitarbeiter, 150.000 Patienten in 18 Monaten',
            'Verfügbares Kapital: €40 Mio. Series-B',
            'Umsatz: €8 Mio. ARR, +300% YoY Wachstum',
            'Kundensegmente: Diabetes (60%), Herz-Kreislauf (40%)',
            'Regulatorische Anforderungen: CE-Medizinprodukt, DSGVO',
            'Technologie: Cloud-native, 99,9% Uptime erforderlich',
            'Internationalisierung: Niederlande und Österreich geplant',
            'Hauptkonkurrenten: Ada Health, Babylon Health',
            'Burn Rate: €2,5 Mio./Monat bei aktueller Größe',
          ],
          framework: 'scaling_framework',
        },
      },
      {
        id: 'foundation-case-12',
        content: {
          introduction:
            'Restructuring Frameworks leiten Unternehmen durch Krisenzeiten und Turnaround-Situationen. Sie umfassen Stakeholder-Management, operative Restrukturierung, finanzielle Sanierung und strategische Neuausrichtung. Ziel ist die nachhaltige Stabilisierung des Unternehmens.',
          situation:
            'GlobalBank ist eine deutsche Regionalbank mit €12 Mrd. Bilanzsumme und 1.800 Mitarbeitern, die traditionell Firmenkunden und vermögende Privatkunden betreut. Aufgrund von Niedrigzinsen, steigenden Regulierungskosten und Digitalisierungsdruck ist die Bank in eine schwere Krise geraten. Die Eigenkapitalquote ist auf 8,5% gefallen und die Rating-Agentur droht mit einem Downgrade. Eine umfassende Restrukturierung ist unumgänglich.',
          question:
            'Wie kann GlobalBank erfolgreich restrukturiert werden, um langfristig überlebensfähig zu bleiben? Welche strategischen und operativen Maßnahmen sind erforderlich?',
          context: [
            'Bilanzsumme: €12 Mrd., Eigenkapitalquote: 8,5% (Minimum: 10,5%)',
            'Mitarbeiter: 1.800, Cost-Income-Ratio: 85% (Benchmark: 65%)',
            'Zinsmarge: 0,9% (runter von 2,8% in 2010)',
            'Kreditausfälle: 1,8% (Branchendurchschnitt: 0,6%)',
            'Filialnetz: 85 Standorte (Auslastung: 45%)',
            'Kundenstamm: 180.000 Privatkunden, 12.000 Firmenkunden',
            'Digitalisierungsgrad: 25% (Branchenbenchmark: 70%)',
            'Hauptkonkurrenten: Sparkassen, Volksbanken, Direktbanken',
            'Regulatorische Belastung: €45 Mio./Jahr Compliance-Kosten',
            'Verfügbare Liquidität: €180 Mio. (6 Monate Betrieb)',
          ],
          framework: 'restructuring_framework',
        },
      },
    ];

    // Update each case with full description
    console.log('📝 Updating case descriptions...\n');

    for (const caseData of fullCaseDescriptions) {
      const { error } = await supabase
        .from('foundation_cases')
        .update({
          content: caseData.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', caseData.id);

      if (error) {
        console.error(`❌ Error updating ${caseData.id}:`, error);
      } else {
        console.log(
          `✅ Updated ${caseData.id}: Full description with ${caseData.content.context?.length || 0} context points`,
        );
      }
    }

    // Verification
    console.log('\n📝 Verifying updates...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('foundation_cases')
      .select('id, title, content')
      .order('difficulty');

    if (verifyError) {
      console.error('❌ Verification error:', verifyError);
      return;
    }

    console.log(`\n📊 Successfully updated ${verifyData.length} Foundation Cases:`);
    verifyData.forEach((c) => {
      const introLength = c.content?.introduction?.length || 0;
      const situationLength = c.content?.situation?.length || 0;
      const contextCount = c.content?.context?.length || 0;
      console.log(
        `  ${c.id}: ${introLength + situationLength} chars, ${contextCount} context points`,
      );
    });

    console.log('\n🎉 All case descriptions updated successfully!');
    console.log('🔗 You can now edit full descriptions in Foundation Manager');
  } catch (error) {
    console.error('❌ Update failed:', error);
  }
}

updateFullCaseDescriptions();
