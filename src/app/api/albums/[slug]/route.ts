import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Album from '@/models/Album';
import Photo from '@/models/Photo';
import { serializeDoc } from '@/lib/db-helpers';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const album = await Album.findOne({ slug: params.slug, status: 'published' })
      .populate('coverPhoto', 'imageUrl thumbnailUrl title')
      .lean();

    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    const photos = await Photo.find({ album: album._id, status: 'published' })
      .populate('category', 'name slug color')
      .populate('tags', 'name slug')
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      album: serializeDoc(album as never),
      photos: photos.map((p) => serializeDoc(p as never)),
    });
  } catch (error) {
    console.error('Album fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch album' }, { status: 500 });
  }
}
