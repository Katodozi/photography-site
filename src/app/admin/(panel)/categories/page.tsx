'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import ConfirmModal from '@/components/admin/ConfirmModal';
import type { ICategory } from '@/types';
import { slugify } from '@/lib/utils';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#5C7A5A');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = () => {
    fetch('/api/admin/categories')
      .then((r) => r.json())
      .then(setCategories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug: slugify(name), color }),
    });
    if (res.ok) {
      setName('');
      fetchCategories();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/categories/${deleteId}`, { method: 'DELETE' });
      fetchCategories();
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const inputClass =
    'rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text';

  return (
    <div>
      <AdminHeader title="Categories" description="Organize photos by type" />

      <div className="mb-8 overflow-x-auto rounded-xl border border-admin-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-admin-border bg-admin-bg text-left text-admin-muted">
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Color</th>
              <th className="p-3">Photos</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-b border-admin-border/50">
                <td className="p-3 font-medium text-admin-text">{cat.name}</td>
                <td className="p-3 text-admin-muted">{cat.slug}</td>
                <td className="p-3">
                  <span
                    className="inline-block h-6 w-6 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                </td>
                <td className="p-3 text-admin-muted">{cat.photoCount ?? 0}</td>
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() => setDeleteId(cat._id)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-3 rounded-xl border border-admin-border bg-admin-surface p-4">
        <div>
          <label className="mb-1 block text-sm text-admin-muted">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
        </div>
        <div>
          <label className="mb-1 block text-sm text-admin-muted">Color</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-14 cursor-pointer rounded border border-admin-border bg-admin-bg" />
        </div>
        <button type="submit" className="rounded-lg bg-admin-primary px-4 py-2 text-sm font-medium text-admin-bg">
          Add Category
        </button>
      </form>

      <ConfirmModal
        open={!!deleteId}
        title="Delete Category"
        message="Categories with photos cannot be deleted."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
