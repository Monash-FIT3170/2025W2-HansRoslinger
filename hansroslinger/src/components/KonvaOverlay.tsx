"use client";

import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect } from "react-konva";
import ImageVisual from "./visuals/ImageVisual";
import { useUploadStore } from "app/store/visualsSlice";
import { FILE_TYPE_JSON, FILE_TYPE_PNG } from "constants/application";
import VegaLiteVisual from "./visuals/VegaLiteChartVisual";

const KonvaOverlay = () => {
  const visuals = useUploadStore((state) => state.Visuals);
  const setVisualPosition = useUploadStore((state) => state.setVisualPosition);

  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

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

  const handleVegaLiteDrag = (id: string, pos: { x: number; y: number }) => {
    setVisualPosition(id, pos);
  };

  return (
    <div className="absolute inset-0 z-10">
      {dimensions && (
        <div className="w-full h-full pointer-events-auto">
          <Stage width={dimensions.width} height={dimensions.height}>
            <Layer>
              {Object.entries(visuals).map(([asset_id, visual]) => {
                if (visual.uploadData.type == FILE_TYPE_PNG) {
                  return (
                    <ImageVisual key={asset_id} id={asset_id} visual={visual} />
                  );
                } else if (visual.uploadData.type === FILE_TYPE_JSON) {
                  return (
                    <Rect
                      key={asset_id}
                      x={visual.position.x}
                      y={visual.position.y}
                      width={visual.size.width}
                      height={visual.size.height}
                      fill="transparent"
                      draggable
                      onDragMove={(e) => {
                        handleVegaLiteDrag(asset_id, {
                          x: e.target.x(),
                          y: e.target.y(),
                        });
                      }}
                    />
                  );
                }
              })}
            </Layer>
          </Stage>
          {Object.entries(visuals).map(([id, visual]) => {
            if (visual.uploadData.type === FILE_TYPE_JSON) {
              return <VegaLiteVisual key={id} id={id} />;
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default KonvaOverlay;
