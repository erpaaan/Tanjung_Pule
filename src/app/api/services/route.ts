import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/db';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*');

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('services')
      .insert([{ name, description }])
      .select();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
