import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryDetailClient from '@/components/public/CategoryDetailClient';
import { getCategoryBySlug } from '@/lib/data';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await getCategoryBySlug(params.slug);
  if (!data) return { title: 'Category Not Found' };

  return {
    title: data.category.name,
    description: data.category.description || `${data.category.name} photography`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getCategoryBySlug(params.slug);
  if (!data) notFound();

  return (
    <CategoryDetailClient category={data.category} photos={data.photos} />
  );
}
