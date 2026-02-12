import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const fileName = `admin-${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage.from('news-images').upload(fileName, file);
    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage.from('news-images').getPublicUrl(fileName);
    return NextResponse.json({ url: publicUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}