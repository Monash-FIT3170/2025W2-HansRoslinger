"use client";

import Link from "next/link";

export default function CollectionsButton() {
  return (
    <Link
      href="/collections"
      className="bg-teal-500 hover:bg-black text-white text-lg px-6 py-3 rounded-md font-semibold shadow-md transition-colors duration-200"
      style={{
        color: "white",
      }}
    >
      Collections
    </Link>
  );
}
