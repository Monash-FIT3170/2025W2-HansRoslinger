"use client";

import React, { useMemo, useRef } from "react";
import { Visual } from "types/application";
import { useVisualStore } from "store/visualsSlice";
import Image from "next/image";

type ImageVisualProp = {
  id: string;
  visual: Visual;
};

const ImageVisual = ({ id, visual }: ImageVisualProp) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const setVisualSize = useVisualStore((state) => state.setVisualSize);
  const setUseOriginalSizeOnLoad = useVisualStore(
    (state) => state.setUseOriginalSizeOnLoad,
  );

  const borderColor = useMemo(() => {
    if (visual.isDragging) {
      return "border-green-500";
    } else if (visual.isHovered) {
      return "border-red-500";
    }
    return "";
  }, [visual.isHovered, visual.isDragging]);

  const handleImgLoad = (
    e: React.SyntheticEvent<HTMLImageElement> | { currentTarget: { naturalWidth: number; naturalHeight: number } },
  ) => {
    const img = e.currentTarget as HTMLImageElement | { naturalWidth: number; naturalHeight: number };
    if (visual.useOriginalSizeOnLoad) {
      setVisualSize(id, {
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      setUseOriginalSizeOnLoad(visual.assetId, false);
    }
  };

  return (
    <div
      id={id}
      className={
        visual?.isHovered || visual?.isDragging
          ? `border-2 border-offset-0 relative ${borderColor}`
          : ""
      }
      ref={containerRef}
      style={{
        position: "absolute",
        top: visual.position.y,
        left: visual.position.x,
        width: visual.size.width,
        height: visual.size.height,
        pointerEvents: "auto",
        zIndex: 10,
      }}
    >
      {(visual?.isHovered || visual?.isDragging) && (
        <>
          <div
            className={`w-5 h-5 border-2 ${borderColor} absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2`}
          />
          <div
            className={`w-5 h-5 border-2 ${borderColor} absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2`}
          />
          <div
            className={`w-5 h-5 border-2 ${borderColor} absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2`}
          />
          <div
            className={`w-5 h-5 border-2 ${borderColor} absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2`}
          />
        </>
      )}
      {/* Render image via React to avoid manual DOM mutations */}
      <Image
        src={visual.uploadData.src}
        alt=""
        fill
        sizes="100vw"
  onLoad={handleImgLoad}
        draggable={false}
        style={{
          objectFit: "contain",
          pointerEvents: "none",
          userSelect: "none",
        }}
        priority={true}
      />
    </div>
  );
};

export default ImageVisual;
