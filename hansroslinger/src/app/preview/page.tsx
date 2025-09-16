"use client";

import dynamic from "next/dynamic";

import CanvasOverlay from "@/components/KonvaOverlay";
import { useEffect, useRef, useState } from "react";

const CameraFeed = dynamic(() => import("./CameraFeed"), {
  ssr: false,
});

const Preview = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const target = containerRef.current;
    if (!target) return;

    const el = target as HTMLElement & {
      webkitRequestFullscreen?: () => void;
      msRequestFullscreen?: () => void;
    };
    const doc = document as Document & {
      webkitExitFullscreen?: () => void;
      msExitFullscreen?: () => void;
    };

    if (!document.fullscreenElement) {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
    } else {
      if (doc.exitFullscreen) doc.exitFullscreen();
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
      else if (doc.msExitFullscreen) doc.msExitFullscreen();
    }
  };

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
    };
  }, []);

  return (
    <div className="flex justify-center px-4 sm:px-8">
      <div
        ref={containerRef}
        className="relative w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl 
        aspect-video border-2 border-black overflow-hidden bg-black"
      >
        {/* Fullscreen button — same style as ModeToggle (interact/paint) */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-3 right-3 z-[9999] rounded-2xl px-4 py-2 shadow bg-black/80 text-white"
          aria-pressed={isFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>

        <CameraFeed />
        <CanvasOverlay />
      </div>
    </div>
  );
};

export default Preview;
