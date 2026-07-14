'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiImage,
  FiFolder,
  FiTag,
  FiHash,
  FiSettings,
  FiLogOut,
  FiUpload,
  FiLayout,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: FiHome },
  { href: '/admin/photos', label: 'All Photos', icon: FiImage },
  { href: '/admin/photos/upload', label: 'Upload New', icon: FiUpload },
  { href: '/admin/homepage', label: 'Homepage', icon: FiLayout },
  { href: '/admin/albums', label: 'Albums', icon: FiFolder },
  { href: '/admin/categories', label: 'Categories', icon: FiTag },
  { href: '/admin/tags', label: 'Tags', icon: FiHash },
  { href: '/admin/settings', label: 'Settings', icon: FiSettings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-admin-bg border-r border-admin-border">
      <div className="border-b border-admin-border px-6 py-5">
        <Link href="/admin" className="font-heading text-lg text-admin-text">
          Passing Through
        </Link>
        <p className="text-xs text-admin-muted">Admin Panel</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                active
                  ? 'bg-admin-surface text-admin-primary'
                  : 'text-admin-muted hover:bg-admin-surface hover:text-admin-text'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-admin-border p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-admin-muted transition-colors hover:bg-admin-surface hover:text-red-400"
        >
          <FiLogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
