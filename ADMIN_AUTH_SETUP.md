# Setup Admin Users di Supabase

## 1. Buat Table Admin Users

Jalankan query ini di **Supabase SQL Editor**:

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index untuk email
CREATE INDEX idx_admin_users_email ON admin_users(email);
```

## 2. Enable RLS (Row Level Security) - Optional tapi recommended

```sql
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy untuk SELECT
CREATE POLICY "Admin dapat membaca data mereka sendiri"
  ON admin_users FOR SELECT
  USING (auth.uid() = id);

-- Policy untuk UPDATE
CREATE POLICY "Admin dapat update data mereka sendiri"
  ON admin_users FOR UPDATE
  USING (auth.uid() = id);

-- Policy untuk DELETE
CREATE POLICY "Admin dapat delete data mereka sendiri"
  ON admin_users FOR DELETE
  USING (auth.uid() = id);
```

## 3. Setup Service Role (untuk API)

1. Pergi ke **Settings → API**
2. Copy `service_role key` 
3. Paste ke `.env.local` sebagai `SUPABASE_SERVICE_KEY`

**PENTING**: Service role key adalah secret, jangan di-commit ke Git!

## 4. Konfigurasi Email (Optional)

Jika ingin custom email verification:
1. Pergi ke **Authentication → Email Templates**
2. Customize template sesuai kebutuhan

Atau disable email verification:
1. **Authentication → Providers → Email**
2. Uncheck "Require email confirmation"

## 5. Environment Variables

Pastikan `.env.local` sudah berisi:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

---

Setelah setup selesai, user akan langsung ter-create di database saat registrasi!
