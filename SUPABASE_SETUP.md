# Setup Supabase untuk Desa Website

## 1. Daftar & Buat Project Supabase

1. Buka https://supabase.com
2. Sign up dengan GitHub atau email
3. Buat project baru (pilih region terdekat)
4. Tunggu hingga project aktif

## 2. Copy Credentials

Setelah project dibuat, pergi ke **Settings → API**:
- Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- Copy `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy `service_role key` → `SUPABASE_SERVICE_KEY`

Paste ke file `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here
```

## 3. Buat Database Tables

Di Supabase, pergi ke **SQL Editor** dan jalankan queries ini:

### Table Users
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Table News
```sql
CREATE TABLE news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

If you already have the `news` table, add the optional column with:
```sql
ALTER TABLE news ADD COLUMN IF NOT EXISTS image_url TEXT;
```

### Supabase Storage (optional — recommended for image uploads)
1. Di dashboard Supabase → Storage → Create bucket → beri nama `news-images`.
2. Untuk demo/dev: set `Public` = **yes** supaya `getPublicUrl` bekerja tanpa signed URL.
   - Production: lebih aman gunakan signed URLs atau akses terbatas.
3. Tambahkan env (opsional, default `news-images` digunakan):
   NEXT_PUBLIC_NEWS_BUCKET=news-images
4. Contoh SQL untuk akses cepat (jika perlu):
```sql
-- make bucket public via policies (dashboard UI also works)
-- NOTE: prefer signed URLs in production instead of making bucket public
```


### Table Services
```sql
CREATE TABLE services (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Table Contacts
```sql
CREATE TABLE contacts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. Setup Row Level Security (RLS)

Untuk keamanan, aktifkan RLS pada setiap table di Supabase:

1. Buka table di **Supabase Dashboard**
2. Klik **Auth** tab
3. Enable **RLS**
4. Tambah policy untuk akses publik (untuk demo):
   ```sql
   CREATE POLICY "Allow public access" ON users
   FOR ALL USING (true);
   ```

## 5. Test Connection

Buka terminal dan jalankan:
```bash
npm run dev
```

Test endpoint (Unix):
```bash
curl http://localhost:3000/api/users
```

Test endpoint (POST) — PowerShell / Windows (use Invoke-RestMethod or curl.exe with stdin to avoid quoting issues):

PowerShell (recommended):
```powershell
$json = @{ name='ps-test'; email='ps@b.test'; message='halo' } | ConvertTo-Json -Compress
Invoke-RestMethod -Uri http://localhost:3000/api/contacts -Method Post -Body $json -ContentType 'application/json' -Verbose
```

Git Bash / WSL:
```bash
echo '{"name":"cli","email":"a@b.test","message":"halo"}' | curl.exe -i -H "Content-Type: application/json" -d @- http://localhost:3000/api/contacts
```

## API Endpoints

- `GET /api/users` - Ambil semua user
- `POST /api/users` - Buat user baru
- `GET /api/users/[id]` - Ambil user spesifik
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Hapus user
- `GET /api/news` - Ambil semua berita
- `POST /api/news` - Buat berita baru
- `GET /api/news/[id]` - Ambil berita spesifik
- `PUT /api/news/[id]` - Update berita
- `DELETE /api/news/[id]` - Hapus berita
- `GET /api/services` - Ambil semua layanan
- `POST /api/services` - Buat layanan baru
- `GET /api/contacts` - Ambil semua pesan kontak
- `POST /api/contacts` - Kirim pesan kontak

## Contoh Penggunaan

```javascript
// GET data
fetch('/api/users')
  .then(res => res.json())
  .then(data => console.log(data));

// POST data
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    name: 'John Doe', 
    email: 'john@mail.com' 
  })
})
  .then(res => res.json())
  .then(data => console.log(data));

// PUT data
fetch('/api/users/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    name: 'Jane Doe', 
    email: 'jane@mail.com' 
  })
})
  .then(res => res.json())
  .then(data => console.log(data));

// DELETE data
fetch('/api/users/1', {
  method: 'DELETE'
})
  .then(res => res.json())
  .then(data => console.log(data));
```
