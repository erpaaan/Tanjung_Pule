import { NextRequest, NextResponse } from 'next/server';
// Gunakan supabase yang sudah kita perbaiki di lib/db.ts tadi
import { supabase } from '@/lib/db'; 

export const dynamic = 'force-dynamic'; // Tambahkan ini agar tidak error saat build

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('leader')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Leader GET error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('leader')
      .update({
        name: body.name,
        message: body.message,
        image_url: body.image_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)
      .select();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Leader PUT error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}