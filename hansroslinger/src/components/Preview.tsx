"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Preview() {
  const pathname = usePathname();

  if (!pathname.startsWith("/")) return null;

  return (
    <Link
      href="/preview"
      className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#FC9770] to-[#fb8659] px-10 py-4 text-base font-bold text-white shadow-xl shadow-[#FC9770]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#FC9770]/70 hover:-translate-y-2 hover:scale-105 active:translate-y-0 active:scale-100 overflow-hidden"
    >
      {/* Animated shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      
      {/* Glow border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FC9770] to-[#FBC841] opacity-0 group-hover:opacity-75 blur-sm transition-opacity duration-300"></div>
      
      <svg 
        className="w-6 h-6 transition-transform group-hover:scale-110 group-hover:rotate-12 relative z-10" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2.5} 
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
        />
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2.5} 
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
        />
      </svg>
      <span className="relative z-10 tracking-wide">Preview</span>
    </Link>
  );
}
