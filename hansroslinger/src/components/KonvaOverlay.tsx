"use client";

import React, { useEffect, useRef, useState } from "react";
import ImageVisual from "./visuals/ImageVisual";
import { useVisualStore } from "store/visualsSlice";
import { useBackgroundStore } from "store/backgroundSlice";
import { FILE_TYPE_JSON, FILE_TYPE_PNG } from "constants/application";
import VegaLiteVisual from "./visuals/VegaLiteChartVisual";

import { InteractionManager } from "./interactions/interactionManager";
import { useMouseMockStream } from "./interactions/useMouseMockStream";
import { useGestureListener } from "./interactions/useGestureListener";
import { FeedbackDisplay } from "./interactions/actions/handleFeedback";

import ClearButton from "./ClearButton";

const CanvasOverlay = () => {
  const visuals = useVisualStore((state) => state.visuals);
  const layerBehindPerson = useBackgroundStore(
    (state) => state.layerBehindPerson,
  );

  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // NEW refs for sizing
  const rootRef = useRef<HTMLDivElement>(null);
  const annCanvasRef = useRef<HTMLCanvasElement>(null);
  const hudCanvasRef = useRef<HTMLCanvasElement>(null); // overlay (eraser preview)

  // Setup Interaction Manager and streams
  const interactionManager = useRef(new InteractionManager()).current;
  useMouseMockStream(interactionManager);
  useGestureListener(interactionManager);

  // DPI-safe size helper
  const sizeCanvasTo = (canvas: HTMLCanvasElement, w: number, h: number) => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
  };

  // Use ResizeObserver so canvases always match the preview box (not window)
  useEffect(() => {
    if (!rootRef.current) return;
    const el = rootRef.current;

    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });

      if (annCanvasRef.current)
        sizeCanvasTo(annCanvasRef.current, rect.width, rect.height);
      if (hudCanvasRef.current)
        sizeCanvasTo(hudCanvasRef.current, rect.width, rect.height);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className="absolute inset-0"
      style={{ zIndex: layerBehindPerson ? 0 : 10 }}
    >
      {/* --- Annotation layers (behind visuals) --- */}
      <canvas
        id="annotation-canvas"
        ref={annCanvasRef}
        // draw/erase happen here
        data-tool="draw"
        data-stroke-width="6"
        data-stroke-color="#00ff88"
        className="absolute inset-0 z-0 pointer-events-none"
      />
      <canvas
        id="annotation-overlay"
        ref={hudCanvasRef}
        // HUD for eraser cursor (visual only)
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* --- Visuals above canvases --- */}
      {dimensions && (
        <div className="w-full h-full pointer-events-auto relative z-10">
          {visuals.map((visual) => {
            const isHovered = visual.isHovered;

            if (visual.uploadData.type === FILE_TYPE_JSON) {
              return (
                <div
                  key={visual.assetId}
                  className="relative pointer-events-auto"
                >
                  <VegaLiteVisual id={visual.assetId} />
                  {isHovered && (
                    <div
                      className="absolute z-20"
                      style={{
                        top: visual.position.y + visual.size?.height,
                        left:
                          visual.position.x + (visual.size?.width || 0) + 10,
                      }}
                    >
                      <FeedbackDisplay
                        fileType={visual.uploadData.type}
                        isDragging={visual.isDragging}
                      />
                    </div>
                  )}
                </div>
              );
            } else if (visual.uploadData.type === FILE_TYPE_PNG) {
              return (
                <div
                  key={visual.assetId}
                  className="relative flex gap-4 items-start pointer-events-auto"
                >
                  <ImageVisual
                    key={visual.assetId}
                    id={visual.assetId}
                    visual={visual}
                  />
                  {isHovered && (
                    <div
                      className="absolute z-20"
                      style={{
                        top: visual.position.y + visual.size?.height,
                        left:
                          visual.position.x + (visual.size?.width || 0) + 10,
                      }}
                    >
                      <FeedbackDisplay
                        fileType={visual.uploadData.type}
                        isDragging={visual.isDragging}
                      />
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })}

          <ClearButton />
        </div>
      )}
    </div>
  );
};

export default CanvasOverlay;
