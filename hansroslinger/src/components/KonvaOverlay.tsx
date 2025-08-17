"use client";

import React, { useEffect, useRef, useState } from "react";
import ImageVisual from "./visuals/ImageVisual";
import { useVisualStore } from "store/visualsSlice";
import { FILE_TYPE_JSON, FILE_TYPE_PNG } from "constants/application";
import VegaLiteVisual from "./visuals/VegaLiteChartVisual";

import { InteractionManager } from "./interactions/interactionManager";
import { useMouseMockStream } from "./interactions/useMouseMockStream";
import { useGestureListener } from "./interactions/useGestureListener";
import { FeedbackDisplay } from "./interactions/actions/handleFeedback";

const CanvasOverlay = () => {
  const visuals = useVisualStore((state) => state.visuals);
  //const { gestureFeedbackId } = useVisualStore();

  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // Setup Interaction Manager and mouse mock stream
  const interactionManager = useRef(new InteractionManager()).current;
  useMouseMockStream(interactionManager);
  useGestureListener(interactionManager);

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
            const isHovered = visual.isHovered;
            if (visual.uploadData.type === FILE_TYPE_JSON) {
              return (
                <div key={visual.assetId} className="relative">
                  <VegaLiteVisual id={visual.assetId} />
                  {isHovered && (
                    <div 
                      className="absolute z-20"
                      style={{
                        top: visual.position.y + visual.size?.height,
                        left: visual.position.x + (visual.size?.width || 0) + 10, // 10px gap
                      }}
                    >
                      <FeedbackDisplay fileType={visual.uploadData.type} />
                    </div>
                  )}
                </div>
              );
            }else if (visual.uploadData.type == FILE_TYPE_PNG) {
              return (
                <div key={visual.assetId} className="relative flex gap-4 items-start">
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
                        left: visual.position.x + (visual.size?.width || 0) + 10, // 10px gap
                      }}
                    >
                      <FeedbackDisplay fileType={visual.uploadData.type} />
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default CanvasOverlay;
