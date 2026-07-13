import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Tag from '@/models/Tag';
import Photo from '@/models/Photo';
import { serializeDoc } from '@/lib/db-helpers';

export async function GET() {
  try {
    await connectDB();

    const tags = await Tag.find({ count: { $gt: 0 } })
      .sort({ count: -1, name: 1 })
      .lean();

    if (tags.length > 0) {
      return NextResponse.json(tags.map((t) => serializeDoc(t as never)));
    }

    const photos = await Photo.find({ status: 'published' })
      .populate('tags', 'name slug count')
      .select('tags')
      .lean();

    const tagMap = new Map<string, Record<string, unknown>>();
    photos.forEach((photo) => {
      const photoTags = photo.tags as Array<{ _id: unknown; name: string; slug: string }>;
      photoTags?.forEach((tag) => {
        const id = String(tag._id);
        if (!tagMap.has(id)) {
          tagMap.set(id, { _id: id, name: tag.name, slug: tag.slug, count: 0 });
        }
        const entry = tagMap.get(id)!;
        entry.count = (entry.count as number) + 1;
      });
    });

    return NextResponse.json(Array.from(tagMap.values()));
  } catch (error) {
    console.error('Tags fetch error:', error);
    return NextResponse.json([]);
  }
}
