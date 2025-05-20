"use client";

import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect } from "react-konva";
import ImageVisual from "./visuals/ImageVisual";
import { useVisualStore } from "store/visualsSlice";
import { FILE_TYPE_JSON, FILE_TYPE_PNG } from "constants/application";
import VegaLiteVisual from "./visuals/VegaLiteChartVisual";


const KonvaOverlay = () => {
  const visuals = useVisualStore((state) => state.visuals);
  const setVisualPosition = useVisualStore((state) => state.setVisualPosition);

  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // const [hoveredId, setHoveredId] = useState<string | null>(null);  //  for hover effect

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
              {visuals.map((visual) => {
                if (visual.uploadData.type == FILE_TYPE_PNG) {
                  return (
                    <ImageVisual
                      key={visual.assetId}
                      id={visual.assetId}
                      visual={visual}
                    />
                  );
                } else if (visual.uploadData.type === FILE_TYPE_JSON) {
                  // const isHovered = hoveredId === visual.assetId;
                  return (
                    <Rect
                      key={visual.assetId}
                      x={visual.position.x}
                      y={visual.position.y}
                      width={visual.size.width}
                      height={visual.size.height}
                      fill="transparent"
                      // stroke={isHovered ? "green" : "black"}     //  highlight border
                      // strokeWidth={isHovered ? 10 : 1}            //  thicker border on hover
                      draggable
                      onDragMove={(e) => {
                        handleVegaLiteDrag(visual.assetId, {
                          x: e.target.x(),
                          y: e.target.y(),
                        });
                      }}
                      // onMouseEnter={() => setHoveredId(visual.assetId)}   //  set hover
                      // onMouseLeave={() => setHoveredId(null)}             //  remove hover
                    />
                  );
                }
              })}
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
