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
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Create Profiles Table

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

### 4. Generate Types

```bash
npm run typegen
```

### 5. Test Authentication

1. Start development server: `npm run dev`
2. Go to `/register` and create account
3. Check email for verification
4. Login at `/login`
5. Should redirect to `/catalog`

### 6. Create Admin User

In Supabase SQL Editor:

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-admin-email@example.com';
```

## Verification

- [ ] Registration works
- [ ] Email verification works
- [ ] Login redirects to `/catalog`
- [ ] Logout clears session
- [ ] `/admin` accessible only to admin users
- [ ] Types are generated and up to date
