"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Upload() {
  const pathname = usePathname();

  if (!pathname.startsWith("/")) return null;

  return (
    <Link
      href="/upload"
      className="group inline-flex items-center justify-center gap-2 bg-[#5C9BB8] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#5C9BB8]/40 transition-all hover:shadow-2xl hover:shadow-[#5C9BB8]/60 hover:-translate-y-1 hover:bg-[#4a89a6] hover:text-white active:translate-y-0"
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
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
        />
      </svg>
      <span>Upload</span>
    </Link>
  );
}
