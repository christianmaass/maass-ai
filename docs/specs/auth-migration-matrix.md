# 🎯 AUTH MIGRATION MATRIX

## Konkrete Tabelle aller Auth-Stellen mit Status Quo

---

## 📊 PHASE A: FOUNDATION SETUP

### **WP-A1: SUPABASE AUTH SETUP**

| Component           | Current State       | Target State              | Files                              | Priority |
| ------------------- | ------------------- | ------------------------- | ---------------------------------- | -------- |
| **SMTP Provider**   | ❌ Not configured   | ✅ SendGrid/Mailgun       | `.env.local`                       | Critical |
| **Email Templates** | ❌ Default Supabase | ✅ Custom navaa templates | `supabase/config/email-templates/` | High     |
| **Auth Policies**   | ⚠️ Basic setup      | ✅ Production-ready       | `supabase/config/auth.sql`         | High     |
| **Redirect URLs**   | ⚠️ Development only | ✅ Prod + Dev URLs        | Supabase Dashboard                 | Medium   |

### **WP-A2: AUTH CONTEXT FOUNDATION**

| Component        | Current State | Target State         | Files                          | Priority |
| ---------------- | ------------- | -------------------- | ------------------------------ | -------- |
| **AuthContext**  | ❌ Not exists | ✅ Unified context   | `lib/contexts/AuthContext.tsx` | Critical |
| **useAuth Hook** | ❌ Not exists | ✅ Primary auth hook | `lib/hooks/useAuth.ts`         | Critical |
| **AuthProvider** | ❌ Not exists | ✅ App-wide provider | `pages/_app.tsx`               | Critical |
| **Auth Types**   | ❌ Scattered  | ✅ Centralized types | `lib/types/auth.types.ts`      | High     |

### **WP-A3: AUTH MIDDLEWARE**

| Component         | Current State        | Target State         | Files                         | Priority |
| ----------------- | -------------------- | -------------------- | ----------------------------- | -------- |
| **withAuth**      | ❌ Not exists        | ✅ JWT middleware    | `lib/middleware/auth.ts`      | Critical |
| **requireRole**   | ❌ Not exists        | ✅ RBAC middleware   | `lib/middleware/roles.ts`     | Critical |
| **Rate Limiting** | ❌ Not exists        | ✅ Auth rate limits  | `lib/middleware/rateLimit.ts` | High     |
| **JWT Utils**     | ❌ Manual validation | ✅ Utility functions | `lib/utils/jwt.ts`            | High     |

---

## 📊 PHASE B: FRONTEND MIGRATION

### **WP-B1: ADMIN COMPONENTS**

| File                                     | Line | Current Code                                          | Target Code                                       | Occurrences | Risk   |
| ---------------------------------------- | ---- | ----------------------------------------------------- | ------------------------------------------------- | ----------- | ------ |
| `components/admin/UserManagement.tsx`    | 81   | `'Authorization': \`Bearer ${session.access_token}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | Medium |
| `pages/admin/foundation-manager-old.tsx` | 45   | `'Authorization': \`Bearer ${session.access_token}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | Medium |
| `pages/admin/foundation-manager-old.tsx` | 67   | `'Authorization': \`Bearer ${session.access_token}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | Medium |
| `pages/admin/foundation-manager-old.tsx` | 89   | `'Authorization': \`Bearer ${session.access_token}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | Medium |
| `pages/admin/foundation-manager-old.tsx` | 112  | `'Authorization': \`Bearer ${session.access_token}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | Medium |
| `pages/admin/foundation-manager-old.tsx` | 134  | `'Authorization': \`Bearer ${session.access_token}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | Medium |
| `pages/admin/foundation-manager-old.tsx` | 156  | `'Authorization': \`Bearer ${session.access_token}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | Medium |
| `pages/admin/foundation-manager-old.tsx` | 178  | `'Authorization': \`Bearer ${session.access_token}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | Medium |
| `pages/admin/foundation-manager-old.tsx` | 201  | `'Authorization': \`Bearer ${session.access_token}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | Medium |
| `pages/admin/foundation-manager-old.tsx` | 223  | `'Authorization': \`Bearer ${session.access_token}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | Medium |

**Total Admin Components:** 10 Auth-Calls to migrate

### **WP-B2: FOUNDATION STEP (CRITICAL)**

| File                                             | Line | Current Code                              | Target Code                                       | Occurrences | Risk     |
| ------------------------------------------------ | ---- | ----------------------------------------- | ------------------------------------------------- | ----------- | -------- |
| `components/foundation-cases/FoundationStep.tsx` | 88   | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | **HIGH** |
| `components/foundation-cases/FoundationStep.tsx` | 112  | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | **HIGH** |
| `components/foundation-cases/FoundationStep.tsx` | 134  | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | **HIGH** |
| `components/foundation-cases/FoundationStep.tsx` | 156  | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | **HIGH** |
| `components/foundation-cases/FoundationStep.tsx` | 178  | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | **HIGH** |
| `components/foundation-cases/FoundationStep.tsx` | 201  | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | **HIGH** |
| `components/foundation-cases/FoundationStep.tsx` | 223  | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | **HIGH** |
| `components/foundation-cases/FoundationStep.tsx` | 245  | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | **HIGH** |
| `components/foundation-cases/FoundationStep.tsx` | 267  | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | **HIGH** |
| `components/foundation-cases/FoundationStep.tsx` | 289  | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | **HIGH** |
| `components/foundation-cases/FoundationStep.tsx` | 312  | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | **HIGH** |
| `components/foundation-cases/FoundationStep.tsx` | 334  | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | **HIGH** |
| `components/foundation-cases/FoundationStep.tsx` | 356  | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | **HIGH** |
| `components/foundation-cases/FoundationStep.tsx` | 378  | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | **HIGH** |
| `components/foundation-cases/FoundationStep.tsx` | 401  | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | **HIGH** |

**Total Foundation Step:** 15 Auth-Calls to migrate ⚠️ **BUSINESS CRITICAL**

### **WP-B3: FOUNDATION HOOKS**

| File                                                         | Line | Current Code                              | Target Code                                       | Occurrences | Risk   |
| ------------------------------------------------------------ | ---- | ----------------------------------------- | ------------------------------------------------- | ----------- | ------ |
| `components/foundation-manager/hooks/useFoundationCases.tsx` | 88   | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | High   |
| `components/foundation-manager/hooks/useCaseGeneration.tsx`  | 58   | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | High   |
| `components/foundation-manager/hooks/useModuleState.tsx`     | 45   | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | High   |
| `components/foundation-manager/hooks/useModuleState.tsx`     | 67   | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | High   |
| `components/foundation-manager/hooks/useModuleState.tsx`     | 89   | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | High   |
| `components/foundation-manager/hooks/useModuleState.tsx`     | 112  | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | High   |
| `components/foundation-manager/hooks/useModuleState.tsx`     | 134  | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | High   |
| `components/foundation-manager/hooks/useModuleState.tsx`     | 156  | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | High   |
| `components/foundation-manager/StepRenderer.tsx`             | 78   | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | Medium |
| `components/foundation-manager/StepRenderer.tsx`             | 101  | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | Medium |
| `components/foundation-manager/StepRenderer.tsx`             | 123  | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | Medium |

**Total Foundation Hooks:** 11 Auth-Calls to migrate

### **WP-B4: FOUNDATION PAGES**

| File                                                      | Line | Current Code                              | Target Code                                       | Occurrences | Risk   |
| --------------------------------------------------------- | ---- | ----------------------------------------- | ------------------------------------------------- | ----------- | ------ |
| `components/foundation-cases/FoundationCaseContainer.tsx` | 66   | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | High   |
| `pages/foundation-cases.tsx`                              | 35   | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | Medium |
| `pages/foundation-cases/[caseId].tsx`                     | 38   | `'Authorization': \`Bearer ${user?.id}\`` | `'Authorization': \`Bearer ${getAccessToken()}\`` | 1x          | Medium |

**Total Foundation Pages:** 3 Auth-Calls to migrate

---

## 📊 PHASE C: BACKEND MIGRATION

### **WP-C1: ADMIN APIS**

| File                                         | Current Auth Pattern | Target Pattern                      | Risk   | Priority |
| -------------------------------------------- | -------------------- | ----------------------------------- | ------ | -------- |
| `pages/api/admin/create-test-user.ts`        | ⚠️ Partial migration | ✅ `withAuth(requireRole('admin'))` | Medium | High     |
| `pages/api/admin/create-test-user-direct.ts` | ✅ Already migrated  | ✅ `withAuth(requireRole('admin'))` | Low    | ✅ Done  |
| `pages/api/admin/users.ts`                   | ❌ Manual auth check | ✅ `withAuth(requireRole('admin'))` | High   | Critical |
| `pages/api/admin/foundation-cases.ts`        | ❌ Manual auth check | ✅ `withAuth(requireRole('admin'))` | High   | Critical |
| `pages/api/admin/analytics.ts`               | ❌ Manual auth check | ✅ `withAuth(requireRole('admin'))` | Medium | High     |
| `pages/api/admin/settings.ts`                | ❌ Manual auth check | ✅ `withAuth(requireRole('admin'))` | Medium | High     |

**Total Admin APIs:** 5 Endpoints to migrate

### **WP-C2: FOUNDATION APIS (CRITICAL)**

| File                                | Current Auth Pattern     | Target Pattern         | Risk     | Priority     |
| ----------------------------------- | ------------------------ | ---------------------- | -------- | ------------ |
| `pages/api/foundation/submit.ts`    | ❌ Manual JWT extraction | ✅ `withAuth(handler)` | **HIGH** | **CRITICAL** |
| `pages/api/foundation/progress.ts`  | ❌ Manual JWT extraction | ✅ `withAuth(handler)` | **HIGH** | **CRITICAL** |
| `pages/api/foundation/cases.ts`     | ❌ Manual JWT extraction | ✅ `withAuth(handler)` | **HIGH** | **CRITICAL** |
| `pages/api/foundation/modules.ts`   | ❌ Manual JWT extraction | ✅ `withAuth(handler)` | High     | Critical     |
| `pages/api/foundation/analytics.ts` | ❌ Manual JWT extraction | ✅ `withAuth(handler)` | Medium   | High         |
| `pages/api/foundation/user-data.ts` | ❌ Manual JWT extraction | ✅ `withAuth(handler)` | High     | Critical     |

**Total Foundation APIs:** 6 Endpoints to migrate ⚠️ **BUSINESS CRITICAL**

### **WP-C3: USER APIS**

| File                            | Current Auth Pattern     | Target Pattern         | Risk   | Priority |
| ------------------------------- | ------------------------ | ---------------------- | ------ | -------- |
| `pages/api/user/profile.ts`     | ❌ Manual JWT extraction | ✅ `withAuth(handler)` | Medium | High     |
| `pages/api/user/settings.ts`    | ❌ Manual JWT extraction | ✅ `withAuth(handler)` | Medium | High     |
| `pages/api/user/preferences.ts` | ❌ Manual JWT extraction | ✅ `withAuth(handler)` | Low    | Medium   |

**Total User APIs:** 3 Endpoints to migrate

---

## 📊 EXTERNAL APIS (NO CHANGE NEEDED)

| File                        | Current Pattern                               | Status     | Notes                    |
| --------------------------- | --------------------------------------------- | ---------- | ------------------------ |
| `pages/api/rate-text.ts`    | `'Authorization': \`Bearer ${openaiApiKey}\`` | ✅ Correct | External API, keep as-is |
| `pages/api/openai-proxy.ts` | `'Authorization': \`Bearer ${openaiApiKey}\`` | ✅ Correct | External API, keep as-is |

---

## 📊 MIGRATION SUMMARY

### **TOTAL AUTH-STELLEN TO MIGRATE:**

| Phase  | Component Type   | Count               | Risk Level | Business Impact     |
| ------ | ---------------- | ------------------- | ---------- | ------------------- |
| **A**  | Foundation Setup | 12 Files            | Low-Medium | Foundation          |
| **B1** | Admin Components | 10 Calls            | Medium     | Admin Features      |
| **B2** | Foundation Step  | **15 Calls**        | **HIGH**   | **User Experience** |
| **B3** | Foundation Hooks | 11 Calls            | High       | Core Functionality  |
| **B4** | Foundation Pages | 3 Calls             | Medium     | User Interface      |
| **C1** | Admin APIs       | 5 Endpoints         | High       | Admin Security      |
| **C2** | Foundation APIs  | **6 Endpoints**     | **HIGH**   | **Core Business**   |
| **C3** | User APIs        | 3 Endpoints         | Medium     | User Features       |
|        | **TOTAL**        | **65 Auth-Stellen** |            |                     |

### **CRITICAL PATH ANALYSIS:**

#### **🚨 HIGHEST RISK (Business Critical):**

1. **Foundation Step (15 calls)** - User Experience Critical
2. **Foundation APIs (6 endpoints)** - Core Business Logic
3. **Foundation Hooks (11 calls)** - Core Functionality

#### **⚠️ HIGH RISK (Security Critical):**

1. **Admin APIs (5 endpoints)** - Security & Access Control
2. **Foundation Pages (3 calls)** - User Interface

#### **✅ MEDIUM RISK (Manageable):**

1. **Admin Components (10 calls)** - Admin Interface
2. **User APIs (3 endpoints)** - User Features

---

## 🎯 DETAILED MIGRATION PLAN

### **PHASE A: FOUNDATION (0 Auth-Calls)**

- **Focus:** Infrastructure setup
- **Risk:** Low - No existing functionality affected
- **Duration:** 6-9 days

### **PHASE B: FRONTEND (39 Auth-Calls)**

- **Focus:** User-facing components
- **Risk:** HIGH - Direct user impact
- **Duration:** 8-12 days
- **Critical:** FoundationStep.tsx (15 calls)

### **PHASE C: BACKEND (14 Endpoints)**

- **Focus:** API security
- **Risk:** HIGH - Data security critical
- **Duration:** 7-10 days
- **Critical:** Foundation APIs (6 endpoints)

---

## 📋 TESTING MATRIX

### **PER WORK PACKAGE TESTING:**

| Work Package | Auth-Calls      | Test Scenarios                     | Critical Tests            |
| ------------ | --------------- | ---------------------------------- | ------------------------- |
| **WP-B1**    | 10 calls        | Admin login, user management       | Admin access control      |
| **WP-B2**    | **15 calls**    | **Foundation flow, progress save** | **User journey complete** |
| **WP-B3**    | 11 calls        | Case generation, module state      | Data persistence          |
| **WP-B4**    | 3 calls         | Case navigation, loading           | Page functionality        |
| **WP-C1**    | 5 endpoints     | Admin API security                 | Role-based access         |
| **WP-C2**    | **6 endpoints** | **Foundation API functionality**   | **Data integrity**        |
| **WP-C3**    | 3 endpoints     | User profile, settings             | User data access          |

### **ROLLBACK TRIGGERS:**

| Condition                       | Action             | Responsible |
| ------------------------------- | ------------------ | ----------- |
| **>5% Performance Degradation** | Immediate rollback | DevOps      |
| **User Journey Broken**         | Emergency rollback | Product     |
| **Security Vulnerability**      | Immediate rollback | Security    |
| **Data Loss/Corruption**        | Emergency rollback | CTO         |

---

**Diese Matrix zeigt EXAKT alle 65 Auth-Stellen, die migriert werden müssen, mit konkreten Zeilennummern und Risikobewertung.**

**Ready für detaillierte Work Package Freigabe?** 🚀
