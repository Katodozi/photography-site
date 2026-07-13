import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CategoryPillProps {
  name: string;
  slug: string;
  color?: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
}

export default function CategoryPill({
  name,
  color = '#5C7A5A',
  active,
  onClick,
  href,
}: CategoryPillProps) {
  const className = cn(
    'inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-all',
    active
      ? 'text-white shadow-sm'
      : 'bg-surface text-muted hover:bg-accent-light hover:text-accent'
  );

  const style = active ? { backgroundColor: color } : undefined;

  if (href) {
    return (
      <Link href={href} className={className} style={style}>
        {name}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className} style={style}>
      {name}
    </button>
  );
}
