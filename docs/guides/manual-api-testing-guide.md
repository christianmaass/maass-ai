# WP-D1: Manual Step-by-Step API Testing Guide

## Systematische Validierung aller 13 migrierten Backend APIs

---

## 🎯 TESTING ZIEL

Validierung aller migrierten Backend APIs mit navaa-konformer Auth-Middleware:

- **4 Foundation APIs** (withAuth middleware)
- **5 Admin APIs** (requireRole('admin') middleware)
- **4 User APIs** (withAuth middleware)

---

## 📋 SCHRITT 1: VORBEREITUNG

### 1.1 Server Status prüfen

```bash
# Development Server sollte laufen auf:
http://localhost:3001
```

### 1.2 Test-Credentials

- **Admin User:** `christian@christianmaass.com` (role: admin)
- **Regular User:** `christian@thomann.de` (role: user)
- **Passwort:** [Aus Supabase bekannt]

### 1.3 JWT Token beschaffen

**OPTION A: Browser Developer Tools**

1. Login über Frontend
2. F12 → Network Tab
3. JWT Token aus Authorization Header kopieren

**OPTION B: Direct Supabase Auth**

```javascript
// Browser Console:
const { createClient } = supabase;
const client = createClient('YOUR_URL', 'YOUR_ANON_KEY');
const { data } = await client.auth.signInWithPassword({
  email: 'christian@christianmaass.com',
  password: 'YOUR_PASSWORD',
});
console.log('JWT Token:', data.session.access_token);
```

---

## 📋 SCHRITT 2: FOUNDATION APIs TESTEN (withAuth middleware)

### 2.1 GET /api/foundation/cases

**Test ohne JWT (sollte 401 geben):**

```bash
curl -X GET http://localhost:3001/api/foundation/cases
```

**Erwartung:** `401 Unauthorized`

**Test mit JWT (sollte 200 geben):**

```bash
curl -X GET http://localhost:3001/api/foundation/cases \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Erwartung:** `200 OK` mit Cases-Daten

### 2.2 GET /api/foundation/progress

**Test ohne JWT:**

```bash
curl -X GET http://localhost:3001/api/foundation/progress
```

**Erwartung:** `401 Unauthorized`

**Test mit JWT:**

```bash
curl -X GET http://localhost:3001/api/foundation/progress \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Erwartung:** `200 OK` mit Progress-Daten

### 2.3 POST /api/foundation/submit

**Test mit JWT:**

```bash
curl -X POST http://localhost:3001/api/foundation/submit \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "case_id": 1,
    "response_text": "Test response for API validation",
    "response_type": "text"
  }'
```

**Erwartung:** `200 OK` mit Submit-Response

### 2.4 POST /api/foundation/generate-content

**Test mit JWT:**

```bash
curl -X POST http://localhost:3001/api/foundation/generate-content \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Generate test content for validation",
    "case_id": 1
  }'
```

**Erwartung:** `200 OK` mit Generated Content

---

## 📋 SCHRITT 3: ADMIN APIs TESTEN (requireRole middleware)

### 3.1 GET /api/admin/users

**Test ohne JWT:**

```bash
curl -X GET http://localhost:3001/api/admin/users
```

**Erwartung:** `401 Unauthorized`

**Test mit User JWT (sollte 403 geben):**

```bash
curl -X GET http://localhost:3001/api/admin/users \
  -H "Authorization: Bearer USER_JWT_TOKEN"
```

**Erwartung:** `403 Forbidden`

**Test mit Admin JWT (sollte 200 geben):**

```bash
curl -X GET http://localhost:3001/api/admin/users \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Erwartung:** `200 OK` mit Users-Liste

### 3.2 GET /api/admin/check-role

**Test mit Admin JWT:**

```bash
curl -X GET http://localhost:3001/api/admin/check-role \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Erwartung:** `200 OK` mit `{"isAdmin": true, "role": "admin"}`

### 3.3 GET /api/admin/logs

**Test mit Admin JWT:**

```bash
curl -X GET http://localhost:3001/api/admin/logs \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Erwartung:** `200 OK` mit Logs-Daten

### 3.4 POST /api/admin/create-test-user-direct

**Test mit Admin JWT:**

```bash
curl -X POST http://localhost:3001/api/admin/create-test-user-direct \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-api-validation@example.com",
    "firstName": "Test",
    "lastName": "User",
    "role": "test_user"
  }'
```

**Erwartung:** `201 Created` mit User-Daten

### 3.5 DELETE /api/admin/delete-user/[userId]

**Test mit Admin JWT:**

```bash
curl -X DELETE http://localhost:3001/api/admin/delete-user/TEST_USER_ID \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Erwartung:** `200 OK` mit Deletion-Confirmation

---

## 📋 SCHRITT 4: USER APIs TESTEN (withAuth middleware)

### 4.1 GET /api/user-tariff

**Test ohne JWT:**

```bash
curl -X GET http://localhost:3001/api/user-tariff
```

**Erwartung:** `401 Unauthorized`

**Test mit JWT:**

```bash
curl -X GET http://localhost:3001/api/user-tariff \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Erwartung:** `200 OK` mit Tariff-Daten

### 4.2 PUT /api/user/update-profile

**Test mit JWT:**

```bash
curl -X PUT http://localhost:3001/api/user/update-profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Updated",
    "last_name": "Name"
  }'
```

**Erwartung:** `200 OK` mit Updated Profile

### 4.3 DELETE /api/user/delete-account

**Test mit JWT:**

```bash
curl -X DELETE http://localhost:3001/api/user/delete-account \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "confirmationText": "KONTO LÖSCHEN",
    "reason": "API Testing"
  }'
```

**Erwartung:** `200 OK` mit Deletion-Confirmation

### 4.4 GET /api/test-user/[userId]

**Test mit JWT:**

```bash
curl -X GET http://localhost:3001/api/test-user/TEST_USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Erwartung:** `200 OK` mit Test User-Daten

### 4.5 GET /api/cases/user-case-history (Newly Created)

**Test mit JWT:**

```bash
curl -X GET http://localhost:3001/api/cases/user-case-history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Erwartung:** `200 OK` mit Case History

---

## 📋 SCHRITT 5: ERGEBNISSE DOKUMENTIEREN

### 5.1 Test Results Template

```
API Endpoint: [METHOD] [URL]
Expected Status: [CODE]
Actual Status: [CODE]
Success: [✅/❌]
Notes: [Any observations]
```

### 5.2 Summary Report

- **Total Tests:** 20+
- **Foundation APIs:** 4/4 ✅
- **Admin APIs:** 5/5 ✅
- **User APIs:** 4/4 ✅
- **Auth Failures:** 3/3 ✅
- **Overall Success Rate:** XX%

---

## 🎯 NEXT STEPS NACH MANUAL TESTING

1. **Issues dokumentieren** und beheben
2. **Integration Testing** mit Frontend
3. **Security Testing** (JWT tampering, etc.)
4. **Performance Testing** (Response times)
5. **Final Test Report** erstellen

---

## 🔧 TROUBLESHOOTING

### Häufige Probleme:

- **401 Unauthorized:** JWT Token fehlt oder ungültig
- **403 Forbidden:** User hat nicht die erforderliche Rolle
- **404 Not Found:** API Endpoint existiert nicht
- **500 Internal Error:** Server/Database Problem

### Debug Commands:

```bash
# Server Logs prüfen
tail -f logs/server.log

# Database Connection testen
psql -h localhost -U postgres -d navaa

# JWT Token dekodieren
echo "JWT_TOKEN" | base64 -d
```
