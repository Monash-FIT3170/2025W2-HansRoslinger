'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ReturnToDashboard() {
  const pathname = usePathname();

  if (!pathname.startsWith('/preview')) return null;

  return (
    <Link
      href="/"
      className="text-sm px-4 py-2 rounded transition-colors duration-200"
      style={{
        backgroundColor: 'black',
        color: 'white',
      }}
      onMouseEnter={(e) => {
        (e.target as HTMLElement).style.backgroundColor = 'var(--accent)';
        (e.target as HTMLElement).style.color = 'white';
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLElement).style.backgroundColor = 'black';
        (e.target as HTMLElement).style.color = 'white';
      }}
    >
      Return to Dashboard
    </Link>
  );
}
