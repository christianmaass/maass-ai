# 🎯 MULTI-KURS-ARCHITEKTUR: ARBEITSPLAN

## Navaa-konforme, schrittweise Umsetzung in freigebbaren Arbeitspaketen

---

## 📋 ÜBERBLICK

**Ziel:** Multi-Kurs-System mit Kursauswahl, dedizierten Kursseiten und Foundation Cases
**Strategie:** Schrittweise Umsetzung, jedes Paket unabhängig deploybar und navaa-konform
**Scope:** Initial nur Foundation Cases pro Kurs, später erweiterbar um weitere Module

---

## 🏗️ ARBEITSPAKET 1: KURSAUSWAHL & ROUTING-GRUNDSTRUKTUR

**Status:** ⏳ Bereit für Freigabe  
**Dauer:** 2-3 Tage  
**Dependencies:** Keine

### **Ziele:**

- **KRITISCH:** Separate Seiten für neue vs. wiederkehrende User
- Kurs-Kacheln auf `/onboarding` UND `/dashboard`
- Routing zu dedizierten Kursseiten (für beide User-Typen)
- Basis-Kursseiten mit kontextueller Navigation

### **Unteraufgaben:**

#### **1.0 User-Flow-Routing (VORAUSSETZUNG)**

- [ ] `/onboarding` Seite erstellen (für neue User)
- [ ] User-Status-Detection: `login_count <= 1` → Onboarding, sonst Dashboard
- [ ] Routing-Middleware für automatische Weiterleitung
- [ ] Context für User-Type (new/returning) in beiden Flows

#### **1.1 Kurs-Kacheln Komponente**

- [ ] `CourseCard.tsx` erstellen (Kachel-Design nach navaa Guidelines)
- [ ] Props: `course`, `userEnrolled`, `onClick`, `userType` (new/returning)
- [ ] Responsive Design, Hover-Effekte, Progress-Indikator
- [ ] **Integration in BEIDE Seiten:** `/onboarding` UND `/dashboard`
- [ ] Unterschiedliche CTA-Texte je User-Type

#### **1.2 Routing-Struktur**

- [ ] Route `/course/[slug]` in Next.js einrichten
- [ ] `pages/course/[slug].tsx` erstellen
- [ ] Navigation: Kachel-Klick → Kursseite (von beiden Flows)
- [ ] **Kontextuelle Navigation:** Zurück zu Onboarding ODER Dashboard
- [ ] URL-Parameter oder Session für Herkunfts-Tracking

#### **1.3 Basis-Kursseite**

- [ ] `CoursePage.tsx` Komponente
- [ ] Statische Kursdaten (Strategy Track) anzeigen
- [ ] Kurs-Header, Beschreibung, Schwierigkeitsgrad
- [ ] **Kontextuelle CTAs:** "Jetzt starten" (neue User) vs. "Fortsetzen" (wiederkehrende)
- [ ] **Smart Navigation:** Zurück-Button führt zu Herkunfts-Seite (Onboarding/Dashboard)
- [ ] Platzhalter für Progress-Anzeige

#### **1.4 Navigation & UX**

- [ ] **Dual-Flow-Navigation:** Onboarding ↔ Kursseite ↔ Dashboard
- [ ] Loading States für Seitenwechsel
- [ ] Error Handling für ungültige Kurs-Slugs
- [ ] Breadcrumb-System für beide User-Flows

### **🚀 USER-FLOW (KORRIGIERT):**

**Neue User:**

```
Login → User-Detection (login_count <= 1) → /onboarding → Kurs-Kacheln
→ Klick → /course/strategy-track?from=onboarding → "Jetzt starten" → Case-Flow
```

**Wiederkehrende User:**

```
Login → User-Detection (login_count > 1) → /dashboard → Kurs-Kacheln
→ Klick → /course/strategy-track?from=dashboard → "Fortsetzen" → Case-Flow
```

**Kontextuelle Navigation:**

- Zurück-Button auf Kursseite führt zu Herkunfts-Seite (Onboarding/Dashboard)
- Breadcrumbs zeigen korrekten Flow-Pfad anse Navigation

### **Deliverables:**

- ✅ Funktionale Kurs-Kacheln
- ✅ Routing zu Kursseiten
- ✅ Basis-Kursseiten mit statischen Daten
- ✅ Nahtlose Navigation

---

## 🏗️ ARBEITSPAKET 2: KURSDATENBANK-INTEGRATION & TRACKING

**Status:** ⏳ Wartet auf AP1  
**Dauer:** 2-3 Tage  
**Dependencies:** Arbeitspaket 1 abgeschlossen

### **Ziele:**

- Multi-Kurs-Schema produktiv schalten
- API-Integration für Kursdaten
- User-Einschreibungen und Progress aus DB

### **Unteraufgaben:**

#### **2.1 Datenbank-Migration**

- [ ] `add-multi-course-support-SAFE.sql` in Production ausführen
- [ ] Verification: Alle Tabellen und Funktionen korrekt erstellt
- [ ] Seed-Daten: Strategy Track und weitere Kurse anlegen
- [ ] Bestehende User automatisch in Strategy Track einschreiben

#### **2.2 API-Endpunkte**

- [ ] `/api/courses` - Alle verfügbaren Kurse abrufen
- [ ] `/api/courses/[slug]` - Einzelnen Kurs mit Details
- [ ] `/api/user/enrollments` - User-Einschreibungen abrufen
- [ ] `/api/user/course-progress/[slug]` - Kurs-spezifischer Progress
- [ ] JWT-Authentication für alle Endpunkte

#### **2.3 Frontend-Integration**

- [ ] `useCourses()` Hook für Kursdaten
- [ ] `useUserEnrollments()` Hook für User-Status
- [ ] Kurs-Kacheln aus DB befüllen
- [ ] Kursseiten dynamisch aus DB rendern

#### **2.4 User-Progress-Anzeige**

- [ ] Progress-Bars auf Kurs-Kacheln
- [ ] Detaillierter Progress auf Kursseiten
- [ ] "Fortsetzen" vs. "Starten" Button-Logic

### **Deliverables:**

- ✅ Multi-Kurs-Schema produktiv
- ✅ Vollständige API für Kursdaten
- ✅ Dynamische Kurs-Anzeige aus DB
- ✅ User-Progress-Tracking

---

## 🏗️ ARBEITSPAKET 3: KURSSTART & FOUNDATION CASE FLOW

**Status:** ⏳ Wartet auf AP2  
**Dauer:** 3-4 Tage  
**Dependencies:** Arbeitspaket 2 abgeschlossen

### **Ziele:**

- Kursstart-Funktionalität implementieren
- Foundation Cases pro Kurs anzeigen
- Kurs-spezifisches Progress-Tracking

### **Unteraufgaben:**

#### **3.1 Kursstart-Logic**

- [ ] "Foundation Cases starten" Button-Handler
- [ ] Automatische User-Einschreibung falls nötig
- [ ] Weiterleitung zu Foundation Cases des Kurses
- [ ] Start-Tracking (started_at, last_activity_at)

#### **3.2 Kurs-spezifische Foundation Cases**

- [ ] Foundation Cases nach Kurs filtern
- [ ] `FoundationCases.tsx` für kurs-spezifische Anzeige
- [ ] Case-Liste mit Kurs-Kontext
- [ ] Navigation: Kursseite ↔ Foundation Cases

#### **3.3 Progress-Tracking Integration**

- [ ] Case-Completion in `user_course_progress` speichern
- [ ] Progress-Update bei Case-Abschluss
- [ ] Kurs-Progress auf Kursseite anzeigen
- [ ] "Nächster Case" Logic pro Kurs

#### **3.4 Case-Detail-Integration**

- [ ] Case-Detail-Seiten mit Kurs-Kontext
- [ ] Breadcrumb: Dashboard → Kurs → Foundation Cases → Case
- [ ] Kurs-spezifische Assessments und Feedback

### **Deliverables:**

- ✅ Funktionaler Kursstart
- ✅ Kurs-spezifische Foundation Cases
- ✅ Vollständiges Progress-Tracking
- ✅ Nahtlose Case-Navigation

---

## 🏗️ ARBEITSPAKET 4: UX-FEINSCHLIFF & GUIDELINES

**Status:** ⏳ Wartet auf AP3  
**Dauer:** 2-3 Tage  
**Dependencies:** Arbeitspaket 3 abgeschlossen

### **Ziele:**

- Konsistente UI/UX nach navaa Guidelines
- Security & Access Control
- Analytics und Tracking

### **Unteraufgaben:**

#### **4.1 UI/UX-Konsistenz**

- [ ] Design-Review aller neuen Komponenten
- [ ] Navaa-konforme Farbpalette und Typography
- [ ] Responsive Design für alle Bildschirmgrößen
- [ ] Micro-Interactions und Animationen

#### **4.2 Security & Access Control**

- [ ] RLS-Policies für alle neuen Tabellen testen
- [ ] JWT-Authentication in allen API-Calls
- [ ] Error Handling und Validation
- [ ] Rate Limiting für API-Endpunkte

#### **4.3 Analytics & Tracking**

- [ ] Course-View-Events tracken
- [ ] Course-Start-Events tracken
- [ ] Progress-Milestones tracken
- [ ] Dashboard für Kurs-Analytics

#### **4.4 Performance-Optimierung**

- [ ] Database Query-Optimierung
- [ ] Frontend-Caching für Kursdaten
- [ ] Image-Optimierung für Kurs-Assets
- [ ] Lazy Loading für Kurs-Listen

### **Deliverables:**

- ✅ Navaa-konforme UI/UX
- ✅ Vollständige Security-Implementation
- ✅ Analytics-Tracking
- ✅ Performance-optimiert

---

## 🏗️ ARBEITSPAKET 5: VORBEREITUNG FÜR WEITERE MODULE

**Status:** ⏳ Wartet auf AP4  
**Dauer:** 1-2 Tage  
**Dependencies:** Arbeitspaket 4 abgeschlossen

### **Ziele:**

- Architektur für zukünftige Kursmodule vorbereiten
- Erweiterbare Kursseiten-Struktur
- API-Design für dynamische Module

### **Unteraufgaben:**

#### **5.1 Kursseiten-Erweiterung**

- [ ] Tab-Layout für Kursmodule (Foundation, Advanced, etc.)
- [ ] Platzhalter für zukünftige Module
- [ ] Dynamische Module-Navigation
- [ ] Progress-Tracking pro Modul

#### **5.2 Database-Schema-Vorbereitung**

- [ ] `course_modules` Tabelle (optional, für später)
- [ ] `user_module_progress` Struktur planen
- [ ] Migration-Strategie für Module-System
- [ ] Documentation für zukünftige Erweiterungen

#### **5.3 API-Design für Module**

- [ ] `/api/courses/[slug]/modules` Endpunkt-Struktur
- [ ] Flexible Module-Content-API
- [ ] Module-Progress-Tracking-API
- [ ] Backward-Compatibility sicherstellen

### **Deliverables:**

- ✅ Erweiterbare Kursseiten-Architektur
- ✅ Vorbereitung für Module-System
- ✅ Documentation für zukünftige Features
- ✅ Saubere Code-Basis für Erweiterungen

---

## 📊 FREIGABE-KRITERIEN

### **Pro Arbeitspaket:**

- [ ] Alle Unteraufgaben abgeschlossen
- [ ] Navaa Guidelines eingehalten
- [ ] Code Review durchgeführt
- [ ] Tests erfolgreich (manuell/automatisiert)
- [ ] Keine Breaking Changes für bestehende Features
- [ ] Documentation aktualisiert

### **Gesamt-Kriterien:**

- [ ] Multi-Kurs-System voll funktional
- [ ] Backward Compatibility gewährleistet
- [ ] Performance-Requirements erfüllt
- [ ] Security-Standards eingehalten
- [ ] UX-Konsistenz sichergestellt

---

## 🚀 DEPLOYMENT-STRATEGIE

### **Staging-Deployment:**

- Nach jedem Arbeitspaket auf Staging deployen
- Vollständige Funktions- und Integrationstests
- User-Acceptance-Testing

### **Production-Deployment:**

- Feature-Flags für schrittweise Aktivierung
- Monitoring und Error-Tracking
- Rollback-Plan für jedes Arbeitspaket

---

## 📝 NÄCHSTE SCHRITTE

**Bereit für Freigabe:** Arbeitspaket 1 - Kursauswahl & Routing-Grundstruktur

**Freigabe-Frage:** Soll ich mit der Umsetzung von Arbeitspaket 1 beginnen?

- Kurs-Kacheln auf Onboarding/Dashboard
- Routing zu `/course/[slug]`
- Basis-Kursseiten mit statischen Daten
- Navigation und UX-Grundlagen
