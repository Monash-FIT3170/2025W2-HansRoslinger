'use client'
 
import { usePathname } from 'next/navigation'
import Link from 'next/link'
 
export default function Preview() {
  const pathname = usePathname()

  if (!pathname.startsWith('/')) return null;

  return (
  <Link 
    href="/preview"
    className="bg-teal-500 hover:bg-black text-white text-lg px-6 py-3 rounded-md font-semibold shadow-md transition-colors duration-200"
    style={{
        color: 'white',
      }}
    >
    Preview
  </Link>
);
}