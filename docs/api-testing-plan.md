# WP-D1: API Testing & Validation Plan

## Comprehensive Testing für alle migrierten Backend APIs

### 📊 TESTING SCOPE

**13 kritische Backend APIs** systematisch testen:

- **4 Foundation APIs** (withAuth middleware)
- **5 Admin APIs** (requireRole('admin') middleware)
- **4 User APIs** (withAuth middleware)

---

## 🎯 PHASE 1: MANUAL API ENDPOINT TESTING

### ✅ FOUNDATION APIs (withAuth middleware)

1. **POST /api/foundation/submit**
   - ❌ Without JWT → 401 Unauthorized
   - ✅ With valid JWT → 200 Success
   - ❌ With invalid JWT → 401 Invalid token
   - ✅ Valid request body → Response processing
   - ❌ Invalid request body → 400 Bad Request

2. **GET /api/foundation/progress**
   - ❌ Without JWT → 401 Unauthorized
   - ✅ With valid JWT → 200 Progress data
   - ❌ With invalid JWT → 401 Invalid token

3. **GET /api/foundation/cases**
   - ❌ Without JWT → 401 Unauthorized
   - ✅ With valid JWT → 200 Cases list
   - ❌ With invalid JWT → 401 Invalid token

4. **POST /api/foundation/generate-content**
   - ❌ Without JWT → 401 Unauthorized
   - ✅ With valid JWT → 200 Generated content
   - ❌ With invalid JWT → 401 Invalid token
   - ✅ Valid OpenAI request → Content generation
   - ❌ Invalid request body → 400 Bad Request

### ✅ ADMIN APIs (requireRole('admin') middleware)

5. **GET /api/admin/users**
   - ❌ Without JWT → 401 Unauthorized
   - ❌ With user JWT → 403 Forbidden (not admin)
   - ✅ With admin JWT → 200 Users list
   - ❌ With invalid JWT → 401 Invalid token

6. **POST /api/admin/create-test-user-direct**
   - ❌ Without JWT → 401 Unauthorized
   - ❌ With user JWT → 403 Forbidden (not admin)
   - ✅ With admin JWT → 201 Test user created
   - ❌ Rate limit exceeded → 429 Too Many Requests
   - ✅ Valid Zod schema → User creation
   - ❌ Invalid Zod schema → 400 Validation error

7. **DELETE /api/admin/delete-user/[userId]**
   - ❌ Without JWT → 401 Unauthorized
   - ❌ With user JWT → 403 Forbidden (not admin)
   - ✅ With admin JWT → 200 User deleted
   - ❌ Delete admin user → 400 Cannot delete admin
   - ❌ Invalid userId → 404 User not found

8. **GET /api/admin/logs**
   - ❌ Without JWT → 401 Unauthorized
   - ❌ With user JWT → 403 Forbidden (not admin)
   - ✅ With admin JWT → 200 Logs data
   - ❌ Rate limit exceeded → 429 Too Many Requests

9. **GET /api/admin/check-role**
   - ❌ Without JWT → 401 Unauthorized
   - ❌ With user JWT → 403 Forbidden (not admin)
   - ✅ With admin JWT → 200 {isAdmin: true, role: 'admin'}

### ✅ USER APIs (withAuth middleware)

10. **DELETE /api/user/delete-account**
    - ❌ Without JWT → 401 Unauthorized
    - ✅ With valid JWT → 200 Account deleted
    - ❌ With invalid JWT → 401 Invalid token
    - ✅ Valid confirmation → GDPR deletion
    - ❌ Invalid confirmation → 400 Bad Request
    - ✅ Audit logging → Log entry created

11. **PUT /api/user/update-profile**
    - ❌ Without JWT → 401 Unauthorized
    - ✅ With valid JWT → 200 Profile updated
    - ❌ With invalid JWT → 401 Invalid token
    - ✅ Valid profile data → Update success
    - ❌ Invalid profile data → 400 Validation error
    - ✅ Input sanitization → XSS protection

12. **GET /api/user-tariff**
    - ❌ Without JWT → 401 Unauthorized
    - ✅ With valid JWT → 200 Tariff info
    - ❌ With invalid JWT → 401 Invalid token
    - ✅ Fallback to Free plan → Default tariff

13. **GET /api/test-user/[userId]**
    - ❌ Without JWT → 401 Unauthorized
    - ✅ With valid JWT → 200 Test user info
    - ❌ With invalid JWT → 401 Invalid token
    - ✅ Valid test user → User data + expiration
    - ❌ Invalid userId → 404 Test user not found

---

## 🎯 PHASE 2: INTEGRATION TESTING

### Frontend-Backend Integration

- Login flow → JWT token acquisition
- API calls with JWT → Successful responses
- Token expiration → Proper error handling
- Role-based UI → Admin vs User access

### Middleware Integration

- withAuth middleware → JWT validation
- requireRole middleware → RBAC enforcement
- Combined middleware → Rate limiting + RBAC
- Error propagation → Consistent error responses

---

## 🎯 PHASE 3: SECURITY TESTING

### JWT Security

- Token tampering → 401 Invalid token
- Expired tokens → 401 Token expired
- Missing tokens → 401 Unauthorized
- Invalid signatures → 401 Invalid token

### RBAC Security

- User accessing admin APIs → 403 Forbidden
- Admin accessing user APIs → 200 Success
- Role escalation attempts → 403 Forbidden
- Cross-user data access → 403 Forbidden

### Rate Limiting

- Admin API rate limits → 429 Too Many Requests
- Rate limit headers → X-RateLimit-\* headers
- Rate limit reset → Successful requests after reset

---

## 🎯 PHASE 4: PERFORMANCE TESTING

### Middleware Performance

- Auth middleware latency → < 50ms
- Database query performance → < 200ms
- JWT verification speed → < 10ms
- Memory usage → Stable under load

### API Response Times

- Foundation APIs → < 500ms
- Admin APIs → < 300ms
- User APIs → < 200ms
- Error responses → < 100ms

---

## 📊 TEST RESULTS TRACKING

### Test Status

- [ ] Foundation APIs (0/4 tested)
- [ ] Admin APIs (0/5 tested)
- [ ] User APIs (0/4 tested)
- [ ] Integration Tests (0/4 areas tested)
- [ ] Security Tests (0/4 areas tested)
- [ ] Performance Tests (0/4 areas tested)

### Issues Found

- [ ] Critical issues: 0
- [ ] Major issues: 0
- [ ] Minor issues: 0
- [ ] Documentation issues: 0

### Test Environment

- Server: http://localhost:3001
- JWT Token: [To be obtained from login]
- Admin Token: [To be obtained from admin login]
- Test User: [To be created for testing]

---

## 🎯 SUCCESS CRITERIA

### ✅ All APIs must:

1. Properly validate JWT tokens
2. Return correct HTTP status codes
3. Enforce role-based access control
4. Handle errors gracefully
5. Maintain existing business logic
6. Meet performance requirements

### ✅ Security Requirements:

1. No unauthorized access possible
2. JWT tampering detected and rejected
3. Rate limiting functional
4. RBAC properly enforced
5. Input validation working
6. Audit logging functional

---

## 📝 NEXT STEPS

1. Execute manual API testing (Phase 1)
2. Document all test results
3. Fix any issues found
4. Proceed to integration testing (Phase 2)
5. Complete security and performance testing
6. Generate final test report
