"use client";

import React, { useEffect, useRef, useState } from "react";
import ImageVisual from "./visuals/ImageVisual";
import { useVisualStore } from "store/visualsSlice";
import { FILE_TYPE_JSON, FILE_TYPE_PNG } from "constants/application";
import VegaLiteVisual from "./visuals/VegaLiteChartVisual";

import { InteractionManager } from "./interactions/interactionManager";
import { useMouseMockStream } from "./interactions/useMouseMockStream";

const KonvaOverlay = () => {
  const visuals = useVisualStore((state) => state.visuals);

  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // Setup Interaction Manager and mouse mock stream
  const interactionManager = useRef(new InteractionManager()).current;
  useMouseMockStream(interactionManager);

  useEffect(() => {
    const updateSize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="absolute inset-0 z-10">
      {dimensions && (
        <div className="w-full h-full pointer-events-auto">
          {visuals.map((visual) => {
            if (visual.uploadData.type === FILE_TYPE_JSON) {
              return (
                <VegaLiteVisual key={visual.assetId} id={visual.assetId} />
              );
            } else if (visual.uploadData.type == FILE_TYPE_PNG) {
              return (
                <ImageVisual
                  key={visual.assetId}
                  id={visual.assetId}
                  visual={visual}
                />
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default KonvaOverlay;
