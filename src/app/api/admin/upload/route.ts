import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getSession } from '@/lib/auth';

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function getBlobToken(): string | undefined {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return undefined;
  return token.trim().replace(/^["']|["']$/g, '');
}

export async function POST(request: Request) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = getBlobToken();
  if (!token) {
    return NextResponse.json(
      { error: 'BLOB_READ_WRITE_TOKEN is not configured. Add a Vercel Blob store to your project.' },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPEG, PNG, and WebP images are allowed' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size must be under 10MB' }, { status: 400 });
    }

    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
      token,
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      downloadUrl: blob.downloadUrl,
    });
  } catch (error) {
    console.error('Admin upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
