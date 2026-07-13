import { connectDB } from '@/lib/mongodb';
import Photo from '@/models/Photo';
import Album from '@/models/Album';
import Category from '@/models/Category';
import { serializeDoc } from '@/lib/db-helpers';
import type { IPhoto, IAlbum, ICategory } from '@/types';

export async function getFeaturedPhotos(limit = 6): Promise<IPhoto[]> {
  try {
    await connectDB();
    const photos = await Photo.find({ status: 'published', featured: true })
      .populate('category', 'name slug color')
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .lean();
    return photos.map((p) => serializeDoc(p as never) as unknown as IPhoto);
  } catch {
    return [];
  }
}

export async function getHeroPhoto(): Promise<IPhoto | null> {
  try {
    await connectDB();
    const photo = await Photo.findOne({ status: 'published', featured: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return photo ? (serializeDoc(photo as never) as unknown as IPhoto) : null;
  } catch {
    return null;
  }
}

export async function getPublishedAlbums(): Promise<IAlbum[]> {
  try {
    await connectDB();
    const albums = await Album.find({ status: 'published' })
      .sort({ order: 1, createdAt: -1 })
      .populate('coverPhoto', 'imageUrl thumbnailUrl title')
      .lean();

    const result = await Promise.all(
      albums.map(async (album) => {
        const photoCount = await Photo.countDocuments({
          album: album._id,
          status: 'published',
        });
        return {
          ...(serializeDoc(album as never) as unknown as IAlbum),
          photoCount,
        };
      })
    );

    return result;
  } catch {
    return [];
  }
}

export async function getCategories(): Promise<ICategory[]> {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 }).lean();

    const result = await Promise.all(
      categories.map(async (cat) => {
        const photoCount = await Photo.countDocuments({
          category: cat._id,
          status: 'published',
        });
        return {
          ...(serializeDoc(cat as never) as unknown as ICategory),
          photoCount,
        };
      })
    );

    return result;
  } catch {
    return [];
  }
}

export async function getAlbumBySlug(slug: string) {
  try {
    await connectDB();
    const album = await Album.findOne({ slug, status: 'published' })
      .populate('coverPhoto', 'imageUrl thumbnailUrl title')
      .lean();

    if (!album) return null;

    const photos = await Photo.find({ album: album._id, status: 'published' })
      .populate('category', 'name slug color')
      .populate('tags', 'name slug')
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return {
      album: serializeDoc(album as never) as unknown as IAlbum,
      photos: photos.map((p) => serializeDoc(p as never) as unknown as IPhoto),
    };
  } catch {
    return null;
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    await connectDB();
    const category = await Category.findOne({ slug }).lean();
    if (!category) return null;

    const photos = await Photo.find({
      category: category._id,
      status: 'published',
    })
      .populate('album', 'name slug')
      .populate('tags', 'name slug')
      .sort({ createdAt: -1 })
      .lean();

    return {
      category: serializeDoc(category as never) as unknown as ICategory,
      photos: photos.map((p) => serializeDoc(p as never) as unknown as IPhoto),
    };
  } catch {
    return null;
  }
}
