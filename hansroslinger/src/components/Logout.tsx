"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Logout() {
  const pathname = usePathname();

  // Don't show logout on login/signup pages
  if (pathname.startsWith("/login") || pathname.startsWith("/signup"))
    return null;

  const handleLogout = () => {
    // Clear all cookies
    document.cookie.split(";").forEach((cookie) => {
      const [name] = cookie.split("=");
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });

    window.location.href = "/login";
  };

  return (
    <button
      aria-label="Logout"
      className="text-xl px-4 py-2 rounded transition-colors duration-200"
      style={{ color: "black" }}
      onClick={handleLogout}
      onMouseEnter={(e) => {
        (e.target as HTMLElement).style.color = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLElement).style.color = "black";
      }}
    >
      Logout
    </button>
  );
}
