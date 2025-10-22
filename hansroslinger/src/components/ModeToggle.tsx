"use client";

import { useEffect, useState } from "react";
import { useModeStore } from "store/modeSlice";

export default function ModeToggle() {
  const mode = useModeStore((s) => s.mode);
  const toggle = useModeStore((s) => s.toggleMode);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "p") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={toggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`z-[9999] rounded-2xl px-6 py-4 shadow text-white transition-all duration-200
        ${isHovered ? "bg-gray-700" : "bg-black/80"}`}
      aria-pressed={mode === "paint"}
      aria-label={`Switch to ${mode === "paint" ? "Interact" : "Paint"} mode (P)`}
      title={`Press P — ${mode === "paint" ? "Interact" : "Paint"} mode`}
    >
      {mode === "paint" ? "Paint ✏️" : "Interact 🖐️"}
    </button>
  );
}
