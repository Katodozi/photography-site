import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Photo from '@/models/Photo';
import { assignHomepageSlot, serializeDoc } from '@/lib/db-helpers';
import { apiError } from '@/lib/api-helpers';

export async function GET(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();

    const photos = await Photo.find({ status: 'published' })
      .select('title thumbnailUrl imageUrl homepageSlot featured')
      .sort({ createdAt: -1 })
      .lean();

    const hero = photos.find((p) => p.homepageSlot === 'hero');
    const cta = photos.find((p) => p.homepageSlot === 'cta');

    return NextResponse.json({
      photos: photos.map((p) => serializeDoc(p as never)),
      heroId: hero ? String(hero._id) : null,
      ctaId: cta ? String(cta._id) : null,
    });
  } catch (error) {
    return apiError(error, 'Homepage slots fetch error:');
  }
}

export async function PATCH(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const { photoId, slot } = await request.json();

    if (!photoId || !['none', 'hero', 'cta'].includes(slot)) {
      return NextResponse.json({ error: 'Invalid photoId or slot' }, { status: 400 });
    }

    const photo = await Photo.findById(photoId);
    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    if (photo.status !== 'published' && slot !== 'none') {
      return NextResponse.json(
        { error: 'Only published photos can be assigned to homepage slots' },
        { status: 400 }
      );
    }

    await assignHomepageSlot(photoId, slot);

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error, 'Homepage slot update error:');
  }
}
