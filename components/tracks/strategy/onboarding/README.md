# 🎯 navaa Onboarding-Komponente

Eine interaktive 5-Schritte-Journey, die neuen Nutzern den navaa-Strategieprozess vermittelt.

## 📋 Übersicht

Das Onboarding führt User durch einen kompletten Strategieberatungs-Case und vermittelt dabei die 5 Kernschritte des navaa-Denkprozesses:

1. **🎯 Problemverständnis & Zielklärung**
2. **🏗️ Strukturierung & Hypothesenbildung**
3. **📊 Analyse & Zahlenarbeit**
4. **⚖️ Synthetisieren & Optionen bewerten**
5. **🎯 Empfehlung & Executive Summary**

## 🏗️ Architektur

```
components/onboarding/
├── OnboardingContainer.tsx          # Haupt-Container & State Management
├── ProgressIndicator.tsx           # Fortschrittsbalken (1-5)
├── SkipButton.tsx                  # Skip-Option mit Bestätigung
├── CompletionScreen.tsx            # Motivierender Abschluss
├── shared/
│   ├── MultipleChoice.tsx          # Wiederverwendbare MC-Komponente
│   ├── FeedbackBox.tsx             # Mini-Lernmomente
│   └── StepWrapper.tsx             # Konsistentes Step-Layout
├── steps/
│   ├── Step1_Problem.tsx           # Problemverständnis
│   ├── Step2_Structure.tsx         # Strukturierung
│   ├── Step3_Analysis.tsx          # Analyse & Zahlenarbeit
│   ├── Step4_Synthesis.tsx         # Optionsbewertung
│   └── Step5_Recommendation.tsx    # Empfehlung
├── types/
│   └── onboarding.types.ts         # TypeScript Interfaces
├── data/
│   └── stepContent.ts              # Zentralisierte Inhalte
└── utils/
    └── accessibility.ts            # A11y Utilities
```

## 🎨 Design-Prinzipien

- **navaa-Branding:** Türkis (#00bfae) als Primärfarbe
- **Minimalismus:** Max. 2-3 Sätze pro Slide
- **Progressive Disclosure:** Inhalte erscheinen schrittweise
- **Mobile-First:** Responsive Design für alle Geräte
- **Accessibility:** ARIA-Labels, Keyboard-Navigation

## 🧪 Features

### Interaktive Elemente

- **Multiple Choice:** Mit visueller Rückmeldung (grün/rot)
- **Impact-Schätzung:** Buttons für Prozent-Auswahl
- **Scorecard:** Systematische Optionsbewertung
- **Live-Berechnungen:** Automatische Kostenersparnis-Kalkulation

### UX-Features

- **Skip-Option:** Mit Bestätigungs-Dialog
- **Fortschrittsanzeige:** 5 türkise Balken
- **Story-Kontinuität:** Jeder Schritt baut auf vorherigen auf
- **Motivierender Abschluss:** Achievement Recognition + CTA

### Pädagogische Elemente

- **Mini-Cases:** Realistische Business-Szenarien
- **Feedback-System:** Erklärungen für richtige/falsche Antworten
- **Lernpunkte:** Hervorgehobene Key Takeaways
- **Framework-Einführung:** MECE, Scorecard, Empfehlungsformel

## 🚀 Usage

### Integration

```tsx
import OnboardingContainer from './components/onboarding/OnboardingContainer';

// Als eigenständige Seite
<OnboardingContainer />;
```

### Route

```
/onboarding - Standalone Onboarding-Seite
```

### State Management

- **Lokaler State:** Keine Datenbank-Persistierung
- **Wiederholbar:** User können Onboarding mehrfach durchlaufen
- **Session-basiert:** State wird bei Reload zurückgesetzt

## 📱 Responsive Verhalten

- **Desktop:** Horizontale Layouts, größere Buttons
- **Tablet:** Angepasste Grid-Layouts
- **Mobile:** Gestapelte Layouts, Touch-optimierte Buttons

## ♿ Accessibility

- **ARIA-Labels:** Für alle interaktiven Elemente
- **Keyboard Navigation:** Tab, Enter, Pfeiltasten
- **Screen Reader:** Announcements für State-Changes
- **Focus Management:** Sichtbare Focus-Indikatoren
- **Color Contrast:** WCAG 2.1 AA konform

## 🎯 Lernziele

Nach dem Onboarding können User:

- **Probleme strukturiert analysieren** (MECE-Prinzip)
- **Hypothesen bilden und testen**
- **Hebel priorisieren** (Impact vs. Aufwand)
- **Optionen systematisch bewerten** (Scorecard)
- **Executive Empfehlungen formulieren**

## 🔧 Maintenance

### Content Updates

Alle Texte und Cases sind in `data/stepContent.ts` zentralisiert:

```tsx
export const stepContentData: Record<number, StepContent> = {
  1: { title: "...", miniCase: "...", options: [...] }
}
```

### Styling Updates

- Primärfarbe: `#00bfae` (navaa-türkis)
- Sekundärfarben: Grautöne für Text und Backgrounds
- Spacing: Tailwind-Klassen für Konsistenz

### A11y Testing

```bash
# Lighthouse Accessibility Audit
npm run lighthouse

# axe-core Testing
npm run test:a11y
```

## 📊 Analytics (Future)

Potenzielle Tracking-Events:

- `onboarding_started`
- `step_completed` (mit step_number)
- `onboarding_skipped`
- `onboarding_completed`
- `real_case_started` (Conversion)

## 🚧 Future Enhancements

- **GPT-Integration:** Dynamisches Feedback in Step 2
- **Personalisierung:** Branchen-spezifische Cases
- **Gamification:** Punkte und Achievements
- **Analytics:** Detailed User Journey Tracking
- **A/B Testing:** Verschiedene Erklärungsansätze

---

**Status:** ✅ Production Ready  
**Letzte Aktualisierung:** 2025-01-28  
**Maintainer:** navaa Development Team
