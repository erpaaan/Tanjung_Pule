import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', parseInt(params.id))
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('news')
      .update({ title, content })
      .eq('id', parseInt(params.id))
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', parseInt(params.id));

    if (error) throw error;
    return NextResponse.json({ success: true, message: 'News deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
