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
  color = '#8fa888',
  active,
  onClick,
  href,
}: CategoryPillProps) {
  const className = cn(
    'inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300',
    active
      ? 'text-bg shadow-glow'
      : 'border border-border/60 bg-surface text-muted hover:border-accent/40 hover:text-text'
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
