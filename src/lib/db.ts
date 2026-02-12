import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Jangan gunakan || '', lebih baik lempar error agar ketahuan mana yang kosong
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Konfigurasi Supabase tidak lengkap. Cek Environment Variables di Vercel!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;