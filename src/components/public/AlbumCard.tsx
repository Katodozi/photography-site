import Link from 'next/link';
import Image from 'next/image';
import type { IAlbum, IPhoto } from '@/types';

interface AlbumCardProps {
  album: IAlbum;
}

export default function AlbumCard({ album }: AlbumCardProps) {
  const cover = album.coverPhoto as IPhoto | undefined;

  return (
    <Link
      href={`/albums/${album.slug}`}
      className="group block overflow-hidden rounded-xl bg-surface shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {cover ? (
          <Image
            src={cover.thumbnailUrl || cover.imageUrl}
            alt={album.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-accent-light text-muted">
            No cover
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-heading text-xl font-medium text-text">{album.name}</h3>
        {album.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted">{album.description}</p>
        )}
        <p className="mt-2 text-xs text-muted">
          {album.photoCount ?? 0} photo{(album.photoCount ?? 0) !== 1 ? 's' : ''}
        </p>
      </div>
    </Link>
  );
}
