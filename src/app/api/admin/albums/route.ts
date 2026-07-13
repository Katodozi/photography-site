import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Album from '@/models/Album';
import Photo from '@/models/Photo';
import { serializeDoc } from '@/lib/db-helpers';
import { slugify } from '@/lib/utils';

export async function GET(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();

    const albums = await Album.find()
      .sort({ order: 1, createdAt: -1 })
      .populate('coverPhoto', 'imageUrl thumbnailUrl title')
      .lean();

    const albumsWithCount = await Promise.all(
      albums.map(async (album) => {
        const photoCount = await Photo.countDocuments({ album: album._id });
        return { ...serializeDoc(album as never), photoCount };
      })
    );

    return NextResponse.json(albumsWithCount);
  } catch (error) {
    console.error('Admin albums fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch albums' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const body = await request.json();

    const slug = body.slug || slugify(body.name);

    const existing = await Album.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const album = await Album.create({
      name: body.name,
      slug,
      description: body.description || '',
      coverPhoto: body.coverPhoto || undefined,
      status: body.status || 'draft',
      order: body.order || 0,
    });

    return NextResponse.json(serializeDoc(album), { status: 201 });
  } catch (error) {
    console.error('Album create error:', error);
    return NextResponse.json({ error: 'Failed to create album' }, { status: 500 });
  }
}
