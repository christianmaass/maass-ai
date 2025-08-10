# 🎯 NAVAA AUTH REFACTORING PLAN

## Systematische Beseitigung des Bearer Token Chaos

---

## 📊 CURRENT STATE ANALYSIS

### 🚨 PROBLEMATIC PATTERNS IDENTIFIED:

#### **Pattern 1: User ID als Bearer Token (FALSCH)**

```typescript
// ❌ CURRENT (50+ Stellen):
'Authorization': `Bearer ${user?.id}` // TODO: Get proper access token
```

**Locations:**

- `components/foundation-manager/hooks/useFoundationCases.tsx:88`
- `components/foundation-manager/hooks/useCaseGeneration.tsx:58`
- `components/foundation-manager/hooks/useModuleState.tsx` (6x)
- `components/foundation-cases/FoundationStep.tsx` (15x)
- `components/foundation-cases/FoundationCaseContainer.tsx:66`
- `components/foundation-manager/StepRenderer.tsx` (3x)
- `pages/foundation-cases.tsx:35`
- `pages/foundation-cases/[caseId].tsx:38`

#### **Pattern 2: Session Access Token (INKONSISTENT)**

```typescript
// ⚠️ CURRENT (Admin-Bereich):
'Authorization': `Bearer ${session.access_token}`
```

**Locations:**

- `pages/admin/foundation-manager-old.tsx` (9x)
- `components/admin/UserManagement.tsx:81`

#### **Pattern 3: OpenAI API Keys (KORREKT)**

```typescript
// ✅ CURRENT (korrekt für externe APIs):
'Authorization': `Bearer ${openaiApiKey}`
```

**Locations:**

- `pages/api/rate-text.ts:37`
- `pages/api/foundation/submit.ts:116`
- `pages/api/openai-proxy.ts:23`

---

## 🎯 IDEALTYPISCHE ARCHITEKTUR

### **✅ TARGET STATE: Einheitliche Supabase Auth**

#### **1. Frontend Authentication:**

```typescript
// ✅ IDEAL: Supabase Session Management
const { data: { session }, error } = await supabase.auth.getSession();
const accessToken = session?.access_token; // JWT Token

// ✅ IDEAL: API Calls mit JWT
'Authorization': `Bearer ${accessToken}`
```

#### **2. Backend Authorization:**

```typescript
// ✅ IDEAL: JWT Verification
const authHeader = req.headers.authorization;
const token = authHeader?.replace('Bearer ', '');
const {
  data: { user },
  error,
} = await supabase.auth.getUser(token);
```

#### **3. User Context:**

```typescript
// ✅ IDEAL: Authenticated User Object
interface AuthenticatedUser {
  id: string; // UUID from auth.users
  email: string; // Email from auth.users
  role: string; // Role from user_profiles
  access_token: string; // JWT for API calls
}
```

---

## 🚀 REFACTORING PLAN

### **PHASE 1: Foundation Setup (Week 1)**

#### **Step 1.1: Supabase Auth Configuration**

- [ ] **SMTP Provider Setup** (SendGrid/Mailgun)
  - Configure email templates
  - Test email delivery
  - Set up custom domain

- [ ] **Auth Settings Optimization**
  - Enable email confirmations (with SMTP)
  - Configure password policies
  - Set up proper redirect URLs

#### **Step 1.2: Auth Context Refactoring**

- [ ] **Create Unified Auth Context**

  ```typescript
  // lib/contexts/AuthContext.tsx
  interface AuthState {
    user: AuthenticatedUser | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    getAccessToken: () => string | null;
  }
  ```

- [ ] **Create Auth Hooks**
  ```typescript
  // lib/hooks/useAuth.ts
  export const useAuth = () => {
    const context = useContext(AuthContext);
    return {
      ...context,
      isAuthenticated: !!context.user,
      isAdmin: context.user?.role === 'admin',
    };
  };
  ```

#### **Step 1.3: API Auth Middleware**

- [ ] **Create Auth Middleware**
  ```typescript
  // lib/middleware/auth.ts
  export const withAuth = (handler: NextApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const token = extractBearerToken(req);
      const user = await validateJWT(token);
      req.user = user; // Attach to request
      return handler(req, res);
    };
  };
  ```

### **PHASE 2: Frontend Refactoring (Week 2)**

#### **Step 2.1: Component Auth Refactoring**

**Priority Order (by usage frequency):**

1. **FoundationStep.tsx (15 occurrences)**

   ```typescript
   // ❌ BEFORE:
   'Authorization': `Bearer ${user?.id}`

   // ✅ AFTER:
   const { getAccessToken } = useAuth();
   'Authorization': `Bearer ${getAccessToken()}`
   ```

2. **Foundation Manager Hooks (10 occurrences)**
   - `useFoundationCases.tsx`
   - `useCaseGeneration.tsx`
   - `useModuleState.tsx`

3. **Admin Components (9 occurrences)**
   - `foundation-manager-old.tsx`
   - `UserManagement.tsx`

4. **Foundation Cases (5 occurrences)**
   - `FoundationCaseContainer.tsx`
   - `foundation-cases.tsx`
   - `[caseId].tsx`

#### **Step 2.2: Auth State Migration**

- [ ] **Replace AuthContext Usage**

  ```typescript
  // ❌ BEFORE:
  const { user } = useAuth(); // Returns user.id

  // ✅ AFTER:
  const { user, getAccessToken } = useAuth(); // Returns full auth state
  ```

### **PHASE 3: Backend Refactoring (Week 3)**

#### **Step 3.1: API Endpoint Refactoring**

**Priority Order:**

1. **Admin APIs (High Security)**
   - `/api/admin/*` - All admin endpoints
   - Implement proper JWT validation
   - Add role-based access control

2. **Foundation APIs (High Usage)**
   - `/api/foundation/*` - All foundation endpoints
   - User-specific data access
   - Proper authorization checks

3. **User APIs (Medium Priority)**
   - `/api/user/*` - User management
   - Profile updates
   - Account operations

#### **Step 3.2: Database Integration**

- [ ] **RLS Policy Updates**

  ```sql
  -- Enable RLS on all user tables
  ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

  -- Create JWT-based policies
  CREATE POLICY "Users can read own data" ON user_profiles
    FOR SELECT USING (auth.uid() = id);
  ```

### **PHASE 4: Testing & Validation (Week 4)**

#### **Step 4.1: Auth Flow Testing**

- [ ] **Login/Logout Flows**
- [ ] **Token Refresh Logic**
- [ ] **Session Persistence**
- [ ] **Role-based Access**

#### **Step 4.2: API Security Testing**

- [ ] **JWT Validation**
- [ ] **Unauthorized Access Prevention**
- [ ] **Token Expiration Handling**

---

## 📋 IMPLEMENTATION CHECKLIST

### **Critical Files to Refactor:**

#### **Frontend Components (Priority 1):**

- [ ] `components/foundation-cases/FoundationStep.tsx` (15x)
- [ ] `components/foundation-manager/hooks/useModuleState.tsx` (6x)
- [ ] `components/foundation-manager/hooks/useFoundationCases.tsx` (1x)
- [ ] `components/foundation-manager/hooks/useCaseGeneration.tsx` (1x)
- [ ] `components/foundation-cases/FoundationCaseContainer.tsx` (1x)
- [ ] `components/foundation-manager/StepRenderer.tsx` (3x)

#### **Admin Components (Priority 2):**

- [ ] `pages/admin/foundation-manager-old.tsx` (9x)
- [ ] `components/admin/UserManagement.tsx` (1x)

#### **Page Components (Priority 3):**

- [ ] `pages/foundation-cases.tsx` (1x)
- [ ] `pages/foundation-cases/[caseId].tsx` (1x)

#### **API Endpoints (Priority 4):**

- [ ] All `/api/admin/*` endpoints
- [ ] All `/api/foundation/*` endpoints
- [ ] All `/api/user/*` endpoints

---

## 🎯 SUCCESS METRICS

### **Technical Metrics:**

- [ ] **Zero `user.id` as Bearer Token** usage
- [ ] **100% JWT-based authentication** for internal APIs
- [ ] **Consistent auth patterns** across codebase
- [ ] **Zero TODO comments** related to auth

### **Security Metrics:**

- [ ] **Proper token validation** on all endpoints
- [ ] **Role-based access control** implemented
- [ ] **Session management** working correctly
- [ ] **No unauthorized access** possible

### **Developer Experience:**

- [ ] **Single auth hook** for all components
- [ ] **Consistent API patterns** for auth
- [ ] **Clear documentation** for auth usage
- [ ] **Easy testing** of auth flows

---

## ⚠️ RISKS & MITIGATION

### **High Risk:**

- **Breaking existing functionality** → Gradual rollout with feature flags
- **User session disruption** → Maintain backward compatibility during transition
- **API downtime** → Deploy during low-usage hours

### **Medium Risk:**

- **Performance impact** → Optimize JWT validation
- **Complex testing** → Automated auth flow tests
- **Team coordination** → Clear communication and documentation

---

## 🚀 NEXT STEPS

1. **Decision:** Approve this refactoring plan
2. **Setup:** Configure Supabase Auth properly (SMTP, settings)
3. **Start:** Begin with Phase 1 (Foundation Setup)
4. **Monitor:** Track progress with success metrics
5. **Deploy:** Gradual rollout with proper testing

**Estimated Total Effort:** 3-4 weeks
**Team Impact:** High (requires coordination)
**Business Value:** High (security, maintainability, scalability)
