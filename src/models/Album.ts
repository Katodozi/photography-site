import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IAlbumDocument extends Document {
  name: string;
  slug: string;
  description: string;
  coverPhoto?: mongoose.Types.ObjectId;
  status: 'published' | 'draft';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const AlbumSchema = new Schema<IAlbumDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    coverPhoto: { type: Schema.Types.ObjectId, ref: 'Photo' },
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Album: Model<IAlbumDocument> =
  mongoose.models.Album || mongoose.model<IAlbumDocument>('Album', AlbumSchema);

export default Album;
