import { connectDB } from '@/lib/mongodb';
import Tag from '@/models/Tag';
import { slugify } from '@/lib/utils';
import type { Types } from 'mongoose';

export async function updateTagCounts(
  oldTagIds: Types.ObjectId[] = [],
  newTagIds: Types.ObjectId[] = []
) {
  await connectDB();

  const oldSet = new Set(oldTagIds.map((id) => id.toString()));
  const newSet = new Set(newTagIds.map((id) => id.toString()));

  const toDecrement = [...oldSet].filter((id) => !newSet.has(id));
  const toIncrement = [...newSet].filter((id) => !oldSet.has(id));

  if (toDecrement.length) {
    await Tag.updateMany(
      { _id: { $in: toDecrement } },
      { $inc: { count: -1 } }
    );
  }

  if (toIncrement.length) {
    await Tag.updateMany(
      { _id: { $in: toIncrement } },
      { $inc: { count: 1 } }
    );
  }
}

export async function resolveTags(tagNames: string[]): Promise<Types.ObjectId[]> {
  await connectDB();
  const ids: Types.ObjectId[] = [];

  for (const name of tagNames) {
    const trimmed = name.trim();
    if (!trimmed) continue;

    const slug = slugify(trimmed);
    let tag = await Tag.findOne({ slug });

    if (!tag) {
      tag = await Tag.create({ name: trimmed, slug, count: 0 });
    }

    ids.push(tag._id);
  }

  return ids;
}

export function serializeDoc<T extends { _id: unknown; toObject?: () => Record<string, unknown> }>(
  doc: T
): Record<string, unknown> {
  const obj = doc.toObject ? doc.toObject() : (doc as Record<string, unknown>);
  return {
    ...obj,
    _id: String(obj._id),
  };
}
