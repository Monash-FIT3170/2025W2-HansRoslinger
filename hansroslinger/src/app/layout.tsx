// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import localFont from "next/font/local";
import LayoutContent from "./LayoutContent";

// Primary typeface - Recursive Variable Font
const recursive = localFont({
  src: "../../public/fonts/recursive-variable.ttf",
  variable: "--font-recursive",
  display: "swap",
});

// Secondary typeface - Notulen Serif Display
const notulen = localFont({
  src: "../../public/fonts/notulen-serif-bold.otf",
  variable: "--font-notulen",
  display: "swap",
  weight: "700",
});

export const metadata = {
  title: "Yubi - Gesture-Controlled Visualisation",
  description: "Modern gesture-controlled file visualiser for interactive data exploration",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`h-full ${recursive.variable} ${notulen.variable}`}>
      <body className="h-full font-recursive antialiased">
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
