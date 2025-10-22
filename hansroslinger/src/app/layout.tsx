// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import type { Metadata } from "next";
import LayoutContent from "./LayoutContent";

export const metadata: Metadata = {
  title: "Yubi - Gesture-Controlled Visualisation",
  description:
    "Modern gesture-controlled file visualiser for interactive data exploration",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full font-recursive antialiased">
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
