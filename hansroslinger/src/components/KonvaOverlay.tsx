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

import ClearButton from "./ClearButton";

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
                    <div className="absolute top-2 right-2 z-20 bg-white bg-opacity-90 rounded-lg shadow-lg p-2">
                      {isHovered && <FeedbackDisplay fileType={visual.uploadData.type} />}
                    </div>
                </div>
              );
            } else if (visual.uploadData.type == FILE_TYPE_PNG) {
              return (
                <div key={visual.assetId} className="relative">
                  <ImageVisual
                    key={visual.assetId}
                    id={visual.assetId}
                    visual={visual}
                  />
                  <div className="absolute top-2 right-2 z-20 bg-white bg-opacity-90 rounded-lg shadow-lg p-2">
                    {isHovered && <FeedbackDisplay fileType={visual.uploadData.type} />}
                  </div>
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
