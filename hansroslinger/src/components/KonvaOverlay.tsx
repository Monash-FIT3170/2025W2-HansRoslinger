"use client";

import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect } from "react-konva";
import { useVisualStore } from "store/visualsSlice";
import { FILE_TYPE_JSON } from "constants/application";
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

  // Konva js does not allow for html container or DOM element to be rendered directly in the canvas
  // It does not support DOM element as a child of its layer
  // So, a transparent rectangle is rendered instead and the VegaLite div component is rendered on top of the canvas
  // This is the reason why position and size needs to be tracked.

  return (
    <div className="absolute inset-0 z-10">
      {dimensions && (
        <div className="w-full h-full pointer-events-auto">
          <Stage width={dimensions.width} height={dimensions.height}>
            <Layer>
              {visuals.map((visual) => 
                  <Rect
                    key={visual.assetId}
                    x={visual.position.x}
                    y={visual.position.y}
                    width={visual.size.width}
                    height={visual.size.height}
                    fill="transparent"
                  />
                )}
            </Layer>
          </Stage>
          {visuals.map((visual) => {
            if (visual.uploadData.type === FILE_TYPE_JSON) {
              return (
                <VegaLiteVisual key={visual.assetId} id={visual.assetId} />
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
