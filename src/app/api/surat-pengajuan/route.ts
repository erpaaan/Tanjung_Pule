import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// WAJIB: Agar tidak error "supabaseKey is required" saat hosting di Vercel
export const dynamic = 'force-dynamic'; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Gunakan Service Key sesuai dashboard Vercel
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

// 2. Kirim Pengajuan Baru (Ditambah nomor_telepon dan file_url)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Destruktur data termasuk field baru yang kamu inginkan
    const { nama_lengkap, nik, jenis_surat, keperluan, nomor_telepon, file_url } = body;

    const { data, error } = await supabase
      .from('surat_submissions')
      .insert([{ 
        nama_lengkap, 
        nik, 
        jenis_surat, 
        keperluan, 
        nomor_telepon, // Simpan nomor telp warga
        file_url,      // Simpan link file dari storage
        status: 'Pending' 
      }]);

    if (error) throw error;
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. Update Status Surat (Pending -> Selesai)
export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const { status } = await req.json();

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const { error } = await supabase
      .from('surat_submissions')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 4. MODIFIKASI: Hapus Pengajuan (Ditambahkan agar fitur hapus di admin bekerja)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const { error } = await supabase
      .from('surat_submissions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Data berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}