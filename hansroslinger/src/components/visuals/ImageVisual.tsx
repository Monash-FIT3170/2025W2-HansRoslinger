"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Visual } from "types/application";
import { useVisualStore } from "store/visualsSlice";

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

  useEffect(() => {
    // Create image component
    const img = new window.Image();
    img.src = visual.uploadData.src;

    img.onload = () => {
      // Set original size if first load
      if (visual.useOriginalSizeOnLoad) {
        setVisualSize(id, {
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        setUseOriginalSizeOnLoad(visual.assetId, false);
      }

      // Set image property
      if (containerRef && containerRef.current) {
        // fit to container
        img.style.objectFit = "contain";
        img.style.width = "100%";
        img.style.height = "100%";
        // avoid only dragging image
        img.draggable = false;

        // Clear previous and add image as child
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(img);
      }
    };
  }, [
    id,
    visual.uploadData.src,
    setVisualSize,
    visual.useOriginalSizeOnLoad,
    setUseOriginalSizeOnLoad,
    visual.assetId,
  ]);

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
    </div>
  );
};

export default ImageVisual;
