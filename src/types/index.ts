export type PhotoStatus = 'published' | 'draft';

export interface IPhoto {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  blobPathname: string;
  album: string | IAlbum;
  category: string | ICategory;
  tags: (string | ITag)[];
  featured: boolean;
  homepageSlot: 'none' | 'hero' | 'cta';
  status: PhotoStatus;
  location?: string;
  dateTaken?: string;
  width: number;
  height: number;
  fileSize: number;
  views: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAlbum {
  _id: string;
  name: string;
  slug: string;
  description: string;
  coverPhoto?: string | IPhoto;
  status: PhotoStatus;
  order: number;
  photoCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  photoCount?: number;
  createdAt: string;
}

export interface ITag {
  _id: string;
  name: string;
  slug: string;
  count: number;
}

export interface SessionPayload {
  username: string;
  exp: number;
}

export interface PhotoFilters {
  category?: string;
  tag?: string;
  album?: string;
  featured?: boolean;
  status?: PhotoStatus;
  sort?: 'newest' | 'oldest' | 'views';
  page?: number;
  limit?: number;
}
