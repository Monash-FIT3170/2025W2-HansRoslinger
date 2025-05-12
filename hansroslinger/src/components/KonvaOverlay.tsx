"use client";

import React, { useEffect, useState } from "react";
import { Stage, Layer } from "react-konva";
import ImageVisual from "./visuals/ImageVisual";
import { useUploadStore } from "app/store/uploadsSlice";
import { FILE_TYPE_PNG } from "constants/application";

const KonvaOverlay = () => {
  const selectedUploads = useUploadStore((state) => state.selectedUploads);

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

  return (
    <div className="absolute inset-0 z-10">
      {dimensions && (
        <div className="w-full h-full pointer-events-auto">
          <Stage width={dimensions.width} height={dimensions.height}>
            <Layer>
              {Object.entries(selectedUploads).map(([asset_id, data]) =>
                data.type === FILE_TYPE_PNG ? (
                  <ImageVisual key={asset_id} id={asset_id} data={data} />
                ) : null,
              )}
            </Layer>
          </Stage>
        </div>
      )}
    </div>
  );
};

export default KonvaOverlay;
