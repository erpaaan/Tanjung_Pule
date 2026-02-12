import { NextRequest, NextResponse } from 'next/server';
// Coba salah satu di bawah ini sampai garis merahnya hilang:
import { supabase } from '@/lib/db'; 
// ATAU jika @ tidak jalan:
// import { supabase } from '../../../lib/db';
/**
 * GET: Ambil detail satu user berdasarkan ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Wajib Promise di Next.js 16
) {
  const { id } = await params; // Wajib di-await

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

/**
 * PUT: Update data user (Optional jika kamu butuh)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { name, email } = body;

    const { data, error } = await supabase
      .from('users')
      .update({ name, email })
      .eq('id', id)
      .select();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

/**
 * DELETE: Hapus user
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}