"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Preview() {
  const pathname = usePathname();

  if (!pathname.startsWith("/")) return null;

  return (
    <Link
      href="/preview"
      className="group inline-flex items-center justify-center gap-2 bg-[#FC9770] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#FC9770]/40 transition-all hover:shadow-2xl hover:shadow-[#FC9770]/60 hover:-translate-y-1 hover:bg-[#fb8659] hover:text-white active:translate-y-0"
    >
      <svg 
        className="w-5 h-5 transition-transform group-hover:scale-110" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
        />
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
        />
      </svg>
      <span>Preview</span>
    </Link>
  );
}
