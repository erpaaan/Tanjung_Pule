import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Gunakan Service Key
);

// 1. Ambil Semua Pengajuan (Untuk Admin)
export async function GET() {
  const { data, error } = await supabase
    .from('surat_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// 2. Kirim Pengajuan Baru (Dari Warga/Services Page)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nama_lengkap, nik, jenis_surat, keperluan } = body;

  const { data, error } = await supabase
    .from('surat_submissions')
    .insert([{ nama_lengkap, nik, jenis_surat, keperluan, status: 'Pending' }]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// 3. Update Status Surat (Pending -> Selesai)
export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const { status } = await req.json();

  const { error } = await supabase
    .from('surat_submissions')
    .update({ status })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}