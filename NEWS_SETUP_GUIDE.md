# Setup Lengkap Sistem Berita

## 1️⃣ Setup Database Supabase

### Buat Table News

Jalankan query ini di **Supabase Dashboard → SQL Editor**:

```sql
CREATE TABLE news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index untuk performance
CREATE INDEX idx_news_created_at ON news(created_at DESC);
```

### Setup Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read news (public)
CREATE POLICY "Public dapat membaca berita"
  ON news FOR SELECT
  USING (true);

-- Allow service role (admin API) untuk mengelola news
-- Ini sudah otomatis dengan service role key
```

## 2️⃣ Setup Environment Variables

Edit atau buat file `.env.local` di root project:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

**Dapatkan credentials:**
1. Buka **Supabase Dashboard**
2. Pergi ke **Settings → API**
3. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_KEY` (⚠️ JAGA RAHASIA!)

## 3️⃣ Restart Development Server

```bash
# Ctrl + C untuk stop server
# Lalu jalankan lagi
npm run dev
```

## 4️⃣ Testing

### Test 1: Login Admin
1. Buka http://localhost:3000/login-admin
2. Klik "Daftar Akun Baru"
3. Isi email & password
4. Klik "Daftar Akun Baru"
5. Seharusnya alert "Registrasi berhasil!"

### Test 2: Tambah Berita
1. Buka http://localhost:3000/admin-news
2. Isi form (judul, deskripsi, tanggal)
3. Klik "Tambah Berita"
4. Tunggu sampai alert "Berita berhasil ditambahkan!"
5. Lihat di daftar berita di bawah

### Test 3: Lihat di Home
1. Buka http://localhost:3000
2. Scroll ke bawah bagian "Berita Terkini"
3. Berita seharusnya tampil dan berganti otomatis setiap 5 detik

## 🔧 Troubleshooting

### Berita Tidak Tampil

**Cek di Browser DevTools:**
1. Buka **F12 → Console**
2. Cari error messages
3. Cek di **Network tab** apakah API `/api/news-admin` berhasil (status 200)

**Common Issues:**

| Masalah | Solusi |
|---------|--------|
| Error "SUPABASE_SERVICE_KEY is empty" | Pastikan `.env.local` sudah ada di root project, dan berisi credentials yang benar |
| Error 401 atau 403 | Cek RLS policies, pastikan public bisa read table news |
| Error "Table news does not exist" | Jalankan SQL query untuk create table |
| Berita tidak muncul tapi tidak ada error | Refresh page dengan Ctrl+Shift+R (hard refresh) |

### Lihat Server Logs

Di terminal yang menjalankan `npm run dev`, cari logs seperti:
```
Creating news with: { title: '...', description: '...', date: '...' }
News created successfully: [...]
Fetching news from Supabase...
News fetched: [...]
```

Jika ada error, akan ada pesan `Supabase error: {...}`

## 📚 File yang Penting

- `/src/app/api/news-admin/route.ts` - API untuk CRUD berita
- `/src/app/admin-news/page.tsx` - Halaman admin kelola berita
- `/src/app/login-admin/page.tsx` - Halaman login
- `/src/app/page.tsx` - Home dengan carousel berita
- `/src/lib/db.ts` - Supabase client

## 🚀 Deployment

Jika akan deploy:
1. Set environment variables di hosting platform (Vercel, Netlify, dll)
2. Pastikan `SUPABASE_SERVICE_KEY` aman dan tidak di-commit ke Git
3. Add ke `.gitignore`:
   ```
   .env.local
   .env
   ```

---

**Butuh bantuan?** Cek console browser (F12) untuk error messages detail!
