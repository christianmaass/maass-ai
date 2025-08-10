# NAVAA - Lean Development Guidelines

## 🎯 Prinzip: Gesunder Menschenverstand

**Funktioniert es? Ist es wartbar? Ist es sicher? → Gut!**

---

## 🚨 NIEMALS (Aus echten Problemen gelernt)

### RLS & SECURITY

- **Keine RLS-Workarounds** → Immer Admin-APIs mit Service Role
- **Keine direkten Supabase-Calls** im Frontend für Admin-Funktionen
- **Keine Quick Fixes** → Root-Cause-Analyse

### CODE-QUALITÄT

- **Keine hardcodierten Werte** → Konfigurierbare Lösungen
- **Kein State-Sharing** zwischen Cases/Entities
- **Keine unspezifischen Errors** → Detaillierte Fehlermeldungen

---

## ✅ IMMER (Bewährte Patterns)

### TECH-STACK

- **Next.js + TypeScript** für Type-Safety
- **Tailwind CSS** für konsistentes Styling
- **Supabase + RLS** für sichere Datenbank
- **Zod** für Input-Validation
- **Phyton + FastAPI** für Backend
- **Vercel** für Deployment

### CODE-PATTERNS

```typescript
// ✅ Admin-API Pattern
const response = await fetch('/api/admin/save-data', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
});

// ✅ Error Handling Pattern
try {
  const result = await operation();
  return { success: true, data: result };
} catch (error) {
  console.error('Operation failed:', error);
  return {
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error',
  };
}

// ✅ State Reset Pattern (verhindert Data-Sharing)
useEffect(() => {
  if (selectedEntity) {
    // Reset all related states
    setRelatedData({});
    setOtherStates({});

    // Load entity-specific data
    loadEntityData(selectedEntity.id);
  }
}, [selectedEntity]);
```

---

## 🗄️ DATENBANK-STANDARDS

### TABELLENNAMEN NIEMALS RATEN!

```typescript
// ❌ NIEMALS: Tabellennamen "frei erfinden"
.from('foundation_multiple_choice')  // Falsch geraten!
.from('user_responses')              // Existiert nicht!
.from('case_data')                   // Unbekannt!

// ✅ IMMER: Gegen existierende Struktur prüfen
// 1. Suche nach existierenden Tabellennamen:
grep -r "case_multiple_choice" pages/api/
grep -r ".from('" pages/api/

// 2. Oder prüfe Migrationen/SQL-Dateien:
ls scripts/*.sql
grep "CREATE TABLE" scripts/*.sql

// 3. Oder importiere DB-Typen (falls vorhanden):
import { Database } from '@/types/database';
type TableName = keyof Database['public']['Tables'];
```

### DATENBANK-FIRST APPROACH

```bash
# ✅ BEVOR du eine API schreibst:
# 1. Prüfe existierende APIs mit ähnlicher Funktionalität
find pages/api -name "*multiple*" -o -name "*question*"

# 2. Schaue dir deren Tabellennamen an
grep -n ".from('" pages/api/admin/generate-multiple-choice.ts

# 3. Verwende EXAKT denselben Namen
# Kein "foundation_" wenn es "case_" heißt!
```

---

## 🛠️ ZWECKMÄSSIGE ERWEITERUNGEN

### SOFORT SINNVOLL

- **Zod für Input-Validation** → Typsichere API-Validierung
- **React.memo für teure Komponenten** → Performance ohne Overengineering
- **Database Indexes** für häufige Queries → Einfache Performance-Wins

### BEI BEDARF HINZUFÜGEN

- **Python/FastAPI** → Wenn komplexe Backend-Logic nötig
- **React Native** → Wenn Mobile App gewünscht
- **OpenAI Integration** → Für KI-Features (bereits verwendet)

---

## 📋 COMPONENT STANDARDS

### INTERFACE SEGREGATION (Bewährt)

```typescript
// ✅ Spezifische Props pro Komponente
interface MultipleChoiceProps {
  questions: Question[];
  onGenerate: (caseId: string, stepNumber: number) => Promise<void>;
  isGenerating: boolean;
}

interface ContentModuleProps {
  existingContent: ContentModule | null;
  onSave: (content: ContentModule) => Promise<void>;
  isGenerating: boolean;
}

// ❌ Nicht: Monolithische Props
interface ModuleProps {
  questions?: Question[];
  content?: ContentModule;
  onGenerate?: any;
  onSave?: any;
}
```

### SINGLE RESPONSIBILITY

```typescript
// ✅ Eine Aufgabe pro Komponente
const ConditionalModuleRenderer = ({ stepConfig, ...props }) => {
  // NUR: Conditional Rendering basierend auf Konfiguration
  return (
    <>
      {stepConfig.multiple_choice && <MultipleChoiceComponent {...props.mcProps} />}
      {stepConfig.content_module && <ContentModuleComponent {...props.contentProps} />}
    </>
  );
};
```

---

## 🗄️ DATABASE PATTERNS

### RLS POLICIES (Standard)

```sql
-- Service Role (Admin Operations)
CREATE POLICY "Service role full access" ON table_name
    FOR ALL USING (auth.role() = 'service_role');

-- Authenticated Users (Read Access)
CREATE POLICY "Authenticated users read access" ON table_name
    FOR SELECT USING (auth.role() = 'authenticated');
```

### MIGRATIONS (Einfach & Sicher)

```sql
-- Immer mit Rollback-Plan
BEGIN;
ALTER TABLE existing_table ADD COLUMN new_column TEXT;
CREATE INDEX idx_table_column ON existing_table(new_column);
COMMIT;

-- Rollback (kommentiert):
-- ALTER TABLE existing_table DROP COLUMN IF EXISTS new_column;
```

---

## 🧪 TESTING (Pragmatisch)

### NUR TESTEN WAS WICHTIG IST

- **Kritische Business Logic** → Unit Tests
- **API Endpoints** → Integration Tests
- **User Workflows** → E2E Tests (nur die wichtigsten)

```typescript
// ✅ Einfacher Component Test
describe('ConditionalModuleRenderer', () => {
  it('should render only activated modules', () => {
    const config = { multiple_choice: true, content_module: false };
    render(<ConditionalModuleRenderer stepConfig={config} />);

    expect(screen.getByTestId('multiple-choice')).toBeInTheDocument();
    expect(screen.queryByTestId('content-module')).not.toBeInTheDocument();
  });
});
```

---

## 🎨 UI STANDARDS (Minimal)

### TAILWIND CONSISTENCY

```typescript
// ✅ Wiederverwendbare Styles
const styles = {
  button: 'px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700',
  input: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500',
  card: 'bg-white border border-gray-200 rounded-lg shadow-sm p-6',
};
```

## 🔍 DEBUGGING PATTERNS

### SYSTEMATIC ERROR ANALYSIS

1. **Enable Debug Output** → Sofortige Problem-Sichtbarkeit
2. **Check API Response Structure** → Verify before Frontend Integration
3. **Pattern Recognition** → "Gleicher Fehler in anderen Modulen?"

### API DEVELOPMENT CHECKLIST

- [ ] Authentication implementiert
- [ ] Response Structure dokumentiert
- [ ] Error Handling mit klaren Messages
- [ ] TypeScript Interfaces synchronisiert

## 🛡️ DEFENSIVE PROGRAMMING

### NULL-SAFETY FIRST

- **Immer Null-Checks** vor Object Property Access
- **Default Values** für alle Optional Props
- **Graceful Degradation** statt Runtime Crashes

### INTERFACE CONSISTENCY

- **Props Naming Convention** → onSubmit vs onSave standardisieren
- **Response Structure Convention** → { success, data, error }
- **Authentication Pattern** → Bearer ${userId} überall

---

## 🔄 ITERATIVE VERBESSERUNG

### REVIEW-ZYKLEN

- **Nach jedem größeren Feature** → Guidelines anpassen
- **Bei wiederkehrenden Problemen** → Neue Regel hinzufügen
- **Bei neuen Technologien** → Standards erweitern

### ERFAHRUNGSBASIERT

- **Was funktioniert gut?** → Beibehalten
- **Was verursacht Probleme?** → Regel hinzufügen
- **Was ist unnötig komplex?** → Vereinfachen

---

## 🎯 MEINE EMPFEHLUNGEN

### SOFORT UMSETZEN

1. **Zod für API-Validation** → Verhindert Runtime-Errors
2. **Consistent Error Handling** → Bessere Debugging-Erfahrung
3. **Database Indexes** → Performance ohne Komplexität

### MITTELFRISTIG SINNVOLL

1. **Component Library** → Wiederverwendbare UI-Komponenten
2. **API Response Types** → Vollständige Type-Safety
3. **Performance Monitoring** → Einfache Metriken

### NUR BEI BEDARF

1. **Microservices** → Wenn Monolith zu groß wird
2. **Advanced Caching** → Wenn Performance-Probleme auftreten
3. **Complex State Management** → Wenn React State nicht reicht

---

## 🤝 ZUSAMMENARBEITS-PATTERNS

### TASK-DEFINITION (Effizient)

```markdown
**Ziel:** Decision Matrix mit 3 Optionen + 4 Kriterien implementieren
**Akzeptanz:** Generisch, case-spezifisch, Admin-editierbar
**Scope:** Nur Matrix-Komponente, keine UI-Redesigns
```

### KOMMUNIKATION (Klar)

- **Bei Unklarheiten:** Konkrete Optionen vorschlagen + Empfehlung
- **Bei Design-Entscheidungen:** Pro/Contra mit bevorzugter Lösung
- **Bei Problemen:** Root-Cause + Lösungsvorschlag, nicht nur Symptom

### FEEDBACK-LOOPS (Pragmatisch)

- **DB-Schema:** Kurze Bestätigung vor Implementation
- **API-Design:** Approval bei größeren Änderungen
- **Fertige Features:** Test + Feedback, dann nächster Schritt

---

## 📚 DOKUMENTATION (Minimal)

### WAS DOKUMENTIEREN

- **API Endpoints** → Kurze Beschreibung + Beispiel
- **Complex Business Logic** → Warum, nicht wie
- **Setup Instructions** → Für neue Entwickler

### WAS NICHT DOKUMENTIEREN

- **Offensichtlicher Code** → Self-explanatory
- **Standard Patterns** → Sind in Guidelines
- **Temporäre Lösungen** → Werden eh geändert

---

**Version:** 1.0 - Lean & Pragmatisch  
**Prinzip:** Weniger ist mehr, Qualität über Quantität  
**Review:** Nach jedem Major Feature oder bei Problemen
