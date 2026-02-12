import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db'; 

// WAJIB ADA: Ini mencegah Vercel menjalankan file ini saat build
export const dynamic = 'force-dynamic'; 

export async function GET() {
  try {
    const { data, error } = await supabase.from('leader').select('*').eq('id', 1).single();
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