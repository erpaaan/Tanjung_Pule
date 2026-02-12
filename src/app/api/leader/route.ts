import { NextRequest, NextResponse } from 'next/server';
// Pastikan path ini benar merujuk ke file lib/db kamu
import { supabase } from '@/lib/db'; 

// Baris ini adalah KUNCI agar tidak error saat build di Vercel
export const dynamic = 'force-dynamic'; 

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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}