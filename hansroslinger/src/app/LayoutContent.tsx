"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ReturnToDashboard from "@/components/ReturnToDashboard";
import LogoutButton from "@/components/LogoutButton";

export default function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideHeader = pathname === "/login" || pathname === "/signup";

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      {!hideHeader && (
        <header className="sticky top-0 z-50 glass border-b border-[#E5A168]/20 shadow-lg">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
            <Link href="/dashboard" className="flex items-center gap-3 group transition-all">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FC9770]/50 to-[#5C9BB8]/50 rounded-full blur-md opacity-0 group-hover:opacity-75 transition-opacity"></div>
                <Image
                  src="/yubi-logo.png"
                  alt="Yubi Logo"
                  width={48}
                  height={48}
                  style={{ height: "auto" }}
                  className="relative z-10"
                />
              </div>
              <span className="text-2xl font-bold gradient-text font-notulen">Yubi</span>
            </Link>
            
            {/* Navigation hint */}
            <div className="hidden md:flex items-center gap-6 text-sm text-[#4a4a4a]">
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 hover:text-[#5C9BB8] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
              <Link 
                href="/collections" 
                className="flex items-center gap-2 hover:text-[#FC9770] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Collections
              </Link>
            </div>
            
            {/* Right-side actions */}
            <div className="flex items-center gap-3">
            <ReturnToDashboard />
            <LogoutButton />
            </div>
          </div>
        </header>
      )}
      <main className={hideHeader ? "h-full" : "flex-1 overflow-y-auto"}>
        {children}
      </main>
    </div>
  );
}

