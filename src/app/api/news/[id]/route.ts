import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/db';

/**
 * Interface untuk mendefinisikan tipe params sebagai Promise
 * Ini adalah standar wajib di Next.js 15.
 */
interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  // Menunggu Promise params agar id dapat diakses secara asinkron
  const { id } = await params;

  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', parseInt(id))
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: 'Berita tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Gagal memuat database' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Judul dan konten wajib diisi' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('news')
      .update({ title, content })
      .eq('id', parseInt(id))
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui database' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;

  try {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Berita berhasil dihapus' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Gagal menghapus data' }, { status: 500 });
  }
}