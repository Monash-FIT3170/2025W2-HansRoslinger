// app/layout.tsx
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import ReturnToDashboard from "@/components/ReturnToDashboard";
import Logout from "@/components/Logout";

export const metadata = {
  title: "Yubi",
  description: "Gesture-controlled file visualizer",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <div className="flex flex-col h-full bg-[#fffcee]">
          <header className="h-20 px-6 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center">
              <Image
                src="/yubi-logo.png"
                alt="Yubi Logo"
                width={65}
                height={65}
                style={{ height: "auto" }}
              />
              <span className="text-4xl font-bold text-[#1e1e1e]">Yubi</span>
            </Link>
            {/* Conditionally rendered return button */}
            <ReturnToDashboard />
            <Logout />
          </header>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
