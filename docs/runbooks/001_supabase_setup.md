# Supabase Setup Runbook

## Prerequisites

- Supabase account
- Local development environment set up

## Steps

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note down:
   - Project URL
   - Anon/public key
   - Service role key (keep secret!)

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Sentry (Optional)
SENTRY_DSN=your-sentry-dsn
SENTRY_ENV=development

# Redis Cache (Optional)
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# App Configuration
NEXT_PUBLIC_APP_VERSION=0.1.0
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. ENV-Guards Validierung

Das Projekt verwendet moderne ENV-Guards mit Zod-Validierung:

```typescript
// src/lib/config/env.client.ts
const ClientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  // ... weitere Client-Variablen
});

// src/lib/config/env.server.ts
const ServerSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  // ... weitere Server-Variablen
});
```

**Hinweis**: Alle Environment-Variablen werden zur Build-Zeit validiert. Fehlende oder ungültige Variablen führen zu Build-Fehlern.

### 4. Create Profiles Table

Run this SQL in Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create trigger for auto-creating profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'User'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 5. Generate Types

```bash
npm run typegen
```

Dies generiert aktualisierte TypeScript-Typen in `src/types/supabase.ts`.

### 6. Test Authentication

1. Start development server: `npm run dev`
2. Go to `/register` and create account
3. Check email for verification
4. Login at `/login`
5. Should redirect to `/catalog`

### 7. Create Admin User

In Supabase SQL Editor:

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-admin-email@example.com';
```

### 8. Verify ENV-Guards

Überprüfe, ob alle Environment-Variablen korrekt validiert werden:

```bash
# Build test
npm run build

# Type check
npm run typecheck

# Lint
npm run lint
```

## Verification

- [ ] Registration works
- [ ] Email verification works
- [ ] Login redirects correctly
- [ ] Build runs without ENV-errors
- [ ] Type generation successful
- [ ] Admin role assignment works

## Troubleshooting

### ENV-Validation Errors

```bash
# Fehler: "Missing required environment variables"
# Lösung: Alle erforderlichen Variablen in .env.local setzen

# Fehler: "Invalid URL format"
# Lösung: NEXT_PUBLIC_SUPABASE_URL Format prüfen (https://...)
```

### Build Errors

```bash
# Fehler: "Cannot find module '@/lib/config/env.*'"
# Lösung: npm install && npm run build

# Fehler: "Zod validation failed"
# Lösung: Environment-Variablen Format prüfen
```

## Weitere Informationen

- **ENV-Guards**: Siehe [deploy.md](./deploy.md)
- **Auth-Integration**: Siehe [auth-ssr.md](./auth-ssr.md)
- **Cache-Integration**: Siehe [caching.md](./caching.md)
