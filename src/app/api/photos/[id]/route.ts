import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Photo from '@/models/Photo';
import { serializeDoc } from '@/lib/db-helpers';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const photo = await Photo.findByIdAndUpdate(
      params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('album', 'name slug')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug')
      .lean();

    if (!photo || photo.status !== 'published') {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    return NextResponse.json(serializeDoc(photo as never));
  } catch (error) {
    console.error('Photo fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch photo' }, { status: 500 });
  }
}
