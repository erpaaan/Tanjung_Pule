import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Server-side upload endpoint that uses SUPABASE_SERVICE_KEY to store images in Storage.
// Expects multipart/form-data with field name `file`.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const BUCKET = process.env.NEXT_PUBLIC_NEWS_BUCKET || 'news-images';

export async function POST(request: Request) {
  try {
    if (!supabaseServiceKey) {
      return NextResponse.json({ error: 'Service key not configured on server' }, { status: 500 });
    }

    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    // Defensive checks to avoid runtime crashes (common cause: non-file value or wrong field name)
    if (!file) {
      console.error('news-upload: no file field in formData', { keys: Array.from(formData.keys()) });
      return NextResponse.json({ error: 'No file provided. Make sure the upload uses multipart/form-data and the field name is "file".' }, { status: 400 });
    }

    // Ensure we have a File/Blob-like object
    const isFileLike = typeof (file as any)?.arrayBuffer === 'function' && typeof (file as any)?.type === 'string';
    if (!isFileLike) {
      console.error('news-upload: received non-file value for `file`', { fileType: typeof file, fileValue: String(file).slice(0, 200), keys: Array.from(formData.keys()) });
      return NextResponse.json({ error: 'Invalid upload: `file` must be a File/Blob. Did you append the file to FormData?' }, { status: 400 });
    }

    const fileObj = file as File;

    // simple server-side validation
    if (!fileObj.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image uploads are allowed' }, { status: 400 });
    }
    if (fileObj.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });

    const originalName = (fileObj as any).name || 'upload';
    const filename = `${Date.now()}-${String(originalName).replace(/[^a-zA-Z0-9.-]/g, '-')}`;
    const path = `public/${filename}`; // keep files under public/ inside bucket

    // upload (ArrayBuffer)
    const arrayBuffer = await fileObj.arrayBuffer();
    const { data, error } = await supabase.storage.from(BUCKET).upload(path, new Uint8Array(arrayBuffer), { upsert: false });
    if (error) {
      console.error('Supabase storage upload error:', error);
      return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
    }

    // get public URL (assumes bucket is public or uses signed URL)
    const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(path);
const publicUrl = publicData?.publicUrl || null;

return NextResponse.json({ url: publicUrl, key: path });
  } catch (err) {
    console.error('POST /api/news-upload error:', err);
    return NextResponse.json({ error: (err as Error).message || 'Upload error' }, { status: 500 });
  }
}
