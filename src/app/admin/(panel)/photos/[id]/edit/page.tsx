'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import PhotoForm from '@/components/admin/PhotoForm';
import type { IPhoto } from '@/types';

export default function EditPhotoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [photo, setPhoto] = useState<IPhoto | null>(null);

  useEffect(() => {
    fetch(`/api/admin/photos/${params.id}`)
      .then((r) => r.json())
      .then(setPhoto);
  }, [params.id]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/photos/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Failed to update');

    router.push('/admin/photos');
  };

  if (!photo) {
    return <div className="text-admin-muted">Loading...</div>;
  }

  return (
    <div>
      <AdminHeader title="Edit Photo" description={photo.title} />
      <PhotoForm
        initialData={photo}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}
