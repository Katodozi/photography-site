import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface ITagDocument extends Document {
  name: string;
  slug: string;
  count: number;
}

const TagSchema = new Schema<ITagDocument>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
});

const Tag: Model<ITagDocument> =
  mongoose.models.Tag || mongoose.model<ITagDocument>('Tag', TagSchema);

export default Tag;
