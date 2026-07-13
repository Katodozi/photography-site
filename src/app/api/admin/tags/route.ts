import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Tag from '@/models/Tag';
import { serializeDoc } from '@/lib/db-helpers';
import { slugify } from '@/lib/utils';

export async function GET(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const tags = await Tag.find().sort({ count: -1, name: 1 }).lean();
    return NextResponse.json(tags.map((t) => serializeDoc(t as never)));
  } catch (error) {
    console.error('Tags fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const body = await request.json();

    const slug = slugify(body.name);
    const existing = await Tag.findOne({ slug });
    if (existing) {
      return NextResponse.json(serializeDoc(existing));
    }

    const tag = await Tag.create({ name: body.name, slug, count: 0 });
    return NextResponse.json(serializeDoc(tag), { status: 201 });
  } catch (error) {
    console.error('Tag create error:', error);
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}
