import { connectDB } from '@/lib/mongodb';
import Tag from '@/models/Tag';
import Photo from '@/models/Photo';
import { slugify } from '@/lib/utils';
import type { Types } from 'mongoose';

export type HomepageSlot = 'none' | 'hero' | 'cta';

export async function assignHomepageSlot(
  photoId: string,
  slot: HomepageSlot
): Promise<void> {
  await connectDB();

  if (slot === 'hero' || slot === 'cta') {
    await Photo.updateMany(
      { homepageSlot: slot, _id: { $ne: photoId } },
      { $set: { homepageSlot: 'none' } }
    );
  }

  await Photo.findByIdAndUpdate(photoId, {
    $set: {
      homepageSlot: slot,
      ...(slot !== 'none' ? { featured: true } : {}),
    },
  });
}

export async function updateTagCounts(
  oldTagIds: Types.ObjectId[] = [],
  newTagIds: Types.ObjectId[] = []
) {
  await connectDB();

  const oldSet = new Set(oldTagIds.map((id) => id.toString()));
  const newSet = new Set(newTagIds.map((id) => id.toString()));

  const toDecrement = Array.from(oldSet).filter((id) => !newSet.has(id));
  const toIncrement = Array.from(newSet).filter((id) => !oldSet.has(id));

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
