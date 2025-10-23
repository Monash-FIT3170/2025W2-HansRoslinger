"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ReturnToDashboard() {
  const pathname = usePathname();

  // Show on all pages except dashboard, login, and signup
  if (
    pathname === "/dashboard" ||
    pathname === "/login" ||
    pathname === "/signup"
  )
    return null;

  return (
    <Link
      href="/dashboard"
      aria-label="Return to dashboard"
      className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-[#5C9BB8] to-[#4a89a6] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#5C9BB8]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#5C9BB8]/40 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
    >
      {/* Animated shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

      {/* Glow border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5C9BB8] to-[#7BAFD4] opacity-0 group-hover:opacity-75 blur-sm transition-opacity duration-300"></div>

      <svg
        className="w-5 h-5 transition-transform group-hover:-translate-x-1 relative z-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      <span className="relative z-10 tracking-wide">Dashboard</span>
    </Link>
  );
}
