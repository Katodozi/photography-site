import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IPhotoDocument extends Document {
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  blobPathname: string;
  album: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
  featured: boolean;
  status: 'published' | 'draft';
  location?: string;
  dateTaken?: Date;
  width: number;
  height: number;
  fileSize: number;
  views: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PhotoSchema = new Schema<IPhotoDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    blobPathname: { type: String, required: true },
    album: { type: Schema.Types.ObjectId, ref: 'Album' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },
    location: { type: String, default: '' },
    dateTaken: { type: Date },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    fileSize: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PhotoSchema.index({ status: 1, featured: 1 });
PhotoSchema.index({ album: 1, order: 1 });
PhotoSchema.index({ category: 1 });

const Photo: Model<IPhotoDocument> =
  mongoose.models.Photo || mongoose.model<IPhotoDocument>('Photo', PhotoSchema);

export default Photo;
