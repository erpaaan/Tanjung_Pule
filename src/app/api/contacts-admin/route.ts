import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const admin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  try {
    const { data, error } = await admin
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase (admin) GET /contacts error:', error);
      throw error;
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('GET /api/contacts-admin error:', err);
    const message = err instanceof Error ? err.message : 'Failed to fetch contacts (admin)';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const { error } = await admin.from('contacts').delete().eq('id', id);
    if (error) {
      console.error('Supabase (admin) DELETE /contacts error:', error);
      throw error;
    }

    return NextResponse.json({ success: true, message: 'Contact deleted' });
  } catch (err) {
    console.error('DELETE /api/contacts-admin error:', err);
    const message = err instanceof Error ? err.message : 'Failed to delete contact';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
