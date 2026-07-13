'use client';

import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import PhotoForm from '@/components/admin/PhotoForm';

export default function UploadPhotoPage() {
  const router = useRouter();

  const handleSubmit = async (data: Record<string, unknown>) => {
    const res = await fetch('/api/admin/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Failed to create');

    router.push('/admin/photos');
  };

  return (
    <div>
      <AdminHeader
        title="Upload New Photo"
        description="Upload an image and add metadata"
      />
      <PhotoForm onSubmit={handleSubmit} submitLabel="Upload & Save" />
    </div>
  );
}
