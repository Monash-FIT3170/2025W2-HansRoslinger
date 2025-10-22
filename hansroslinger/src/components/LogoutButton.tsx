"use client";

import { useState } from "react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (e) {
      console.log(e)
      // ignore
    } finally {
      // Redirect regardless; middleware will enforce auth state
      window.location.href = "/login";
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      aria-label="Log out"
      className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#5C9BB8] to-[#4a89a6] px-6 py-2 text-sm font-bold text-white shadow-xl shadow-[#5C9BB8]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#5C9BB8]/70 hover:-translate-y-2 hover:scale-105 active:translate-y-0 active:scale-100 overflow-hidden rounded-none disabled:opacity-60"
    >
      {/* Animated shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      {/* Glow border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5C9BB8] to-[#7BAFD4] opacity-0 group-hover:opacity-75 blur-sm transition-opacity duration-300 rounded-none"></div>

      <svg
        className="w-4 h-4 transition-transform group-hover:scale-110 group-hover:-rotate-6 relative z-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5m0 0l-5-5m5 5H3"
        />
      </svg>
      <span className="relative z-10 tracking-wide">
        {loading ? "Logging out..." : "Log out"}
      </span>
    </button>
  );
}
