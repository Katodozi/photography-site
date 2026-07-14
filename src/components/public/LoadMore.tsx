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
        className="btn-outline disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Load More'}
      </button>
    </div>
  );
}
