# 🚀 Contributing to navaa.ai

**Welcome to navaa.ai!** We're excited that you want to contribute to our EdTech platform for strategic consulting education.

---

## 📋 QUICK START FOR CONTRIBUTORS

### **🎯 MANDATORY: Read Our Development Guidelines**

**Before making any contributions, please read our comprehensive development standards:**

👉 **[navaa Development Guidelines](./docs/navaa-development-guidelines.md)**

Additional required docs:

- 🔒 **[Security Policy](.github/SECURITY.md)**
- 🧪 **[Testing Policy](./docs/testing-policy.md)**
- 🎨 **[UI Styleguide](./STYLEGUIDE.md)** (Typography, Marketing Pages, Image Usage)
- 🧰 **CI Status:** Automated checks run via GitHub Actions in `.github/workflows/ci.yml`

This document contains:

- ✅ Universal Principles (Stability First, Security First)
- ✅ Technical Standards (Auth, Routing, React, Database)
- ✅ Common Pitfalls & Anti-Patterns
- ✅ Incident Response Protocols

---

## 🛡️ CONTRIBUTION STANDARDS

### **STABILITY FIRST CHECKLIST**

Before submitting any PR, ensure:

```typescript
// ✅ MANDATORY CHECKS:
1. Is the feature currently working? ✅/❌
2. Is this change really necessary? ✅/❌
3. Can the problem be solved in isolation? ✅/❌
4. Do you have a safe rollback plan? ✅/❌
```

### **CODE QUALITY STANDARDS**

- **✅ TypeScript:** All code must be type-safe
- **✅ ESLint:** No linting errors allowed
- **✅ Testing:** Critical paths must have tests
- **✅ Documentation:** Complex logic must be documented

---

## 🎯 DEVELOPMENT WORKFLOW

### **1. SETUP**

```bash
# Clone and setup
git clone [repo-url]
cd windsurf-project
npm install

# Start development
npm run dev
```

### **2. BRANCH NAMING**

```bash
# Feature branches
git checkout -b feature/unified-guard-migration
git checkout -b fix/user-profile-mapping
git checkout -b docs/api-documentation
```

### **3. COMMIT STANDARDS**

```bash
# Use conventional commits
git commit -m "feat: add unified guard pattern"
git commit -m "fix: resolve camelCase mapping issue"
git commit -m "docs: update development guidelines"
```

### **4. PULL REQUEST CHECKLIST**

- [ ] ✅ Follows navaa Development Guidelines
- [ ] ✅ Follows UI Styleguide (Typography, Image Usage)
- [ ] ✅ No breaking changes without migration plan
- [ ] ✅ All tests pass
- [ ] ✅ Documentation updated if needed
- [ ] ✅ Rollback strategy documented
- [ ] ✅ CI green (lint, typecheck, build)
- [ ] ✅ Commit message follows Conventional Commits

#### UI/Marketing Specific

- [ ] Uses `Heading`/`Text` (no raw `<h*>`/`<p>`) in `components/sections/`
- [ ] Uses `next/image` (no `<img>`); `priority` only above the fold with correct `sizes`
- [ ] Long copy uses `leading-relaxed`; widths constrained as needed (`max-w-prose`)
- [ ] Primary CTAs follow `bg-[#009e82] hover:bg-[#007a66]`

---

## 🚨 CRITICAL ANTI-PATTERNS TO AVOID

### **❌ NEVER DO:**

- **Multiple Guards:** Use Unified Guard Pattern only
- **Magic Values:** Always use constants (USER_ROLES, SUBSCRIPTION_TIERS)
- **Direct State Mutation:** Use immutable patterns
- **Router in useEffect Dependencies:** Causes infinite loops
- **Guessed Table Names:** Always verify against DB schema
- **Missing Error Context:** Use structured logging

### **✅ ALWAYS DO:**

- **useAuth() Hook:** For all authentication
- **JWT Bearer Tokens:** For API calls
- **Schema Sync:** Update interfaces after DB migrations
- **Loading Timeouts:** Max 10 seconds with fallback
- **Feature Flags:** For risky changes

---

## 🏗️ ARCHITECTURE PRINCIPLES

### **TECH STACK**

- **Frontend:** Next.js + TypeScript + Tailwind CSS
- **Backend:** Supabase + RLS + JWT Authentication
- **Database:** PostgreSQL with Row Level Security
- **Deployment:** Vercel + CI/CD Pipeline

### **SECURITY FIRST**

- **No RLS Workarounds:** Always use Admin APIs with Service Role
- **JWT-based Auth:** All internal APIs require Bearer tokens
- **Principle of Least Privilege:** Minimal necessary permissions

---

## 🤖 AI-ASSISTED DEVELOPMENT

### **FOR AI TOOLS (GPT, Claude, etc.):**

This project uses AI-assisted development. When contributing via AI:

1. **✅ Always reference:** `./docs/navaa-development-guidelines.md`
2. **✅ Follow patterns:** Use existing code patterns as examples
3. **✅ Validate against:** Database schema and API contracts
4. **✅ Test thoroughly:** AI-generated code must be tested

### **COMMON AI PITFALLS:**

- **Table Names:** Never guess, always verify against existing schema
- **API Contracts:** Ensure frontend/backend type compatibility
- **React Patterns:** Follow our useEffect and state management guidelines

---

## 📚 RESOURCES

### **DOCUMENTATION**

- [Development Guidelines](./docs/navaa-development-guidelines.md) - **MANDATORY READ**
- [Application Overview](./docs/navaa-application-overview.md)
- [UnifiedGuard Migration Strategy](./docs/unified-guard-migration-strategy.md)
- [Testing Policy](./docs/testing-policy.md)
- [Security Policy](.github/SECURITY.md)

### **GETTING HELP**

- **Questions:** Create an issue with the `question` label
- **Bugs:** Use the bug report template
- **Features:** Use the feature request template

---

## 🎯 CONTRIBUTION TYPES

### **🐛 BUG FIXES**

1. **Isolate the problem** (don't change multiple things)
2. **Follow debugging protocol** (Symptom → Scope → Root Cause → Minimal Fix)
3. **Add regression tests** to prevent future occurrences

### **✨ NEW FEATURES**

1. **Check existing patterns** before building new components
2. **Use feature flags** for risky changes
3. **Document technical decisions** in code comments

### **📚 DOCUMENTATION**

1. **Update guidelines** when adding new patterns
2. **Include code examples** for complex concepts
3. **Keep README.md** current with setup instructions

---

## 🏆 RECOGNITION

Contributors who consistently follow these guidelines and help improve navaa.ai will be recognized in our:

- **Contributor Hall of Fame**
- **Monthly Development Updates**
- **Technical Architecture Decisions**

---

## 📞 CONTACT

**Maintainer:** Christian Maass (@christianmaass)  
**Project:** navaa.ai EdTech Platform  
**Guidelines Version:** 2.1 (Updated 2025-08-08)

---

## 🧩 Local Git Hooks (Enforcement)

We use Husky + lint-staged + commitlint to enforce quality locally.

1. Install dev tooling (one-time):

```
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional
npm run prepare
```

2. Hooks:

- `pre-commit`: runs lint-staged (eslint + prettier on staged files)
- `commit-msg`: enforces Conventional Commits

CI will block merges when lint/typecheck/build fail.

### Optional but recommended: Local Secret Scanning (Gitleaks)

- Pre-commit hook will run Gitleaks if installed locally and block commits on findings.
- Install locally (macOS/Homebrew):

```
brew install gitleaks
```

- Configure rules in `.gitleaks.toml`. CI always runs the scanner on PRs/pushes.

**🚀 Ready to contribute? Start by reading our [Development Guidelines](./docs/navaa-development-guidelines.md)!**
