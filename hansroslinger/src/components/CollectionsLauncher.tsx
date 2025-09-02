"use client";

import { useState } from "react";
import CollectionsModal from "@/components/CollectionsModal";
import { Uploads } from "types/application";

type Props = {
  uploads: Uploads;
};

export default function CollectionsLauncher({ uploads }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-white border border-black hover:bg-black hover:text-white text-black text-lg px-6 py-3 rounded-md font-semibold shadow-md transition-colors duration-200"
      >
        Collections
      </button>
      <CollectionsModal uploads={uploads} isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}


