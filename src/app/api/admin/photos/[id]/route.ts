import { NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Photo from '@/models/Photo';
import { resolveTags, serializeDoc, updateTagCounts } from '@/lib/db-helpers';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();

    const photo = await Photo.findById(params.id)
      .populate('album', 'name slug')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug')
      .lean();

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    return NextResponse.json(serializeDoc(photo as never));
  } catch (error) {
    console.error('Admin photo fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch photo' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const body = await request.json();

    const existing = await Photo.findById(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    const update: Record<string, unknown> = {};
    const fields = [
      'title', 'description', 'album', 'category', 'featured', 'status',
      'location', 'dateTaken', 'order',
    ];

    for (const field of fields) {
      if (body[field] !== undefined) update[field] = body[field];
    }

    if (body.tagNames) {
      const newTagIds = await resolveTags(body.tagNames);
      await updateTagCounts(existing.tags, newTagIds);
      update.tags = newTagIds;
    }

    const photo = await Photo.findByIdAndUpdate(params.id, update, { new: true })
      .populate('album', 'name slug')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug')
      .lean();

    return NextResponse.json(serializeDoc(photo as never));
  } catch (error) {
    console.error('Photo update error:', error);
    return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();

    const photo = await Photo.findById(params.id);
    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    if (photo.blobPathname) {
      try {
        await del(photo.blobPathname);
      } catch (e) {
        console.error('Blob delete error:', e);
      }
    }

    if (photo.tags?.length) {
      await updateTagCounts(photo.tags, []);
    }

    await Photo.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Photo delete error:', error);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
