import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Gunakan Service Key agar bisa tembus RLS
);

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Akun tidak ditemukan" }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}