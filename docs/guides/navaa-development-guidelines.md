# 🚀 NAVAA DEVELOPMENT GUIDELINES

## Vollständige Standards für navaa.ai EdTech Platform

**Version:** 2.1 (Updated 2025-08-08)  
**Zielgruppe:** Alle Entwickler, Projektmanager, CTO/CPO  
**Prinzip:** Gesunder Menschenverstand + Bewährte Patterns

---

## 🎨 UI & Marketing Standards

Refer to the UI Styleguide for details: see `STYLEGUIDE.md` (Marketing Pages Standards, Image Usage).

### Typography & Components

- Use shared components from `components/ui/Typography.tsx`:
  - `<Heading variant="display|h1|h2|h3" as?>`
  - `<Text variant="body|small|micro|muted" as?>`
- Marketing sections in `components/sections/` MUST use `Heading`/`Text`.
- No raw `<h*>`/`<p>` in new marketing components.

### Images (Next.js)

- Use `next/image` exclusively; no `<img>`.
- Heroes (above-the-fold): set `priority` and accurate `sizes`.
- Below-the-fold images: omit `priority`.
- Prefer `fill` with sized parent + `object-cover`/`object-contain`.
- Assets live in `public/assets/` with descriptive names; always provide `alt`.

### CTA Buttons

- Primary: `inline-flex items-center px-8 py-3 rounded-lg font-semibold bg-[#009e82] text-white hover:bg-[#007a66] transition-colors`.

### Reviewer Checklist (UI)

- [ ] Uses `Heading`/`Text` for titles/copy (no raw headings/paragraphs)
- [ ] No `<img>`; `next/image` with proper `sizes` and `priority` only for heroes
- [ ] Long copy uses `leading-relaxed`; text width constrained where needed
- [ ] CTAs follow primary style; consistent spacing

---

## 📋 NAVIGATION & QUICK LINKS

### **🎯 UNIVERSAL PRINCIPLES**

- [Stability First](#-stability-first-principles)
- [Security First](#-security-first-principles)
- [Lean Development](#-lean-development-approach)

### **🛡️ TECHNICAL STANDARDS**

- [Authentication & Security](#-authentication--security-standards)
- [Routing & Navigation](#-routing--navigation-standards)
- [React & Frontend](#-react--frontend-standards)
- [Database Standards](#-database-standards)

### **🚨 OPERATIONS**

- [Incident Response](#-incident-response-protocols)
- [User Data Management](#-user-data-standards)
- [Deployment & Migration](#-deployment--migration-standards)

---

## 🎯 UNIVERSAL PRINCIPLES

### **STABILITY FIRST PRINCIPLES**

```typescript
// ✅ VOR jeder Änderung prüfen:
1. Ist das Feature aktuell funktionsfähig? ✅/❌
2. Ist die Änderung wirklich notwendig? ✅/❌
3. Kann das Problem isoliert gelöst werden? ✅/❌
4. Gibt es einen sicheren Rollback-Plan? ✅/❌

// ❌ NIEMALS: Funktionierende Features ohne klaren Grund ändern
// ❌ NIEMALS: "Vorsichtshalber" komplette Architektur umbauen
```

### **SECURITY FIRST PRINCIPLES**

- **Keine Kompromisse** bei der Sicherheit
- **JWT-basierte Authentication** für alle internen APIs
- **Role-based Access Control** (RBAC) durchgängig
- **Principle of Least Privilege** - minimale notwendige Rechte

### **LEAN DEVELOPMENT APPROACH**

**Funktioniert es? Ist es wartbar? Ist es sicher? → Gut!**

- **Gesunder Menschenverstand** vor Overengineering
- **Bewährte Patterns** vor experimentellen Lösungen
- **Schnelle Iteration** mit sicheren Rollback-Strategien

---

## 🛡️ AUTHENTICATION & SECURITY STANDARDS

### **MANDATORY: Supabase Auth Context**

```typescript
// ✅ IMMER verwenden:
import { useAuth } from '@/lib/hooks/useAuth';

const MyComponent = () => {
  const { user, getAccessToken, isAuthenticated, isAdmin } = useAuth();

  // ✅ KORREKT: JWT Token für API-Calls
  const token = getAccessToken();
  if (!token) return <LoginRequired />;

  const response = await fetch('/api/endpoint', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};
```

### **❌ VERBOTEN: Direct Supabase Client**

```typescript
// ❌ NIEMALS im Frontend:
import { supabase } from '@/lib/supabase';
const { data } = await supabase.auth.getSession(); // SECURITY RISK!

// ❌ NIEMALS: RLS-Workarounds
const { data } = await supabase.from('admin_table').select('*'); // Umgeht RLS!
```

### **✅ KORREKT: Admin-API Pattern**

```typescript
// ✅ Admin-Funktionen über sichere APIs:
const response = await fetch('/api/admin/save-data', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
});
```

### **SECRET SCANNING & ENV HANDLING (MANDATORY)**

- **Nie Secrets committen**: API-Keys, Tokens, Passwörter gehören in `.env*` (gitignored) oder in CI/CD Secrets.
- **Client-seitig nur `NEXT_PUBLIC_*`**: Keine Server-Secrets im Browser. Kein `env`-Block in `next.config.js` für Secrets.
- **Gitleaks in CI**: Jeder PR/Push wird mit `.gitleaks.toml` gescannt; Findings blocken den Merge.
- **Bei Fund**: Stelle entfernen, Schlüssel rotieren, optional Allowlist/Baseline für False Positives anpassen, PR erneut prüfen.
- **Logging**: Nie Secrets loggen; Debug-Logs nur in `NODE_ENV==='development'` und ohne geheime Werte.

---

## 🛡️ ROUTING & NAVIGATION STANDARDS

### **UNIFIED GUARD PATTERN (MANDATORY)**

```typescript
// ✅ EIN Guard für die gesamte App
interface UnifiedGuardProps {
  children: React.ReactNode;

  // Authentication
  requireAuth?: boolean;
  allowedRoles?: UserRole[];

  // Subscription Tiers (Future-Proof)
  requiredTier?: 'free' | 'paid' | 'business';

  // Smart Routing
  requireOnboarding?: boolean;
  requireActiveEnrollment?: boolean;

  // Fallbacks
  upgradeRoute?: string;
  fallbackRoute?: string;
}

// ✅ VERWENDUNG: Konsistent überall
<UnifiedGuard requiredTier="paid">
  <PremiumFeature />
</UnifiedGuard>
```

### **SMART ROUTING PRINCIPLES**

```typescript
// ✅ ZENTRALE Routing-Logic
function calculateRoute(factors: RoutingFactors) {
  // 1. Onboarding Check (höchste Priorität)
  if (!factors.onboarding_completed && !factors.hasActiveEnrollments) {
    return { route: '/onboarding-new', reason: 'needs_onboarding' };
  }

  // 2. Subscription Tier Check
  if (!hasSubscriptionAccess(factors.subscription_tier, factors.requiredTier)) {
    return { route: `/upgrade/${factors.requiredTier}`, reason: 'needs_upgrade' };
  }

  // 3. Allow Access
  return { route: 'allow', reason: 'access_granted' };
}
```

> Hinweis: Wenn `user_profiles` ein Ablaufdatum für temporäre/Test-Accounts verwendet, muss `expires_at` im Interface (`expiresAt?: string`) und in allen Selects/Mappings (z. B. `AuthContext.loadUserProfile()`) enthalten sein. Siehe `manual-migration.sql`.

### **REDIRECT LOOP PREVENTION**

```typescript
// ✅ MANDATORY: Loop Detection
const MAX_REDIRECTS = 3;
const redirectHistory = useRef<string[]>([]);

function preventRedirectLoop(targetRoute: string) {
  if (redirectHistory.current.length >= MAX_REDIRECTS) {
    console.error('Redirect loop detected:', redirectHistory.current);
    return '/'; // Fallback auf Homepage
  }

  redirectHistory.current.push(targetRoute);
  return targetRoute;
}
```

### **❌ ANTI-PATTERNS**

```typescript
// ❌ NIEMALS: Multiple Guards für dieselbe Logic
<DashboardGuard>
  <OnboardingGuard>
    <CourseGuard>
      <Component /> // Führt zu Konflikten!
    </CourseGuard>
  </OnboardingGuard>
</DashboardGuard>

// ❌ NIEMALS: Verteilte Routing-Entscheidungen
if (needsOnboarding) router.push('/onboarding');  // In Component A
if (needsDashboard) router.push('/dashboard');    // In Component B
// → Widersprüchliche Redirects!
```

---

## ⚡ REACT & FRONTEND STANDARDS

### **USEEFFECT GUIDELINES (MANDATORY)**

```typescript
// ✅ KORREKTE useEffect Patterns
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const router = useRouter();

useEffect(() => {
  async function checkUserStatus() {
    if (checkingUserStatus) return; // Prevent multiple calls
    setCheckingUserStatus(true);

    try {
      const userData = await fetchUserData();
      setUser(userData);

      // ✅ Routing Logic OHNE router in Dependencies
      if (!userData.onboarding_completed) {
        router.push('/onboarding-new');
      }
    } finally {
      setLoading(false);
      setCheckingUserStatus(false);
    }
  }

  checkUserStatus();
}, []); // ✅ NIEMALS router in Dependencies!

// ❌ ANTI-PATTERN: Router in Dependencies
useEffect(() => {
  // Logic...
}, [router]); // ❌ Führt zu infinite loops!
```

### **LOADING STATE MANAGEMENT**

```typescript
// ✅ ROBUSTE Loading States
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const timeoutRef = useRef(null);

useEffect(() => {
  // ✅ Loading Timeout (max 10 Sekunden)
  timeoutRef.current = setTimeout(() => {
    if (loading) {
      setError('Loading timeout - please refresh');
      setLoading(false);
    }
  }, 10000);

  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
}, [loading]);

// ✅ Loading UI mit Fallback
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Lade navaa.ai...</p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
```

### **API CALL DEDUPLICATION**

```typescript
// ✅ PREVENT redundante API-Calls
const apiCallCache = useRef(new Map());
const pendingCalls = useRef(new Set());

async function fetchUserData() {
  const cacheKey = 'user-data';

  // Check cache first
  if (apiCallCache.current.has(cacheKey)) {
    return apiCallCache.current.get(cacheKey);
  }

  // Prevent duplicate calls
  if (pendingCalls.current.has(cacheKey)) {
    return new Promise((resolve) => {
      const checkPending = () => {
        if (!pendingCalls.current.has(cacheKey)) {
          resolve(apiCallCache.current.get(cacheKey));
        } else {
          setTimeout(checkPending, 100);
        }
      };
      checkPending();
    });
  }

  pendingCalls.current.add(cacheKey);

  try {
    const data = await api.getUserData();
    apiCallCache.current.set(cacheKey, data);
    return data;
  } finally {
    pendingCalls.current.delete(cacheKey);
  }
}
```

### **ERROR HANDLING PATTERN**

```typescript
// ✅ Konsistentes Error Handling
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
```

---

## 🗄️ DATABASE STANDARDS

### **TABELLENNAMEN NIEMALS RATEN!**

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
ls database/migrations/*.sql
grep "CREATE TABLE" database/migrations/*.sql

// 3. Oder importiere DB-Typen (falls vorhanden):
import { Database } from '@/types/database';
type TableName = keyof Database['public']['Tables'];
```

### **DATENBANK-FIRST APPROACH**

```bash
# ✅ BEVOR du eine API schreibst:
# 1. Prüfe existierende APIs mit ähnlicher Funktionalität
find pages/api -name "*multiple*" -o -name "*question*"

# 2. Schaue dir deren Tabellennamen an
grep -n ".from('" pages/api/admin/generate-multiple-choice.ts

# 3. Verwende EXAKT denselben Namen
# Kein "foundation_" wenn es "case_" heißt!
```

### **SICHERE MIGRATIONEN**

```sql
-- ✅ Sichere Migration-Patterns
-- 1. Spalte hinzufügen (mit Default)
ALTER TABLE existing_table
ADD COLUMN IF NOT EXISTS new_column TEXT DEFAULT 'default_value';

-- 2. Spalte umbenennen (mit Backup)
ALTER TABLE existing_table
RENAME COLUMN old_name TO new_name;

-- 3. Rollback vorbereiten
-- ALTER TABLE existing_table RENAME COLUMN new_name TO old_name;
-- ALTER TABLE existing_table DROP COLUMN IF EXISTS new_column;
```

---

## 👤 USER DATA STANDARDS

### **SCHEMA SYNCHRONIZATION (MANDATORY)**

```typescript
// ✅ NACH jeder DB-Migration:
// 1. Interface aktualisieren
interface UserProfile {
  id: string;
  email: string;
  first_name: string; // ✅ DB-Schema matchen
  last_name: string;
  onboarding_completed: boolean; // ✅ Neue Felder hinzufügen
  login_count: number;
  subscription_tier: 'free' | 'paid' | 'business';
}

// 2. AuthContext Mapping aktualisieren
const mapProfileData = (dbData: any): UserProfile => ({
  id: dbData.id,
  email: dbData.email,
  firstName: dbData.first_name, // ✅ camelCase Mapping
  lastName: dbData.last_name,
  onboardingCompleted: dbData.onboarding_completed,
  loginCount: dbData.login_count,
  subscriptionTier: dbData.subscription_tier || 'free',
});

// 3. Alle neuen Felder in AuthContext laden
const { data: profile } = await supabase
  .from('user_profiles')
  .select('*') // ✅ Alle Felder laden
  .eq('id', user.id)
  .single();
```

### **NAMING CONVENTION STANDARDS**

```typescript
// ✅ KONSISTENTE Mappings
const FIELD_MAPPINGS = {
  // Database (snake_case) → Frontend (camelCase)
  first_name: 'firstName',
  last_name: 'lastName',
  onboarding_completed: 'onboardingCompleted',
  login_count: 'loginCount',
  subscription_tier: 'subscriptionTier',
  created_at: 'createdAt',
  updated_at: 'updatedAt',
};

// ✅ Automatisches Mapping
function mapDbToFrontend(dbData: Record<string, any>) {
  const mapped: Record<string, any> = {};

  Object.entries(dbData).forEach(([key, value]) => {
    const frontendKey = FIELD_MAPPINGS[key] || key;
    mapped[frontendKey] = value;
  });

  return mapped;
}
```

---

## 🚨 INCIDENT RESPONSE PROTOCOLS

### **PROBLEM ISOLATION STRATEGY**

```typescript
// ✅ DEBUGGING-PROTOKOLL:
1. **Symptom identifizieren:** Was genau funktioniert nicht?
2. **Scope eingrenzen:** Welche Komponenten sind betroffen?
3. **Root Cause finden:** Warum tritt das Problem auf?
4. **Minimaler Fix:** Kleinste mögliche Änderung
5. **Regression Test:** Funktioniert alles andere noch?

// ❌ ANTI-PATTERN: "Shotgun Debugging"
// Viele Änderungen gleichzeitig → Ursache unklar
```

### **ROLLBACK STRATEGIES**

```bash
# ✅ SICHERE Rollback-Methoden:

# 1. Einzelne Commits rückgängig machen
git revert [COMMIT_ID]  # Sicher, behält History

# 2. Feature-Branch zurücksetzen
git reset --hard [SAFE_COMMIT]  # Nur in Feature-Branches!

# ❌ GEFÄHRLICH: Git Reset in komplexen Strukturen
git reset --hard HEAD~5  # Kann veraltete Imports zurückbringen!
```

### **EMERGENCY PROTOCOLS**

```typescript
// ✅ Bei kritischen Production-Problemen:
1. **Sofortiger Rollback:** < 5 Minuten
2. **Status Communication:** Team/CTO informieren
3. **Root Cause Analysis:** Nach Stabilisierung
4. **Prevention Measures:** Guidelines aktualisieren

// 🚨 CTO-ESCALATION bei:
- Production Down > 5 Minuten
- User-facing Errors
- Security-relevante Probleme
```

---

## 🚨 COMMON PITFALLS & ANTI-PATTERNS

### **SYSTEMATISCHE VERMEIDUNG WIEDERKEHRENDER PROBLEME**

#### **❌ API & FRONTEND SPRECHEN VERSCHIEDENE SPRACHEN**

```typescript
// ❌ PROBLEM: Änderungen in API-Struktur führen zu Frontend-Bugs
interface ApiResponse {
  first_name: string; // API ändert zu given_name
}

interface FrontendUser {
  firstName: string; // Frontend erwartet weiterhin first_name
}

// ✅ LÖSUNG: Gemeinsame Typschnittstelle
import { UserProfile } from '@/types/shared';

// API und Frontend verwenden dieselben Types
const mapApiToFrontend = (apiData: ApiUserProfile): UserProfile => ({
  id: apiData.id,
  firstName: apiData.first_name, // Explizites Mapping
  lastName: apiData.last_name,
});
```

#### **❌ UNKONTROLLIERTER ODER GETEILTER STATE**

```typescript
// ❌ PROBLEM: Direkte State-Mutation
const updateUser = (user) => {
  user.name = 'New Name'; // Mutiert Original!
  setUsers(users); // React erkennt Änderung nicht
};

// ✅ LÖSUNG: Immutable Patterns
const updateUser = (userId, newName) => {
  setUsers(
    users.map((user) =>
      user.id === userId
        ? { ...user, name: newName } // Neue Instanz
        : user,
    ),
  );
};

// ✅ ODER: structuredClone für Deep Copies
const updateComplexUser = (userId, updates) => {
  setUsers(
    users.map((user) => (user.id === userId ? { ...structuredClone(user), ...updates } : user)),
  );
};
```

#### **❌ MAGISCHE ZAHLEN UND STRINGS**

```typescript
// ❌ PROBLEM: Magic Values überall im Code
if (user.role === 'admin') {
  /* ... */
}
if (subscription.tier === 'paid') {
  /* ... */
}
if (timeout > 5000) {
  /* ... */
}

// ✅ LÖSUNG: Zentrale Konstanten
const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
} as const;

const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PAID: 'paid',
  BUSINESS: 'business',
} as const;

const TIMEOUTS = {
  API_CALL: 10000,
  USER_SESSION: 3600000,
  LOADING_STATE: 5000,
} as const;

// ✅ Verwendung mit TypeScript-Support
if (user.role === USER_ROLES.ADMIN) {
  /* ... */
}
if (subscription.tier === SUBSCRIPTION_TIERS.PAID) {
  /* ... */
}
```

#### **❌ FEHLENDES LOGGING**

```typescript
// ❌ PROBLEM: Fehler ohne Context
try {
  await saveUser(userData);
} catch (error) {
  console.log('Error'); // Nutzlos!
}

// ✅ LÖSUNG: Strukturiertes Logging
const logger = {
  error: (message: string, context: Record<string, any>) => {
    console.error(`[ERROR] ${message}`, {
      timestamp: new Date().toISOString(),
      ...context,
    });
  },
  info: (message: string, context?: Record<string, any>) => {
    console.info(`[INFO] ${message}`, context);
  },
};

// ✅ Verwendung mit Context
try {
  logger.info('Saving user profile', { userId: user.id });
  await saveUser(userData);
  logger.info('User profile saved successfully', { userId: user.id });
} catch (error) {
  logger.error('Failed to save user profile', {
    userId: user.id,
    error: error.message,
    userData: JSON.stringify(userData),
  });
}
```

#### **❌ KOMPONENTEN-WILDWUCHS**

```typescript
// ❌ PROBLEM: Ähnliche Komponenten mehrfach gebaut
<div className="bg-blue-500 text-white px-4 py-2 rounded">Save</div>
<div className="bg-green-500 text-white px-4 py-2 rounded">Submit</div>
<div className="bg-red-500 text-white px-4 py-2 rounded">Delete</div>

// ✅ LÖSUNG: Wiederverwendbare Komponenten
interface ButtonProps {
  variant: 'primary' | 'success' | 'danger';
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ variant, children, onClick }) => {
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600',
    success: 'bg-green-500 hover:bg-green-600',
    danger: 'bg-red-500 hover:bg-red-600'
  };

  return (
    <button
      className={`${variants[variant]} text-white px-4 py-2 rounded transition-colors`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// ✅ Verwendung
<Button variant="primary">Save</Button>
<Button variant="success">Submit</Button>
<Button variant="danger">Delete</Button>
```

#### **❌ INKONSISTENTE BENENNUNG**

```typescript
// ❌ PROBLEM: Verschiedene Naming-Patterns
const getUser = () => {
  /* ... */
};
const fetch_profile = () => {
  /* ... */
};
const loadCurrentUserData = () => {
  /* ... */
};

// ✅ LÖSUNG: Konsistente Naming Conventions
// Verben: get, fetch, load, save, update, delete
// Substantive: user, profile, data, config
// Pattern: [verb][Entity][Qualifier?]

const getUser = (id: string) => {
  /* ... */
};
const getUserProfile = (id: string) => {
  /* ... */
};
const getCurrentUser = () => {
  /* ... */
};

const saveUser = (user: User) => {
  /* ... */
};
const updateUserProfile = (id: string, updates: Partial<User>) => {
  /* ... */
};
const deleteUser = (id: string) => {
  /* ... */
};
```

#### **❌ KEINE FEATURE-TOGGLES**

```typescript
// ❌ PROBLEM: Features können nicht gezielt aktiviert/deaktiviert werden
const Dashboard = () => {
  return (
    <div>
      <OldDashboard />
      {/* Neue Version ist live für alle - riskant! */}
      <NewDashboard />
    </div>
  );
};

// ✅ LÖSUNG: Feature Flags
const FEATURE_FLAGS = {
  NEW_DASHBOARD: process.env.NEXT_PUBLIC_ENABLE_NEW_DASHBOARD === 'true',
  ADVANCED_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  BETA_FEATURES: process.env.NEXT_PUBLIC_BETA_MODE === 'true'
} as const;

const Dashboard = () => {
  return (
    <div>
      {FEATURE_FLAGS.NEW_DASHBOARD ? (
        <NewDashboard />
      ) : (
        <OldDashboard />
      )}

      {FEATURE_FLAGS.ADVANCED_ANALYTICS && (
        <AdvancedAnalytics />
      )}
    </div>
  );
};
```

#### **❌ TECHNISCHE SCHULDEN IGNORIEREN**

```typescript
// ❌ PROBLEM: "TODO: Fix this later" - wird nie gefixt
// TODO: Refactor this messy function
function messyLegacyFunction() {
  // 200 lines of spaghetti code
}

// ✅ LÖSUNG: Strukturiertes Technical Debt Management
/**
 * @deprecated Use newOptimizedFunction instead
 * @todo Migrate all usages by 2025-09-01
 * @debt HIGH - Performance bottleneck, affects user experience
 */
function legacyFunction() {
  console.warn('legacyFunction is deprecated, use newOptimizedFunction');
  // Legacy implementation
}

// Neue, bessere Implementation
function newOptimizedFunction() {
  // Clean, optimized code
}

// Migration-Helper
function migrateLegacyUsage() {
  // Automated migration logic
}
```

### **🎯 PITFALL PREVENTION CHECKLIST**

```typescript
// ✅ VOR jedem Feature-Development:
1. Sind alle Magic Values als Konstanten definiert? ✅/❌
2. Haben wir wiederverwendbare Komponenten geprüft? ✅/❌
3. Ist das Logging ausreichend für Debugging? ✅/❌
4. Sind API-Contracts mit Frontend synchron? ✅/❌
5. Verwenden wir Immutable State-Updates? ✅/❌
6. Sind Feature-Flags für riskante Änderungen gesetzt? ✅/❌
7. Folgen wir konsistenten Naming-Conventions? ✅/❌
8. Haben wir Technical Debt dokumentiert? ✅/❌
```

---

## 🛠️ TECH STACK & TOOLS

### **CORE STACK**

- **Next.js + TypeScript** für Type-Safety
- **Tailwind CSS** für konsistentes Styling
- **Supabase + RLS** für sichere Datenbank
- **Zod** für Input-Validation
- **Python + FastAPI** für Backend
- **Vercel** für Deployment

### **DEVELOPMENT TOOLS**

- **ESLint + Prettier** für Code-Qualität
- **Husky** für Git-Hooks
- **Jest + Testing Library** für Tests
- **Storybook** für Component-Dokumentation

---

## 🚀 DEPLOYMENT & MIGRATION STANDARDS

### **ZWECKMÄSSIGE ERWEITERUNGEN**

```typescript
// ✅ Neue Features hinzufügen (ohne Breaking Changes)
interface ExistingInterface {
  // Bestehende Felder
  id: string;
  name: string;

  // ✅ Neue optionale Felder
  newFeature?: string;
  enhancedData?: ComplexType;
}

// ✅ Backward-kompatible API-Erweiterungen
function enhancedFunction(
  requiredParam: string,
  options: {
    // Bestehende Options
    existingOption?: boolean;
    // ✅ Neue optionale Options
    newOption?: string;
  } = {},
) {
  // Implementation mit Fallbacks
}
```

### **MIGRATION BEST PRACTICES**

```typescript
// ✅ Schrittweise Migration-Strategie
1. **Analyse:** Bestehende Struktur verstehen
2. **Plan:** Migration in kleine Schritte aufteilen
3. **Test:** Jeden Schritt isoliert testen
4. **Deploy:** Schrittweise Ausrollen mit Rollback-Option
5. **Validate:** Funktionalität nach jedem Schritt prüfen
6. **Cleanup:** Alte Strukturen nach erfolgreicher Migration entfernen
```

---

## 📚 QUICK REFERENCE

### **🚨 NIEMALS (Aus echten Problemen gelernt)**

- **Keine RLS-Workarounds** → Immer Admin-APIs mit Service Role
- **Keine direkten Supabase-Calls** im Frontend für Admin-Funktionen
- **Keine Quick Fixes** → Root-Cause-Analyse
- **Keine hardcodierten Werte** → Konfigurierbare Lösungen
- **Kein State-Sharing** zwischen Cases/Entities
- **Keine unspezifischen Errors** → Detaillierte Fehlermeldungen
- **Keine Multiple Guards** → Unified Guard Pattern
- **Router nie in useEffect Dependencies** → Führt zu infinite loops

### **✅ IMMER (Bewährte Patterns)**

- **useAuth() Hook** für alle Auth-Operationen
- **JWT Bearer Token** für API-Authentifizierung
- **Unified Guard** für alle Route-Protection
- **Loading States mit Timeout** (max 10s)
- **Error Boundaries** für robuste UX
- **Schema-Sync** nach DB-Migrationen
- **Rollback-Plan** vor jeder Änderung

---

## 📝 CHANGELOG

### **Version 2.0 (2025-08-07)**

- **MAJOR:** Zusammenführung von navaa-lean-guidelines.md und navaa-auth-guidelines.md
- **NEW:** Routing & Navigation Standards (Unified Guard Pattern)
- **NEW:** Incident Response Protocols (basierend auf heutigen Lessons Learned)
- **NEW:** React & Frontend Standards (useEffect Guidelines, Loading States)
- **NEW:** User Data Standards (Schema Synchronization, Naming Conventions)
- **ENHANCED:** Database Standards (Tabellennamen-Validation, Migration Best Practices)
- **ENHANCED:** Security Standards (JWT-basierte Auth, RLS-Compliance)

### **Version 1.x (Legacy)**

- Separate navaa-lean-guidelines.md und navaa-auth-guidelines.md
- Grundlegende Tech-Stack und Code-Pattern Definitionen
- Basis-Security und Database-Standards

---

**📍 DOCUMENT STATUS:** ✅ ACTIVE - Master Guidelines für alle navaa.ai Development  
**👥 MAINTAINER:** Christian Maass (@christianmaass)  
**🔄 LAST UPDATED:** 2025-08-07 01:34 CET  
**📧 FEEDBACK:** Bei Fragen oder Verbesserungsvorschlägen → Issues oder direkte Kommunikation
