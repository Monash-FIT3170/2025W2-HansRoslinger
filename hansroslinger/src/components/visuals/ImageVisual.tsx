"use client";

import React, { useEffect, useRef } from "react";
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
        visual?.isHovered ? "outline-5 outline-offset-0 outline-green-500" : ""
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
    />
  );
};

export default ImageVisual;
