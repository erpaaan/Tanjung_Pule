import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', parseInt(params.id))
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('users')
      .update({ name, email })
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
      .from('users')
      .delete()
      .eq('id', parseInt(params.id));

    if (error) throw error;
    return NextResponse.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
