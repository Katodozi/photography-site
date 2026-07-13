'use client';

interface LoadMoreProps {
  onClick: () => void;
  loading?: boolean;
  hasMore?: boolean;
}

export default function LoadMore({ onClick, loading, hasMore = true }: LoadMoreProps) {
  if (!hasMore) return null;

  return (
    <div className="mt-12 flex justify-center">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="rounded-full border border-accent bg-transparent px-8 py-3 text-sm font-medium text-accent transition-all hover:bg-accent hover:text-white disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Load More'}
      </button>
    </div>
  );
}
