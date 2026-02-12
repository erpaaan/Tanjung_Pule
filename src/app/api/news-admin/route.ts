import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET all news
export async function GET() {
  try {
    console.log('Fetching news from Supabase...');
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('News fetched:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    const msg = (error as any)?.message || String(error);
    if (/column\s+"image_url"\s+does not exist/i.test(msg) || (error as any)?.code === '42703') {
      return NextResponse.json({ error: 'Database missing column `image_url`. Run: ALTER TABLE news ADD COLUMN IF NOT EXISTS image_url TEXT;' }, { status: 500 });
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch news';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST - Create new news
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, created_at, image_url } = body;

    if (!title || !content || !created_at) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Creating news with:', { title, content, created_at, image_url });

    const insertRow: any = {
      title,
      content,
      created_at: new Date(created_at).toISOString(),
    };
    if (image_url) insertRow.image_url = image_url;

    const { data, error } = await supabase
      .from('news')
      .insert([insertRow])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('News created successfully:', data);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    const msg = (error as any)?.message || String(error);
    if (/column\s+"image_url"\s+does not exist/i.test(msg) || (error as any)?.code === '42703') {
      return NextResponse.json({ error: 'Database missing column `image_url`. Run: ALTER TABLE news ADD COLUMN IF NOT EXISTS image_url TEXT;' }, { status: 500 });
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to create news';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 

// PUT - Update news
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, content, created_at, image_url } = body;

    if (!id || !title || !content || !created_at) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatePayload: any = {
      title,
      content,
      created_at: new Date(created_at).toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (image_url !== undefined) updatePayload.image_url = image_url || null;

    const { data, error } = await supabase
      .from('news')
      .update(updatePayload)
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating news:', error);
    const msg = (error as any)?.message || String(error);
    if (/column\s+"image_url"\s+does not exist/i.test(msg) || (error as any)?.code === '42703') {
      return NextResponse.json({ error: 'Database missing column `image_url`. Run: ALTER TABLE news ADD COLUMN IF NOT EXISTS image_url TEXT;' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
  }
} 

// DELETE - Delete news
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing news ID' }, { status: 400 });
    }

    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}
