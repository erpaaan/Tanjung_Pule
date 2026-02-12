import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const target = searchParams.get('target') === 'stats' ? 'statistics' : 'leader';

    // Ambil baris pertama yang ditemukan (apapun ID-nya)
    const { data, error } = await supabase.from(target).select('*').limit(1).single();
    
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const target = searchParams.get('target') === 'stats' ? 'statistics' : 'leader';
    const body = await req.json();

    // Ambil ID asli dari data yang ada di tabel (dalam kasus Anda: 7)
    const { id, updated_at, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID tidak ditemukan dalam payload" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from(target)
      .update(updateData)
      .eq('id', id) // Sekarang menggunakan ID yang sesuai dengan di tabel (ID 7)
      .select();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}