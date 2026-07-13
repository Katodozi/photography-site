import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import Photo from '@/models/Photo';
import { serializeDoc } from '@/lib/db-helpers';
import { slugify } from '@/lib/utils';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const body = await request.json();

    const update: Record<string, unknown> = {};
    if (body.name) update.name = body.name;
    if (body.slug) update.slug = body.slug;
    if (body.description !== undefined) update.description = body.description;
    if (body.color) update.color = body.color;

    if (body.name && !body.slug) {
      update.slug = slugify(body.name);
    }

    const category = await Category.findByIdAndUpdate(params.id, update, { new: true }).lean();

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(serializeDoc(category as never));
  } catch (error) {
    console.error('Category update error:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();

    const photoCount = await Photo.countDocuments({ category: params.id });
    if (photoCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category with ${photoCount} photos` },
        { status: 400 }
      );
    }

    await Category.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Category delete error:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
