"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Upload() {
  const pathname = usePathname();

  if (!pathname.startsWith("/")) return null;

  return (
    <Link
      href="/upload"
      className="group relative inline-flex items-center justify-center gap-3 w-60 bg-gradient-to-r from-[#5C9BB8] to-[#4a89a6] px-10 py-4 text-base font-bold text-white shadow-xl shadow-[#5C9BB8]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#5C9BB8]/70 hover:-translate-y-2 hover:scale-105 active:translate-y-0 active:scale-100 overflow-hidden"
    >
      {/* Animated shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

      {/* Glow border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5C9BB8] to-[#7BAFD4] opacity-0 group-hover:opacity-75 blur-sm transition-opacity duration-300"></div>

      <svg
        className="w-6 h-6 transition-transform group-hover:scale-110 group-hover:-rotate-12 relative z-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      <span className="relative z-10 tracking-wide">Upload</span>
    </Link>
  );
}
