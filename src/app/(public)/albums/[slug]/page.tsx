import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AlbumDetailClient from '@/components/public/AlbumDetailClient';
import { getAlbumBySlug } from '@/lib/data';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await getAlbumBySlug(params.slug);
  if (!data) return { title: 'Album Not Found' };

  return {
    title: data.album.name,
    description: data.album.description || `Photos from ${data.album.name}`,
  };
}

export default async function AlbumPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getAlbumBySlug(params.slug);
  if (!data) notFound();

  return <AlbumDetailClient album={data.album} photos={data.photos} />;
}
