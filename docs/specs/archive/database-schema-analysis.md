# 🔍 DATENBANKSCHEMA-ANALYSE FÜR MULTI-KURS-ARCHITEKTUR

## Bestandsaufnahme und Anpassungsbedarfe

---

## 📊 AKTUELLER SCHEMA-STATUS

### **✅ BEREITS VORHANDEN (add-user-tracking.sql):**

```sql
-- user_profiles Erweiterungen
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS first_login_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_activity_track VARCHAR(50), -- "Onboarding", "Foundation Track"
ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP WITH TIME ZONE;

-- Helper Functions
CREATE OR REPLACE FUNCTION update_user_login_tracking() -- Trigger für Login-Tracking
CREATE OR REPLACE FUNCTION get_user_welcome_status(user_id UUID) -- Welcome-Status abrufen
CREATE OR REPLACE FUNCTION update_user_activity_tracking() -- Activity-Tracking
```

### **✅ BEREITS INTEGRIERT:**

- **API:** `/api/user/welcome-status.ts` nutzt `login_count` für User-Detection
- **Frontend:** WelcomeSection verwendet `isFirstTime` basierend auf `login_count <= 1`
- **Tracking:** Login- und Activity-Tracking funktioniert

---

## ❌ **SCHEMA-LÜCKEN FÜR MULTI-KURS-ARCHITEKTUR:**

### **1. FEHLENDE KURS-STRUKTUREN:**

```sql
-- FEHLT: Zentrale Kurs-Entität
CREATE TABLE courses (
  id UUID PRIMARY KEY,
  slug VARCHAR(50) UNIQUE, -- 'strategy-track', 'finance-track'
  name VARCHAR(100), -- 'Strategy Track'
  description TEXT,
  difficulty_level INTEGER,
  is_active BOOLEAN DEFAULT true
);

-- FEHLT: User-Kurs-Einschreibungen
CREATE TABLE user_course_enrollments (
  user_id UUID REFERENCES auth.users(id),
  course_id UUID REFERENCES courses(id),
  status VARCHAR(20) DEFAULT 'active',
  enrolled_at TIMESTAMP WITH TIME ZONE,
  progress_percentage DECIMAL(5,2) DEFAULT 0.00
);
```

### **2. CASE-KURS-ZUORDNUNG FEHLT:**

```sql
-- PROBLEM: case_types haben keine Kurs-Zuordnung
-- AKTUELL: case_types (name, description, difficulty_level)
-- BENÖTIGT: Welche case_types gehören zu welchem Kurs?

CREATE TABLE course_case_types (
  course_id UUID REFERENCES courses(id),
  case_type_id UUID REFERENCES case_types(id),
  sequence_order INTEGER DEFAULT 0
);
```

### **3. KURS-SPEZIFISCHES PROGRESS-TRACKING FEHLT:**

```sql
-- PROBLEM: user_progress ist global, nicht kurs-spezifisch
-- AKTUELL: user_progress (user_id, completed_cases, average_score)
-- BENÖTIGT: Progress pro Kurs

CREATE TABLE user_course_progress (
  user_id UUID REFERENCES auth.users(id),
  course_id UUID REFERENCES courses(id),
  completed_cases INTEGER DEFAULT 0,
  current_case_type_id UUID REFERENCES case_types(id)
);
```

---

## 🔧 **ANPASSUNGSBEDARFE FÜR USER-ROUTING:**

### **1. USER-STATUS-DETECTION:**

```sql
-- ✅ BEREITS VORHANDEN: login_count für neue vs. wiederkehrende User
-- ✅ BEREITS FUNKTIONAL: get_user_welcome_status() Funktion

-- ANPASSUNG BENÖTIGT: Erweiterte User-Status-Logic
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS current_course_id UUID REFERENCES courses(id),
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
```

### **2. ROUTING-CONTEXT:**

```sql
-- PROBLEM: Keine Speicherung der Herkunfts-Seite (Onboarding/Dashboard)
-- LÖSUNG: Session-basiert oder URL-Parameter (kein Schema-Change nötig)
```

---

## 📋 **SCHEMA-MIGRATIONS-PLAN:**

### **ARBEITSPAKET 0: SCHEMA-VORBEREITUNG (NEUE VORAUSSETZUNG)**

**Status:** 🚨 Kritisch für AP1  
**Dauer:** 1 Tag  
**Dependencies:** Keine

#### **0.1 Multi-Kurs-Schema-Migration**

- [ ] `add-multi-course-support-SAFE.sql` ausführen
- [ ] Verification: Alle neuen Tabellen korrekt erstellt
- [ ] Seed-Data: Strategy Track als ersten Kurs anlegen
- [ ] Bestehende User automatisch in Strategy Track einschreiben

#### **0.2 Schema-Kompatibilität prüfen**

- [ ] Bestehende APIs (`welcome-status.ts`) mit neuen Strukturen testen
- [ ] WelcomeSection-Komponente mit erweiterten Daten testen
- [ ] Keine Breaking Changes für aktuelle Features

#### **0.3 User-Status-Erweiterung**

- [ ] `current_course_id` in user_profiles für Routing-Context
- [ ] `onboarding_completed` Flag für bessere User-Flow-Steuerung
- [ ] Update der `get_user_welcome_status()` Funktion

---

## 🔄 **AKTUALISIERTE ARBEITSPAKET-REIHENFOLGE:**

```
AP0: Schema-Vorbereitung (NEUE VORAUSSETZUNG)
├── Multi-Kurs-Schema-Migration
├── Kompatibilitäts-Tests
└── User-Status-Erweiterung

AP1: Kursauswahl & Routing-Grundstruktur
├── Nutzt neue Kurs-Strukturen aus AP0
├── User-Detection basierend auf erweiterten Daten
└── Kurs-Kacheln aus courses-Tabelle

AP2: Kursdatenbank-Integration & Tracking
├── APIs nutzen neue Multi-Kurs-Strukturen
├── User-Einschreibungen aus user_course_enrollments
└── Progress-Tracking aus user_course_progress
```

---

## ⚠️ **KRITISCHE ABHÄNGIGKEITEN:**

1. **AP0 ist Voraussetzung für AP1:** Ohne Multi-Kurs-Schema keine Kurs-Kacheln
2. **Bestehende Features dürfen nicht brechen:** WelcomeSection, Dashboard, Foundation Cases
3. **Migration muss 100% sicher sein:** Produktive Daten dürfen nicht verloren gehen

---

## 🎯 **EMPFEHLUNG:**

**SOFORTIGE SCHEMA-ANALYSE UND -ANPASSUNG ERFORDERLICH**

Bevor wir mit AP1 (Kursauswahl & Routing) beginnen können, müssen wir:

1. **Multi-Kurs-Schema migrieren** (add-multi-course-support-SAFE.sql)
2. **Kompatibilität testen** (bestehende APIs/Komponenten)
3. **User-Status erweitern** (current_course_id, onboarding_completed)

**Soll ich mit Arbeitspaket 0 (Schema-Vorbereitung) beginnen?**
