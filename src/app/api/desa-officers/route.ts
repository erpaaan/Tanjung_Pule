import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// 1. MENGAMBIL DAFTAR PETUGAS
export async function GET() {
  const { data, error } = await supabase
    .from('officers')
    .select('*')
    .order('id', { ascending: true });
    
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// 2. MENAMBAH PETUGAS BARU (POST)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabase
    .from('officers')
    .insert([body])
    .select();
    
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// 3. MENGUPDATE DATA PETUGAS (PUT) - BAGIAN YANG HARUS DITAMBAHKAN
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id'); // Mengambil ID petugas dari URL
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID petugas diperlukan" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('officers')
      .update({
        name: body.name,
        role: body.role,
        image_url: body.image_url
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 4. MENGHAPUS PETUGAS
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  try {
    // Ambil info petugas untuk hapus foto di storage
    const { data: officer } = await supabase
      .from('officers')
      .select('image_url')
      .eq('id', id)
      .single();

    if (officer?.image_url) {
      const fileName = officer.image_url.split('/').pop();
      await supabase.storage.from('news-images').remove([fileName]);
    }

    const { error } = await supabase.from('officers').delete().eq('id', id);
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}