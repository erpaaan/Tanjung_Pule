import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/db';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/news error:', error);
    const msg = (error as any)?.message || String(error);
    if (/column\s+"image_url"\s+does not exist/i.test(msg) || (error as any)?.code === '42703') {
      return NextResponse.json({
        error: 'Database missing column `image_url`. Run: ALTER TABLE news ADD COLUMN IF NOT EXISTS image_url TEXT;'
      }, { status: 500 });
    }
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, image_url } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const payload: any = { title, content };
    if (image_url) payload.image_url = image_url;

    const { data, error } = await supabase
      .from('news')
      .insert([payload])
      .select();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/news error:', error);
    const msg = (error as any)?.message || String(error);
    if (/column\s+"image_url"\s+does not exist/i.test(msg) || (error as any)?.code === '42703') {
      return NextResponse.json({
        error: 'Database missing column `image_url`. Run: ALTER TABLE news ADD COLUMN IF NOT EXISTS image_url TEXT;'
      }, { status: 500 });
    }
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
} 
