import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password diperlukan' }, { status: 400 });
    }

    // Sign up user dengan Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Create user record in users table
    if (authData.user) {
      const { error: dbError } = await supabase
        .from('admin_users')
        .insert([
          {
            id: authData.user.id,
            email: authData.user.email,
            created_at: new Date().toISOString(),
          },
        ]);

      if (dbError) {
        console.error('Database error:', dbError);
        // Continue anyway, auth user is created
      }
    }

    return NextResponse.json({ 
      message: 'Registrasi berhasil!',
      user: authData.user 
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat registrasi' }, { status: 500 });
  }
}
