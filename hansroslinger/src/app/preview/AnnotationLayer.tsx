"use client";

import React, { useEffect, useRef, useState } from "react";
import { useModeStore } from "store/modeSlice";
import ModeToggle from "@/components/ModeToggle";
import { handleUndo } from "@/components/interactions/actions/handleUndo";
import ClearButton from "@/components/ClearButton";

type AnnotationLayerProps = {
  /** Element to align/sync canvas size with video element. */
  targetRef: React.RefObject<HTMLElement | null>;
  /** className for the wrapper. */
  className?: string;
  /** z-index for the canvas/toolbar stack. */
  zIndex?: number;
};

const AnnotationLayer: React.FC<AnnotationLayerProps> = ({
  targetRef,
  className = "",
  zIndex = 30,
}) => {
  // Canvas & drawing refs
  const annotationCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // UI state
  const mode = useModeStore((s) => s.mode);
  const enabled = mode === "paint";
  const [tool, setTool] = useState<"draw" | "erase">("draw");
  const [strokeWidth, setStrokeWidth] = useState(8); // default stroke width
  const [strokeColor, setStrokeColor] = useState("#00ff88");

  // Size canvas to match target
  const sizeToTarget = () => {
    const target = targetRef.current;
    const canvas = annotationCanvasRef.current;
    if (!target || !canvas) return;

    const rect = target.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // CSS box
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Backing store
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const clearAnnotations = () => {
    const c = annotationCanvasRef.current;
    const ctx = c?.getContext("2d");
    if (c && ctx) ctx.clearRect(0, 0, c.width, c.height);
  };

  const getRelativePos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = annotationCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!enabled) return;
    const canvas = annotationCanvasRef.current!;
    canvas.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    lastPosRef.current = getRelativePos(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!enabled || !isDrawingRef.current) return;
    const canvas = annotationCanvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pos = getRelativePos(e);
    const last = lastPosRef.current!;

    const pressure = e.pressure && e.pressure > 0 ? e.pressure : 1;

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = Math.max(1, strokeWidth * pressure);
    ctx.globalCompositeOperation =
      tool === "erase" ? "destination-out" : "source-over";
    if (tool === "draw") ctx.strokeStyle = strokeColor;

    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastPosRef.current = pos;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!enabled) return;
    const canvas = annotationCanvasRef.current!;
    canvas.releasePointerCapture(e.pointerId);
    isDrawingRef.current = false;
    lastPosRef.current = null;
  };

  // Size once after mount & whenever window resizes
  useEffect(() => {
    const rafId = requestAnimationFrame(sizeToTarget);
    const onResize = () => sizeToTarget();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-size when the target element size changes
  useEffect(() => {
    if (!targetRef.current) return;
    const ro = new ResizeObserver(() => sizeToTarget());
    ro.observe(targetRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetRef.current]);

  // For undo button hovering using gesture
  const [isUndoButtonHovered, setIsUndoButtonHovered] = useState(false);

  return (
    <div className="absolute inset-0" style={{ zIndex }}>
      {/* Annotation canvas */}
      <canvas
        ref={annotationCanvasRef}
        id="annotation-canvas"
        className={`absolute inset-0 pointer-events-none ${enabled ? "pointer-events-auto" : ""} ${className}`}
        style={{
          zIndex,
          pointerEvents: enabled ? "auto" : "none",
          touchAction: "none",
        }}
        data-tool={tool}
        data-stroke-width={strokeWidth}
        data-stroke-color={strokeColor}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
      {/* Paint mode button */}
      <div
        className="absolute top-4 left-4 pointer-events-auto"
        style={{ zIndex: zIndex + 2 }}
      >
        <ModeToggle />
      </div>
      {!enabled && (
        <div className="pointer-events-auto">
          <button
            onClick={handleUndo}
            onMouseEnter={() => setIsUndoButtonHovered(true)}
            onMouseLeave={() => setIsUndoButtonHovered(false)}
            className={`absolute top-4 right-4 text-black p-5 rounded-full shadow-lg transition-colors duration-200
        ${isUndoButtonHovered ? "bg-gray-200" : "bg-white"}`}
            style={{ zIndex: zIndex + 2 }}
            title="Undo"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 7v6h6" />
              <path d="m21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
            </svg>
          </button>
          <div
            className="absolute bottom-6 right-6"
            style={{ zIndex: zIndex + 2 }}
          >
            <ClearButton variant="relative" />
          </div>
        </div>
      )}
      {/* Conditionally rendered toolbar */}
      {enabled && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 text-white rounded-2xl px-3 py-2 backdrop-blur"
          style={{ zIndex: zIndex + 1 }}
        >
          <div
            className={`flex items-center gap-2 ${enabled ? "opacity-100" : "opacity-40 pointer-events-none"}`}
          >
            <button
              onClick={() => setTool("draw")}
              className={`px-2 py-1 rounded ${tool === "draw" ? "bg-white text-black" : "bg-white/10"}`}
              aria-pressed={tool === "draw"}
              title="Draw"
            >
              ✏️
            </button>
            <button
              onClick={() => setTool("erase")}
              className={`px-2 py-1 rounded ${tool === "erase" ? "bg-white text-black" : "bg-white/10"}`}
              aria-pressed={tool === "erase"}
              title="Erase"
            >
              🧽
            </button>

            <label className="flex items-center gap-2 text-xs">
              <span>Color</span>
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="h-8 w-8 rounded overflow-hidden border border-white/20"
              />
            </label>

            <label className="flex items-center gap-2 text-xs">
              <span>Size</span>
              <input
                type="range"
                min={2}
                max={24}
                step={1}
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-24"
              />
            </label>

            <button
              onClick={clearAnnotations}
              className="px-2 py-1 rounded bg-white/10"
              title="Clear"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnotationLayer;
