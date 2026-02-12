import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// GET: Ambil data statistik untuk ditampilkan di Home
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('statistics')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update data dari Dashboard Admin
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json(); 
    const { data, error } = await supabase
      .from('statistics')
      .update({
        total_residents: body.total_residents,
        male_residents: body.male_residents,
        female_residents: body.female_residents,
        total_families: body.total_families,
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