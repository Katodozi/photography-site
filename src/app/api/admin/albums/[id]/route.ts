import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Album from '@/models/Album';
import Photo from '@/models/Photo';
import { serializeDoc } from '@/lib/db-helpers';
import { slugify } from '@/lib/utils';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();

    const album = await Album.findById(params.id)
      .populate('coverPhoto', 'imageUrl thumbnailUrl title')
      .lean();

    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    return NextResponse.json(serializeDoc(album as never));
  } catch (error) {
    console.error('Admin album fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch album' }, { status: 500 });
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

    const update: Record<string, unknown> = {};
    if (body.name) update.name = body.name;
    if (body.slug) update.slug = body.slug;
    if (body.description !== undefined) update.description = body.description;
    if (body.coverPhoto !== undefined) update.coverPhoto = body.coverPhoto || null;
    if (body.status) update.status = body.status;
    if (body.order !== undefined) update.order = body.order;

    if (body.name && !body.slug) {
      update.slug = slugify(body.name);
    }

    const album = await Album.findByIdAndUpdate(params.id, update, { new: true })
      .populate('coverPhoto', 'imageUrl thumbnailUrl title')
      .lean();

    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    return NextResponse.json(serializeDoc(album as never));
  } catch (error) {
    console.error('Album update error:', error);
    return NextResponse.json({ error: 'Failed to update album' }, { status: 500 });
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

    const photoCount = await Photo.countDocuments({ album: params.id });
    if (photoCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete album with ${photoCount} photos` },
        { status: 400 }
      );
    }

    await Album.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Album delete error:', error);
    return NextResponse.json({ error: 'Failed to delete album' }, { status: 500 });
  }
}
