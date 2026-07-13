import type { Metadata } from 'next';
import AlbumCard from '@/components/public/AlbumCard';
import { getPublishedAlbums } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Albums',
  description: 'Explore photo albums and collections.',
};

export default async function AlbumsPage() {
  const albums = await getPublishedAlbums();

  return (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <h1 className="font-heading text-4xl font-medium text-text md:text-5xl">
        Albums
      </h1>
      <p className="mt-2 text-muted">Curated collections of photographs</p>

      {albums.length === 0 ? (
        <p className="mt-12 text-center text-muted">No albums published yet.</p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <AlbumCard key={album._id} album={album} />
          ))}
        </div>
      )}
    </div>
  );
}
