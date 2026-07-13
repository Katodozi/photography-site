import type { Metadata } from 'next';
import Link from 'next/link';
import HeroSection from '@/components/public/HeroSection';
import PhotoGrid from '@/components/public/PhotoGrid';
import AlbumCard from '@/components/public/AlbumCard';
import CategoryPill from '@/components/public/CategoryPill';
import InstagramSection from '@/components/public/InstagramSection';
import FeaturedGallery from '@/components/public/FeaturedGallery';
import {
  getFeaturedPhotos,
  getHeroPhoto,
  getPublishedAlbums,
  getCategories,
} from '@/lib/data';

export const metadata: Metadata = {
  title: 'Passing Through 2000s',
  description:
    'Nature photography from the early 2000s — landscapes, wildlife, and quiet moments captured along the way.',
};

export default async function HomePage() {
  const [heroPhoto, featuredPhotos, albums, categories] = await Promise.all([
    getHeroPhoto(),
    getFeaturedPhotos(6),
    getPublishedAlbums(),
    getCategories(),
  ]);

  return (
    <>
      <HeroSection featuredPhoto={heroPhoto} />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="font-heading text-3xl font-medium text-text md:text-4xl">
          Featured Photos
        </h2>
        <p className="mt-2 text-muted">A curated selection from the collection</p>
        <div className="mt-8">
          <FeaturedGallery photos={featuredPhotos} />
        </div>
      </section>

      {albums.length > 0 && (
        <section className="bg-surface py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-heading text-3xl font-medium text-text">Albums</h2>
                <p className="mt-2 text-muted">Explore photo collections</p>
              </div>
              <Link
                href="/albums"
                className="text-sm font-medium text-accent hover:underline"
              >
                View all →
              </Link>
            </div>

            <div className="mt-8 flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {albums.map((album) => (
                <div key={album._id} className="w-72 flex-shrink-0">
                  <AlbumCard album={album} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="font-heading text-3xl font-medium text-text">Categories</h2>
          <p className="mt-2 text-muted">Browse by subject</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((cat) => (
              <CategoryPill
                key={cat._id}
                name={cat.name}
                slug={cat.slug}
                color={cat.color}
                href={`/categories/${cat.slug}`}
              />
            ))}
          </div>
        </section>
      )}

      <InstagramSection />

      <section className="border-t border-border bg-surface py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="font-heading text-2xl font-light italic text-text md:text-3xl">
            Photographs from a time when the world moved slower,
          </p>
          <p className="mt-2 font-heading text-2xl font-light italic text-muted md:text-3xl">
            and nature still had room to breathe.
          </p>
        </div>
      </section>
    </>
  );
}
