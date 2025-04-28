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
      className="text-xl px-4 py-2 rounded transition-colors duration-200"
      style={{
        color: "black",
      }}
      onMouseEnter={(e) => {
        (e.target as HTMLElement).style.color = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLElement).style.color = "black";
      }}
    >
      Return to Dashboard
    </Link>
  );
}
