import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import Photo from '@/models/Photo';
import { serializeDoc } from '@/lib/db-helpers';
import { slugify } from '@/lib/utils';

export async function GET(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();

    const categories = await Category.find().sort({ name: 1 }).lean();

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const photoCount = await Photo.countDocuments({ category: cat._id });
        return { ...serializeDoc(cat as never), photoCount };
      })
    );

    return NextResponse.json(categoriesWithCount);
  } catch (error) {
    console.error('Admin categories fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const body = await request.json();

    const slug = body.slug || slugify(body.name);
    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const category = await Category.create({
      name: body.name,
      slug,
      description: body.description || '',
      color: body.color || '#5C7A5A',
    });

    return NextResponse.json(serializeDoc(category), { status: 201 });
  } catch (error) {
    console.error('Category create error:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
