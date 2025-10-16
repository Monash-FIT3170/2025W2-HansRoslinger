"use client";

import Link from "next/link";

export default function CollectionsButton() {
  return (
    <Link
      href="/collections"
      className="group inline-flex items-center justify-center gap-2 bg-[#E5A168] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#E5A168]/40 transition-all hover:shadow-2xl hover:shadow-[#E5A168]/60 hover:-translate-y-1 hover:bg-[#d89157] hover:text-white active:translate-y-0"
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
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
        />
      </svg>
      <span>Collections</span>
    </Link>
  );
}
