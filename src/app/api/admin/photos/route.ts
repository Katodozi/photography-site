import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Photo from '@/models/Photo';
import { resolveTags, serializeDoc, updateTagCounts, assignHomepageSlot } from '@/lib/db-helpers';
import { apiError } from '@/lib/api-helpers';

export async function GET(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const album = searchParams.get('album');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const filter: Record<string, unknown> = {};
    if (status && status !== 'all') filter.status = status;
    if (album) filter.album = album;
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (featured === 'false') filter.featured = false;

    const skip = (page - 1) * limit;

    const [photos, total] = await Promise.all([
      Photo.find(filter)
        .populate('album', 'name slug')
        .populate('category', 'name slug color')
        .populate('tags', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Photo.countDocuments(filter),
    ]);

    return NextResponse.json({
      photos: photos.map((p) => serializeDoc(p as never)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return apiError(error, 'Admin photos fetch error:');
  }
}

export async function POST(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const body = await request.json();

    const tagIds = body.tagNames ? await resolveTags(body.tagNames) : [];

    const photo = await Photo.create({
      title: body.title,
      description: body.description || '',
      imageUrl: body.imageUrl,
      thumbnailUrl: body.thumbnailUrl || body.imageUrl,
      blobPathname: body.blobPathname,
      album: body.album || undefined,
      category: body.category || undefined,
      tags: tagIds,
      featured: body.featured || false,
      homepageSlot: body.homepageSlot || 'none',
      status: body.status || 'draft',
      location: body.location || '',
      dateTaken: body.dateTaken || undefined,
      width: body.width || 0,
      height: body.height || 0,
      fileSize: body.fileSize || 0,
      order: body.order || 0,
    });

    if (tagIds.length) {
      await updateTagCounts([], tagIds);
    }

    if (body.homepageSlot && body.homepageSlot !== 'none') {
      await assignHomepageSlot(String(photo._id), body.homepageSlot);
    }

    const saved = await Photo.findById(photo._id).lean();
    return NextResponse.json(serializeDoc(saved as never), { status: 201 });
  } catch (error) {
    console.error('Photo create error:', error);
    return NextResponse.json({ error: 'Failed to create photo' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const body = await request.json();
    const { ids, action } = body;

    if (!ids?.length || !action) {
      return NextResponse.json({ error: 'Missing ids or action' }, { status: 400 });
    }

    const updateMap: Record<string, Record<string, unknown>> = {
      publish: { status: 'published' },
      draft: { status: 'draft' },
      feature: { featured: true },
      unfeature: { featured: false },
    };

    if (action === 'delete') {
      const photos = await Photo.find({ _id: { $in: ids } });
      const { del } = await import('@vercel/blob');

      for (const photo of photos) {
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
      }

      await Photo.deleteMany({ _id: { $in: ids } });
      return NextResponse.json({ success: true, deleted: ids.length });
    }

    if (updateMap[action]) {
      await Photo.updateMany({ _id: { $in: ids } }, updateMap[action]);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Bulk action error:', error);
    return NextResponse.json({ error: 'Bulk action failed' }, { status: 500 });
  }
}
