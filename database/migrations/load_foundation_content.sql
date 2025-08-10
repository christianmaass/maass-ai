-- =====================================================
-- FOUNDATION CASES CONTENT LOADER
-- =====================================================
-- Lädt JSON-Content aus den Case-Dateien in die Datenbank
-- 
-- VORAUSSETZUNG: 
-- 1. 001_foundation_track_setup.sql ausgeführt
-- 2. seed_foundation_cases.sql ausgeführt
-- 3. JSON-Dateien im /content/foundation-cases/ Verzeichnis
-- 
-- HINWEIS: Dieses Script wird durch Node.js/API ausgeführt,
-- da PostgreSQL keinen direkten Dateisystem-Zugriff hat
-- =====================================================

-- =====================================================
-- CONTENT UPDATE TEMPLATE
-- =====================================================
-- 
-- Für jede Case-Datei wird ein UPDATE-Statement benötigt:
-- 
-- UPDATE foundation_cases 
-- SET content = $JSON_CONTENT_FROM_FILE$
-- WHERE id = 'case-XX';
-- 
-- Beispiel für Case 1:

/*
UPDATE foundation_cases 
SET content = '{
  "scenario": {
    "company": "TechFlow Solutions",
    "industry": "Software-as-a-Service (SaaS)",
    "situation": "Etabliertes B2B SaaS-Unternehmen mit 150 Mitarbeitern",
    "challenge": "Trotz steigender Umsätze sinkt die Profitabilität kontinuierlich",
    "context": "Das Management ist beunruhigt über die Gewinnentwicklung und benötigt eine strukturierte Analyse der Gewinnkomponenten."
  },
  "tool_explanation": {
    "name": "Profit Tree",
    "description": "Ein Profit Tree ist ein hierarchisches Framework zur strukturierten Analyse aller Gewinnkomponenten eines Unternehmens.",
    "key_principles": [
      "Systematische Aufschlüsselung: Gewinn = Umsatz - Kosten",
      "MECE-Prinzip: Vollständige und überschneidungsfreie Kategorisierung",
      "Datenbasierte Analyse: Quantifizierung aller Komponenten",
      "Hypothesengeleitete Untersuchung: Fokus auf kritische Bereiche"
    ],
    "application": "Verwende den Profit Tree um die Gewinnproblematik von TechFlow systematisch zu analysieren und konkrete Verbesserungsansätze zu identifizieren."
  },
  "multiple_choice": {
    // ... MC-Fragen aus JSON-Datei
  },
  "hypothesis_steps": [
    // ... Hypothesen-Schritte aus JSON-Datei
  ],
  "evaluation": {
    // ... Bewertungskriterien aus JSON-Datei
  }
}'::jsonb
WHERE id = 'case-01';
*/

-- =====================================================
-- CONTENT LOADING STRATEGY
-- =====================================================

-- Option 1: Manueller Import (für kleine Anzahl Cases)
-- Jede JSON-Datei manuell kopieren und als UPDATE-Statement ausführen

-- Option 2: API-basierter Import (empfohlen)
-- Node.js Script erstellen, das:
-- 1. Alle JSON-Dateien aus /content/foundation-cases/ liest
-- 2. Für jede Datei ein UPDATE-Statement an Supabase sendet
-- 3. Content-Feld mit JSON-Inhalt aktualisiert

-- Option 3: Supabase Function (fortgeschritten)
-- PostgreSQL Function erstellen, die JSON-Content via HTTP lädt

-- =====================================================
-- VALIDIERUNG NACH CONTENT-LOAD
-- =====================================================

-- Prüfe dass alle Cases Content haben
SELECT 
    id,
    title,
    CASE 
        WHEN content = '{}'::jsonb THEN 'EMPTY'
        WHEN jsonb_typeof(content) = 'object' AND content != '{}'::jsonb THEN 'LOADED'
        ELSE 'INVALID'
    END as content_status,
    jsonb_typeof(content) as content_type,
    pg_size_pretty(pg_column_size(content)) as content_size
FROM foundation_cases
ORDER BY difficulty;

-- Prüfe spezifische Content-Strukturen
SELECT 
    id,
    title,
    interaction_type,
    content ? 'scenario' as has_scenario,
    content ? 'tool_explanation' as has_tool_explanation,
    content ? 'multiple_choice' as has_mc,
    content ? 'hypothesis_steps' as has_hypotheses,
    content ? 'structured_input' as has_structured_input,
    content ? 'help_system' as has_help_system
FROM foundation_cases
ORDER BY difficulty;

-- Beispiel-Queries für Content-Zugriff
SELECT 
    id,
    title,
    content->>'scenario'->>'company' as company,
    content->>'tool_explanation'->>'name' as tool_name,
    jsonb_array_length(content->'learning_objectives') as num_objectives
FROM foundation_cases
WHERE content != '{}'::jsonb
LIMIT 3;

-- =====================================================
-- PERFORMANCE NACH CONTENT-LOAD
-- =====================================================

-- Teste JSONB-Performance mit echtem Content
EXPLAIN (ANALYZE, BUFFERS) 
SELECT id, title, content->'scenario' as scenario
FROM foundation_cases 
WHERE content->'scenario'->>'industry' LIKE '%Tech%';

-- Teste Content-Größe und Index-Nutzung
SELECT 
    id,
    pg_size_pretty(pg_total_relation_size('foundation_cases')) as table_size,
    pg_size_pretty(pg_column_size(content)) as content_size
FROM foundation_cases
ORDER BY pg_column_size(content) DESC
LIMIT 5;

-- =====================================================
-- CONTENT LOADING COMPLETED
-- =====================================================
-- 
-- NÄCHSTE SCHRITTE:
-- 1. Node.js Content-Loader Script erstellen
-- 2. Alle 12 JSON-Dateien in Datenbank laden
-- 3. Content-Validierung durchführen
-- 4. Performance mit echtem Content testen
-- 5. AP1 als abgeschlossen markieren
-- 
-- BEREIT FÜR: AP2 (API-Endpunkte Entwicklung)
-- =====================================================
