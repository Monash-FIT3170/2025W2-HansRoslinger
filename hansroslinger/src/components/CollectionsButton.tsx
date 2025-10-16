"use client";

import Link from "next/link";

export default function CollectionsButton() {
  return (
    <Link
      href="/collections"
      className="group relative inline-flex items-center justify-center gap-3 w-60 bg-gradient-to-r from-[#E5A168] to-[#d89157] px-10 py-4 text-base font-bold text-white shadow-xl shadow-[#E5A168]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#E5A168]/70 hover:-translate-y-2 hover:scale-105 active:translate-y-0 active:scale-100 overflow-hidden"
    >
      {/* Animated shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      
      {/* Glow border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#E5A168] to-[#FBC841] opacity-0 group-hover:opacity-75 blur-sm transition-opacity duration-300"></div>
      
      <svg 
        className="w-6 h-6 transition-transform group-hover:scale-110 group-hover:-rotate-6 relative z-10" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2.5} 
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
        />
      </svg>
      <span className="relative z-10 tracking-wide">Collections</span>
    </Link>
  );
}
