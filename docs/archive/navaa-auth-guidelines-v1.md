# 🛡️ NAVAA AUTHENTICATION GUIDELINES

## Verbindliche Standards für sichere und einheitliche Authentifizierung

---

## 📋 GRUNDPRINZIPIEN

### **1. SECURITY FIRST**

- **Keine Kompromisse** bei der Sicherheit
- **JWT-basierte Authentication** für alle internen APIs
- **Role-based Access Control** (RBAC) durchgängig
- **Principle of Least Privilege** - minimale notwendige Rechte

### **2. CONSISTENCY**

- **Ein Auth-System** für die gesamte Anwendung
- **Einheitliche Patterns** in Frontend und Backend
- **Standardisierte Error-Handling** für Auth-Fehler
- **Konsistente Naming Conventions**

### **3. DEVELOPER EXPERIENCE**

- **Einfache APIs** für Entwickler
- **Klare Dokumentation** und Beispiele
- **Automated Testing** für Auth-Flows
- **Debugging-freundliche** Implementierung

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

## 🚨 INCIDENT RESPONSE PROTOCOLS

### **STABILITY FIRST CHECKS (MANDATORY)**

```typescript
// ✅ VOR jeder Änderung prüfen:
1. Ist das Feature aktuell funktionsfähig? ✅/❌
2. Ist die Änderung wirklich notwendig? ✅/❌
3. Kann das Problem isoliert gelöst werden? ✅/❌
4. Gibt es einen sicheren Rollback-Plan? ✅/❌

// ❌ NIEMALS: Funktionierende Features ohne klaren Grund ändern
// ❌ NIEMALS: "Vorsichtshalber" komplette Architektur umbauen
```

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

## ⚡ REACT DEVELOPMENT STANDARDS

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

## 🎯 TECHNISCHE STANDARDS

### **FRONTEND AUTHENTICATION**

#### **✅ MANDATORY: Supabase Auth Context**

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

#### **❌ VERBOTEN: Direkte User-ID als Token**

```typescript
// ❌ NIEMALS:
'Authorization': `Bearer ${user?.id}` // User ID ist kein JWT!

// ❌ NIEMALS:
'Authorization': `Bearer ${user.email}` // Email ist kein Token!

// ❌ NIEMALS:
headers: { userId: user.id } // Custom Headers für Auth
```

#### **✅ PFLICHT: Error Handling**

```typescript
// ✅ IMMER implementieren:
const { user, getAccessToken, signOut } = useAuth();

const makeAuthenticatedRequest = async () => {
  const token = getAccessToken();

  if (!token) {
    // Redirect to login
    router.push('/login');
    return;
  }

  try {
    const response = await fetch('/api/endpoint', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 401) {
      // Token expired - force re-login
      await signOut();
      router.push('/login');
      return;
    }

    // Handle other errors...
  } catch (error) {
    console.error('Auth request failed:', error);
  }
};
```

### **BACKEND AUTHENTICATION**

#### **✅ MANDATORY: JWT Validation Middleware**

```typescript
// ✅ IMMER verwenden:
import { withAuth } from '@/lib/middleware/auth';

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  // req.user ist automatisch verfügbar und validiert
  const userId = req.user.id;
  const userRole = req.user.role;

  // Business Logic hier...
};

export default withAuth(handler);
```

#### **✅ PFLICHT: Role-based Access Control**

```typescript
// ✅ IMMER prüfen:
import { withAuth, requireRole } from '@/lib/middleware/auth';

// Nur für Admins
export default withAuth(requireRole('admin')(handler));

// Für mehrere Rollen
export default withAuth(requireRole(['admin', 'moderator'])(handler));

// Custom Authorization Logic
const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.user.role !== 'admin' && req.user.id !== req.body.userId) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  // Authorized logic...
};
```

#### **❌ VERBOTEN: Manuelle Token-Extraktion**

```typescript
// ❌ NIEMALS:
const token = req.headers.authorization?.replace('Bearer ', '');
const user = await supabase.auth.getUser(token); // Manuell validieren

// ❌ NIEMALS:
const userId = req.headers['x-user-id']; // Custom Headers

// ❌ NIEMALS:
if (!req.body.adminSecret === 'secret123') // Hardcoded Secrets
```

---

## 🔐 SECURITY REQUIREMENTS

### **1. TOKEN MANAGEMENT**

#### **✅ JWT Tokens (Supabase)**

- **Verwendung:** Alle internen API-Calls
- **Format:** `Bearer ${supabaseJWT}`
- **Validation:** Automatisch durch Middleware
- **Expiration:** Supabase-Standard (1 Stunde)

#### **✅ Refresh Token Handling**

```typescript
// ✅ AUTOMATISCH durch Supabase:
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    // Token automatisch aktualisiert
    console.log('Token refreshed:', session?.access_token);
  }
});
```

### **2. ROLE DEFINITIONS**

#### **Standard User Roles:**

```typescript
type UserRole =
  | 'user' // Standard-Nutzer
  | 'test_user' // Temporäre Test-Accounts
  | 'moderator' // Content-Moderation
  | 'admin' // Vollzugriff
  | 'super_admin'; // System-Administration

// ✅ PFLICHT: Role-Hierarchie beachten
const roleHierarchy = {
  user: 0,
  test_user: 0,
  moderator: 1,
  admin: 2,
  super_admin: 3,
};
```

### **3. API ENDPOINT SECURITY**

#### **✅ Security Headers (PFLICHT)**

```typescript
// ✅ IMMER setzen:
res.setHeader('X-Content-Type-Options', 'nosniff');
res.setHeader('X-Frame-Options', 'DENY');
res.setHeader('X-XSS-Protection', '1; mode=block');
res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
```

#### **✅ Rate Limiting (PFLICHT)**

```typescript
// ✅ IMMER für Auth-Endpoints:
import { withRateLimit } from '@/lib/middleware/rateLimit';

export default withAuth(withRateLimit({ maxRequests: 10, windowMs: 60000 })(handler));
```

---

## 📝 NAMING CONVENTIONS

### **✅ CONSISTENT NAMING**

#### **Auth Context & Hooks:**

```typescript
// ✅ STANDARD:
useAuth(); // Main auth hook
useAuthGuard(); // Route protection
usePermissions(); // Role-based permissions
AuthProvider; // Context provider
AuthGuard; // Component wrapper
```

#### **API Endpoints:**

```typescript
// ✅ STANDARD:
/api/auth/login     // User login
/api/auth/logout    // User logout
/api/auth/refresh   // Token refresh
/api/auth/me        // Current user info

// ✅ PROTECTED ENDPOINTS:
/api/user/*         // User-specific data
/api/admin/*        // Admin-only endpoints
/api/public/*       // No auth required
```

#### **Error Messages:**

```typescript
// ✅ STANDARD Error Codes:
const AUTH_ERRORS = {
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Insufficient permissions',
  TOKEN_EXPIRED: 'Session expired, please login again',
  INVALID_TOKEN: 'Invalid authentication token',
  ROLE_REQUIRED: 'Admin access required',
} as const;
```

---

## 🧪 TESTING REQUIREMENTS

### **✅ MANDATORY TESTS**

#### **Frontend Auth Tests:**

```typescript
// ✅ PFLICHT für jede Auth-Component:
describe('AuthenticatedComponent', () => {
  it('redirects to login when not authenticated', () => {
    // Test implementation
  });

  it('renders content when authenticated', () => {
    // Test implementation
  });

  it('handles token expiration gracefully', () => {
    // Test implementation
  });
});
```

#### **Backend Auth Tests:**

```typescript
// ✅ PFLICHT für jede Protected API:
describe('/api/protected-endpoint', () => {
  it('returns 401 without token', () => {
    // Test implementation
  });

  it('returns 403 with insufficient role', () => {
    // Test implementation
  });

  it('processes request with valid token', () => {
    // Test implementation
  });
});
```

---

## 📚 DOCUMENTATION REQUIREMENTS

### **✅ CODE DOCUMENTATION**

#### **Auth Functions:**

````typescript
/**
 * Authenticates user and returns access token
 *
 * @param email - User email address
 * @param password - User password
 * @returns Promise<AuthResult> - Authentication result with token
 * @throws AuthError - When credentials are invalid
 *
 * @example
 * ```typescript
 * const result = await signIn('user@example.com', 'password');
 * if (result.success) {
 *   console.log('Token:', result.token);
 * }
 * ```
 */
export const signIn = async (email: string, password: string): Promise<AuthResult> => {
  // Implementation
};
````

### **✅ API DOCUMENTATION**

```typescript
/**
 * @api {POST} /api/admin/users Create User
 * @apiName CreateUser
 * @apiGroup Admin
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Bearer JWT token
 *
 * @apiParam {String} email User email
 * @apiParam {String} first_name User first name
 * @apiParam {String} last_name User last name
 * @apiParam {String} role User role (user|admin)
 *
 * @apiSuccess {String} id User ID
 * @apiSuccess {String} email User email
 * @apiSuccess {String} created_at Creation timestamp
 *
 * @apiError (401) Unauthorized Missing or invalid token
 * @apiError (403) Forbidden Insufficient permissions
 */
```

---

## ⚠️ COMPLIANCE & SECURITY

### **✅ DSGVO COMPLIANCE**

- **Datenminimierung:** Nur notwendige User-Daten speichern
- **Einwilligung:** Explizite Zustimmung zur Datenverarbeitung
- **Löschrecht:** User können Account löschen
- **Datenportabilität:** User-Daten exportierbar

### **✅ SECURITY MONITORING**

```typescript
// ✅ PFLICHT: Security Events loggen
const logSecurityEvent = (event: SecurityEvent) => {
  console.log(`[SECURITY] ${event.type}: ${event.message}`, {
    userId: event.userId,
    ip: event.ip,
    timestamp: new Date().toISOString(),
    userAgent: event.userAgent,
  });
};

// Events to log:
// - Failed login attempts
// - Unauthorized API access
// - Role escalation attempts
// - Token manipulation
```

---

## 🚀 MIGRATION STRATEGY

### **✅ GRADUAL ROLLOUT**

#### **Phase 1: Foundation (Week 1)**

- [ ] Implement unified Auth Context
- [ ] Create auth middleware
- [ ] Set up proper Supabase configuration

#### **Phase 2: Frontend Migration (Week 2)**

- [ ] Migrate high-priority components
- [ ] Update auth patterns
- [ ] Add comprehensive testing

#### **Phase 3: Backend Migration (Week 3)**

- [ ] Migrate API endpoints
- [ ] Implement role-based access
- [ ] Add security monitoring

#### **Phase 4: Validation (Week 4)**

- [ ] End-to-end testing
- [ ] Security audit
- [ ] Performance optimization

---

## 📋 CHECKLIST FÜR ENTWICKLER

### **✅ BEFORE CODING:**

- [ ] Auth-Guidelines gelesen und verstanden
- [ ] Rolle und Permissions für Feature definiert
- [ ] Security-Anforderungen geklärt

### **✅ DURING DEVELOPMENT:**

- [ ] Unified Auth Context verwendet
- [ ] JWT-basierte API-Calls implementiert
- [ ] Error Handling für Auth-Fehler
- [ ] Role-based Access Control geprüft

### **✅ BEFORE DEPLOYMENT:**

- [ ] Auth-Tests geschrieben und bestanden
- [ ] Security Review durchgeführt
- [ ] Documentation aktualisiert
- [ ] Code Review mit Auth-Focus

---

## 🎯 ENFORCEMENT

### **✅ CODE REVIEW REQUIREMENTS**

- **Jeder PR** mit Auth-Änderungen braucht Security-Review
- **Automated Tests** müssen Auth-Szenarien abdecken
- **Linting Rules** für Auth-Patterns aktiviert
- **Documentation** muss aktuell sein

### **✅ MONITORING & ALERTS**

- **Failed Auth Attempts** → Slack Alert
- **Unauthorized Access** → Email Alert
- **Token Manipulation** → Security Team Alert
- **Performance Issues** → DevOps Alert

---

**Diese Guidelines sind verbindlich für alle navaa-Entwickler und müssen bei jeder Auth-Implementation befolgt werden.**

**Version:** 1.0  
**Letzte Aktualisierung:** 2025-01-04  
**Nächste Review:** 2025-04-04
