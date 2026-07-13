import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Photo from '@/models/Photo';
import { serializeDoc } from '@/lib/db-helpers';

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const album = searchParams.get('album');
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort') || 'newest';

    const filter: Record<string, unknown> = { status: 'published' };

    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (album) filter.album = album;
    if (featured === 'true') filter.featured = true;

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      views: { views: -1 },
    };

    const skip = (page - 1) * limit;

    const [photos, total] = await Promise.all([
      Photo.find(filter)
        .populate('album', 'name slug')
        .populate('category', 'name slug color')
        .populate('tags', 'name slug')
        .sort(sortMap[sort] || sortMap.newest)
        .skip(skip)
        .limit(limit)
        .lean(),
      Photo.countDocuments(filter),
    ]);

    return NextResponse.json({
      photos: photos.map((p) => serializeDoc(p as never)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error('Photos fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}
