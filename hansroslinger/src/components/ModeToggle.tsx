"use client";

import { useEffect } from "react";
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

  return (
    <button
      onClick={toggle}
      className="z-[9999] rounded-2xl px-4 py-2 shadow bg-black/80 text-white"
      aria-pressed={mode === "paint"}
      aria-label={`Switch to ${mode === "paint" ? "Interact" : "Paint"} mode (P)`}
      title={`Press P — ${mode === "paint" ? "Interact" : "Paint"} mode`}
    >
      {mode === "paint" ? "Paint ✏️" : "Interact 🖐️"}
    </button>
  );
}
