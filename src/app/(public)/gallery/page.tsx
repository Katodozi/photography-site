import type { Metadata } from 'next';
import GalleryPageClient from '@/components/public/GalleryPageClient';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Browse the full nature photography collection.',
};

export default function GalleryPage() {
  return <GalleryPageClient />;
}
