import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { apiError } from '@/lib/api-helpers';
import Photo from '@/models/Photo';
import Album from '@/models/Album';
import Category from '@/models/Category';

export async function GET(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();

    const [
      totalPhotos,
      publishedPhotos,
      draftPhotos,
      featuredPhotos,
      totalAlbums,
      totalCategories,
      totalViews,
      recentPhotos,
    ] = await Promise.all([
      Photo.countDocuments(),
      Photo.countDocuments({ status: 'published' }),
      Photo.countDocuments({ status: 'draft' }),
      Photo.countDocuments({ featured: true }),
      Album.countDocuments(),
      Category.countDocuments(),
      Photo.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
      Photo.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .select('title thumbnailUrl imageUrl status createdAt')
        .lean(),
    ]);

    let blobUsage = { count: 0, totalSize: 0 };
    try {
      const { blobs } = await list();
      blobUsage = {
        count: blobs.length,
        totalSize: blobs.reduce((sum, b) => sum + (b.size || 0), 0),
      };
    } catch {
      // Blob not configured yet
    }

    return NextResponse.json({
      stats: {
        totalPhotos,
        publishedPhotos,
        draftPhotos,
        featuredPhotos,
        totalAlbums,
        totalCategories,
        totalViews: totalViews[0]?.total || 0,
      },
      recentPhotos: recentPhotos.map((p) => ({
        ...p,
        _id: String(p._id),
      })),
      blobUsage,
    });
  } catch (error) {
    return apiError(error, 'Dashboard stats error:');
  }
}
