import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import Photo from '@/models/Photo';
import { serializeDoc } from '@/lib/db-helpers';

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find().sort({ name: 1 }).lean();

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const photoCount = await Photo.countDocuments({
          category: cat._id,
          status: 'published',
        });
        return { ...serializeDoc(cat as never), photoCount };
      })
    );

    return NextResponse.json(categoriesWithCount);
  } catch (error) {
    console.error('Categories fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
