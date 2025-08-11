# UNIFIED GUARD SPECIFICATION

**Detaillierte Spezifikation für navaa.ai UnifiedGuard**

---

## 📋 USER-STATUS-MATRIX

### **ROUTING-FAKTOREN:**

```typescript
interface UnifiedRoutingFactors {
  // Authentication
  isAuthenticated: boolean;
  user: User | null;

  // User Status
  onboarding_completed: boolean;
  hasActiveEnrollments: boolean;
  login_count: number;

  // Subscription (Future-Ready)
  subscription_tier: 'free' | 'paid' | 'business' | null;
  subscription_status: 'active' | 'expired' | 'trial' | null;

  // Route Context
  currentRoute: string;
  requiredTier: 'free' | 'paid' | 'business';
  requireAuth: boolean;
}
```

### **ROUTING-ENTSCHEIDUNGSMATRIX:**

| User Status                                           | Current Route       | Action   | Redirect Target   | Reason                      |
| ----------------------------------------------------- | ------------------- | -------- | ----------------- | --------------------------- |
| **🔐 Not Authenticated**                              | Any protected route | Redirect | `/?login=true`    | Authentication required     |
| **🆕 New User** (onboarding=false, enrollments=false) | `/dashboard`        | Redirect | `/onboarding-new` | Needs onboarding            |
| **🆕 New User** (onboarding=false, enrollments=false) | `/course/*`         | Redirect | `/onboarding-new` | Needs onboarding            |
| **📚 With Enrollments** (enrollments=true)            | `/onboarding-new`   | Redirect | `/` (Homepage)    | Has active courses          |
| **✅ Completed Onboarding** (onboarding=true)         | `/onboarding-new`   | Redirect | `/` (Homepage)    | Already onboarded           |
| **💰 Insufficient Tier** (user=free, required=paid)   | `/premium-course`   | Redirect | `/upgrade/paid`   | Subscription upgrade needed |
| **✅ Valid Access**                                   | Any route           | Allow    | -                 | Access granted              |

### **SUBSCRIPTION-TIER-HIERARCHY:**

```typescript
const TIER_HIERARCHY = {
  free: 0,
  paid: 1,
  business: 2,
};

function hasSubscriptionAccess(userTier: string | null, requiredTier: string): boolean {
  const userLevel = TIER_HIERARCHY[userTier || 'free'] || 0;
  const requiredLevel = TIER_HIERARCHY[requiredTier] || 0;
  return userLevel >= requiredLevel;
}
```

---

## 🏗️ UNIFIED GUARD ARCHITEKTUR

### **KOMPONENTEN-STRUKTUR:**

```typescript
// 1. Core Hook (erweitert)
useUnifiedGuard(config: UnifiedGuardConfig)

// 2. Guard Component (vereinheitlicht)
UnifiedGuard({ config, children, fallback })

// 3. Route-spezifische Configs
UNIFIED_GUARDS = {
  DASHBOARD: { requireAuth: true, requiredTier: 'free' },
  ONBOARDING: { requireAuth: true, requiredTier: 'free' },
  PREMIUM_COURSE: { requireAuth: true, requiredTier: 'paid' },
  BUSINESS_FEATURES: { requireAuth: true, requiredTier: 'business' }
}
```

### **INTERFACE DEFINITION:**

```typescript
interface UnifiedGuardConfig {
  // Authentication
  requireAuth: boolean;

  // Subscription
  requiredTier: 'free' | 'paid' | 'business';

  // Custom Redirects (optional)
  newUserRedirect?: string;
  returningUserRedirect?: string;
  upgradeRedirect?: string;

  // Behavior
  allowOnError?: boolean;
  debugMode?: boolean;
}
```

---

## 🔄 MIGRATION-STRATEGIE

### **PHASE 1: HOOK ENHANCEMENT**

- ✅ `useRouteGuard.ts` bereits erweitert mit Smart Logic
- 🔧 Subscription-Tier Support hinzufügen
- 🔧 Interface auf UnifiedGuardConfig erweitern

### **PHASE 2: COMPONENT MIGRATION**

- 🔧 `RouteGuard.tsx` zu `UnifiedGuard.tsx` migrieren
- 🔧 Predefined Configurations aktualisieren
- 🔧 Convenience Wrappers anpassen

### **PHASE 3: USAGE MIGRATION**

- 🔧 `DashboardGuard` → `UnifiedGuard` (Dashboard-Seiten)
- 🔧 `OnboardingGuard` → `UnifiedGuard` (Onboarding-Seiten)
- 🔧 `CourseGuard` → `UnifiedGuard` (Course-Seiten)

### **PHASE 4: TESTING & CLEANUP**

- 🔧 Comprehensive Testing (alle User-Status-Kombinationen)
- 🔧 Legacy Guards entfernen
- 🔧 Dokumentation aktualisieren

---

## 🧪 TEST-SZENARIEN

### **KRITISCHE TEST-FÄLLE:**

1. **Neuer User** → Dashboard → sollte zu Onboarding
2. **User mit Enrollment** → Onboarding → sollte zu Homepage
3. **Free User** → Premium Course → sollte zu Upgrade
4. **Paid User** → Business Feature → sollte zu Upgrade
5. **Business User** → Alle Bereiche → sollte erlaubt sein

### **EDGE-CASES:**

- API-Fehler bei Enrollment-Check
- Expired Subscriptions
- Zirkuläre Redirects
- Race Conditions bei Auth-Loading

---

## ✅ VORTEILE DER UNIFIED GUARD

### **🎯 BUSINESS BENEFITS:**

- **Konsistente UX:** Keine widersprüchlichen Redirects
- **Zukunftssicher:** Subscription-Tier ready
- **Wartbar:** Eine Routing-Logic statt drei
- **Testbar:** Zentrale Test-Suite

### **🔧 TECHNICAL BENEFITS:**

- **Performance:** Keine doppelte Auth-Checks
- **Debugging:** Zentrale Logging-Stelle
- **Skalierbar:** Einfache Erweiterung für neue Tiers
- **Robust:** Einheitliche Error-Handling

---

## 🚀 IMPLEMENTATION ROADMAP

### **ARBEITSPAKET 6.1: ✅ COMPLETED**

- ✅ Konzept spezifiziert
- ✅ User-Status-Matrix definiert
- ✅ Architektur-Review durchgeführt

### **ARBEITSPAKET 6.2: NEXT**

- 🔧 useUnifiedGuard Hook implementieren
- 🔧 UnifiedGuard Component erstellen
- 🔧 Subscription-Tier Logic hinzufügen

### **ARBEITSPAKET 6.3-6.5: FOLLOWING**

- 🔧 Schrittweise Migration
- 🔧 Testing & Validation
- 🔧 Cleanup & Documentation

---

**STATUS:** 🎯 **READY FOR IMPLEMENTATION**
**RISK ASSESSMENT:** 🟢 **LOW** (Schrittweise Migration, Rollback-fähig)
**BUSINESS VALUE:** 🚀 **HIGH** (Konsistente UX, Zukunftssicher)
