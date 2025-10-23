"use client";

import { useEffect, useRef, useState } from "react";
import { processBackgroundRemoval, processBackgroundBlur } from "app/detection/ImageSegmentation";
import { useBackgroundStore } from "store/backgroundSlice";

interface BackgroundRemovalControlsProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export default function BackgroundRemovalControls({
  videoRef,
}: BackgroundRemovalControlsProps) {
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const [backgroundRemovalEnabled, setBackgroundRemovalEnabled] = useState(false);
  const [backgroundType, setBackgroundType] = useState<"transparent" | "solid" | "blur">("transparent");
  const [backgroundColor, setBackgroundColor] = useState("#00ff88");
  const [blurRadius, setBlurRadius] = useState(10);
  const layerBehindPerson = useBackgroundStore((state) => state.layerBehindPerson);
  const setLayerBehindPerson = useBackgroundStore((state) => state.setLayerBehindPerson);
  const intervalRef = useRef<number | null>(null);

  // Handle background removal processing
  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current != null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Only start processing if background removal is enabled and we have the required refs
    if (backgroundRemovalEnabled && videoRef.current && backgroundCanvasRef.current) {
      console.log("Starting background removal processing...", { 
        backgroundType, 
        backgroundColor, 
        blurRadius 
      });

      intervalRef.current = window.setInterval(async () => {
        if (videoRef.current && backgroundCanvasRef.current) {
          const videoWidth = videoRef.current.videoWidth;
          const videoHeight = videoRef.current.videoHeight;
          const canvasWidth = backgroundCanvasRef.current.width;
          const canvasHeight = backgroundCanvasRef.current.height;
          
          // Ensure canvas matches video dimensions exactly
          if (
            videoWidth > 0 &&
            videoHeight > 0 &&
            canvasWidth > 0 &&
            canvasHeight > 0 &&
            videoWidth === canvasWidth &&
            videoHeight === canvasHeight
          ) {
            try {
              if (backgroundType === "blur") {
                await processBackgroundBlur(
                  videoRef.current,
                  backgroundCanvasRef.current,
                  blurRadius
                );
              } else {
                await processBackgroundRemoval(
                  videoRef.current,
                  backgroundCanvasRef.current,
                  backgroundType === "transparent" ? "transparent" : backgroundColor
                );
              }
            } catch (error) {
              console.error("Background removal failed:", error);
            }
          } else {
            // Force resize canvas to match video dimensions
            if (backgroundCanvasRef.current) {
              backgroundCanvasRef.current.width = videoWidth;
              backgroundCanvasRef.current.height = videoHeight;
            }
          }
        }
      }, 100);
    } else {
      console.log("Background removal conditions not met:", {
        backgroundRemovalEnabled,
        videoExists: !!videoRef.current,
        canvasExists: !!backgroundCanvasRef.current,
      });
    }

    return () => {
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [backgroundRemovalEnabled, backgroundType, backgroundColor, blurRadius, videoRef]);

  // Size the background canvas to match the video display (same as overlay canvas)
  useEffect(() => {
    const sizeCanvas = () => {
      const video = videoRef.current;
      const canvas = backgroundCanvasRef.current;
      if (!video || !canvas) return;

      const rect = video.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // Set canvas to match video's display dimensions (after CSS object-cover)
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Size canvas when video loads and on resize
    if (videoRef.current) {
      // Use a small delay to ensure video is fully loaded and sized
      const timeoutId = setTimeout(() => {
        requestAnimationFrame(sizeCanvas);
      }, 100);
      
      // Also listen for video dimension changes
      const video = videoRef.current;
      const handleVideoResize = () => {
        requestAnimationFrame(sizeCanvas);
      };
      
      video.addEventListener('loadedmetadata', handleVideoResize);
      video.addEventListener('resize', handleVideoResize);
      window.addEventListener("resize", sizeCanvas);
      
      return () => {
        clearTimeout(timeoutId);
        video.removeEventListener('loadedmetadata', handleVideoResize);
        video.removeEventListener('resize', handleVideoResize);
        window.removeEventListener("resize", sizeCanvas);
      };
    }
  }, [videoRef]);

  return (
    <>
      {/* Background removal canvas layer */}
      <canvas
        ref={backgroundCanvasRef}
        className={`absolute top-0 left-0 w-full h-full pointer-events-none ${
          backgroundRemovalEnabled ? "block" : "hidden"
        }`}
        style={{ zIndex: 1 }}
      />

      {/* Background removal controls */}
      <div className="absolute bottom-20 right-6 flex flex-col gap-2 z-[10000]">
        {/* Remove Background Button - styled like ClearButton */}
        <button
          onClick={() => {
            console.log("Background removal toggled:", !backgroundRemovalEnabled);
            setBackgroundRemovalEnabled(!backgroundRemovalEnabled);
          }}
          className="group px-5 py-3 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/30 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
        >
          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          
          <div className="relative flex items-center gap-2">
            <span className="text-sm tracking-wide">
              {backgroundRemovalEnabled ? "Layering ✓" : "Layering"}
            </span>
          </div>
        </button>

        {/* Background removal options panel */}
        {backgroundRemovalEnabled && (
          <div className="bg-black/60 text-white p-3 backdrop-blur">
            <div className="flex flex-col gap-2 text-sm font-semibold tracking-wide">
            <div className="flex gap-1">
              <button
                onClick={() => setBackgroundType("transparent")}
                className={`px-2 py-1 text-sm font-semibold tracking-wide ${
                  backgroundType === "transparent"
                    ? "bg-white text-black"
                    : "bg-white/20"
                }`}
              >
                Transparent
              </button>
              <button
                onClick={() => setBackgroundType("solid")}
                className={`px-2 py-1 text-sm font-semibold tracking-wide ${
                  backgroundType === "solid"
                    ? "bg-white text-black"
                    : "bg-white/20"
                }`}
              >
                Solid
              </button>
              <button
                onClick={() => setBackgroundType("blur")}
                className={`px-2 py-1 text-sm font-semibold tracking-wide ${
                  backgroundType === "blur"
                    ? "bg-white text-black"
                    : "bg-white/20"
                }`}
              >
                Blur
              </button>
            </div>

            {backgroundType === "solid" && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold tracking-wide">Color:</label>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-6 w-8 border border-white/20"
                />
              </div>
            )}

            {backgroundType === "blur" && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold tracking-wide">Blur:</label>
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={blurRadius}
                  onChange={(e) => setBlurRadius(Number(e.target.value))}
                  className="w-16"
                />
                <span className="text-sm font-semibold tracking-wide">{blurRadius}px</span>
              </div>
            )}

            {/* Layer positioning toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="layerBehindPerson"
                checked={layerBehindPerson}
                onChange={(e) => setLayerBehindPerson(e.target.checked)}
                className=""
              />
              <label htmlFor="layerBehindPerson" className="text-sm font-semibold tracking-wide">
                Layer behind person
              </label>
            </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
