import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Album from '@/models/Album';
import Photo from '@/models/Photo';
import { serializeDoc } from '@/lib/db-helpers';

export async function GET() {
  try {
    await connectDB();

    const albums = await Album.find({ status: 'published' })
      .sort({ order: 1, createdAt: -1 })
      .populate('coverPhoto', 'imageUrl thumbnailUrl title')
      .lean();

    const albumsWithCount = await Promise.all(
      albums.map(async (album) => {
        const photoCount = await Photo.countDocuments({
          album: album._id,
          status: 'published',
        });
        return { ...serializeDoc(album as never), photoCount };
      })
    );

    return NextResponse.json(albumsWithCount);
  } catch (error) {
    console.error('Albums fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch albums' }, { status: 500 });
  }
}
