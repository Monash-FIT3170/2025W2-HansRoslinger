"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ReturnToDashboard() {
  const pathname = usePathname();

  if (!pathname.startsWith("/preview")) return null;

  return (
    <Link
      href="/dashboard"
      aria-label="Return to dashboard"
      className="group inline-flex items-center gap-2 glass px-5 py-2.5 text-sm font-semibold shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
    >
      <svg 
        className="w-4 h-4 transition-transform group-hover:-translate-x-1" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M10 19l-7-7m0 0l7-7m-7 7h18" 
        />
      </svg>
      Dashboard
    </Link>
  );
}
