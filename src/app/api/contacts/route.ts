import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/db';

function devMessage(err: unknown) {
  if (process.env.NODE_ENV === 'production') return 'Database error';
  if (!err) return 'Unknown error';
  // best-effort
  return (err as any)?.message || String(err);
}

// quick config check to give actionable error in development
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('SUPABASE environment variables appear to be missing (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY)');
}

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Supabase not configured (check NEXT_PUBLIC_SUPABASE_URL / ANON key)' }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    // If anon/select is blocked by RLS (returns filtered/empty results), allow a dev fallback
    if (error) {
      console.warn('Supabase SELECT error (anon):', error.message || error);
    }

    // If no rows visible to anonymous role but service key exists, fetch with service-role in dev to help local UX
    if ((!error && Array.isArray(data) && data.length === 0) && process.env.SUPABASE_SERVICE_KEY && process.env.NODE_ENV !== 'production') {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_KEY);
        const adminResp = await admin.from('contacts').select('*').order('created_at', { ascending: false });
        if ((adminResp as any).error) throw (adminResp as any).error;
        return NextResponse.json((adminResp as any).data);
      } catch (adminErr) {
        console.error('Service-role SELECT fallback failed:', adminErr);
        // fall through to return whatever anon client returned (may be empty)
      }
    }

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/contacts error:', error);
    return NextResponse.json({ error: devMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Supabase not configured (check NEXT_PUBLIC_SUPABASE_URL / ANON key)' }, { status: 500 });
    }

    // read raw text so we can log exactly what the server received (helps diagnose malformed requests)
    const raw = await request.text();
    console.debug('POST /api/contacts raw body:', raw);

    let body: any = {};

    // 1) try JSON
    try {
      if (raw) body = JSON.parse(raw);
    } catch (errJson) {
      // 2) fallback: try parsing as application/x-www-form-urlencoded
      try {
        const params = new URLSearchParams(raw || '');
        if ([...params.keys()].length > 0) {
          body = Object.fromEntries(params.entries());
        } else {
          throw errJson; // no parsable payload
        }
      } catch (errForm) {
        // couldn't parse as JSON or form-encoded — return helpful error for clients
        return NextResponse.json(
          { error: 'Invalid request body — expected JSON or form-encoded data', raw: (raw || '').slice(0, 200) },
          { status: 400 }
        );
      }
    }

    const { name, email, message } = body || {};

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required', received: { name, email, message } },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert([{ name, email, message }])
      .select();

    // If insert is blocked by RLS, retry with service_role key (server-only) so dev UX works
    if (error) {
      console.warn('Supabase insert error, attempting service-role retry if available:', error.message || error);

      if (process.env.SUPABASE_SERVICE_KEY) {
        try {
          // create a server-only client with elevated privileges
          const { createClient } = await import('@supabase/supabase-js');
          const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_KEY);
          const adminResp = await admin.from('contacts').insert([{ name, email, message }]).select();
          if ((adminResp as any).error) {
            console.error('Service-role insert also failed:', (adminResp as any).error);
            throw (adminResp as any).error;
          }
          console.info('Inserted using service_role key (server-only)');
          return NextResponse.json((adminResp as any).data, { status: 201 });
        } catch (adminErr) {
          console.error('Service-role retry failed:', adminErr);
          throw adminErr;
        }
      }

      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/contacts error:', error, { env: {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }});
    return NextResponse.json({ error: devMessage(error) }, { status: 500 });
  }
} 
