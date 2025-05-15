"use client";

import { Image as KonvaImage } from "react-konva";
import React, { useEffect, useState } from "react";
import { Visual } from "types/application";
import { useVisualStore } from "store/visualsSlice";

type ImageVisualProp = {
  id: string;
  visual: Visual;
};

const ImageVisual = ({ id, visual }: ImageVisualProp) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isHovered, setIsHovered] = useState(false); //  for hover effect
  const setVisualPosition = useVisualStore((state) => state.setVisualPosition);

  useEffect(() => {
    const img = new window.Image();
    img.src = visual.uploadData.src;
    img.onload = () => {
      setImage(img);
    };
  }, [visual]);

  const handleDragEnd = (id: string, pos: { x: number; y: number }) => {
    setVisualPosition(id, pos);
  };

  return (
    <>
      {image && (
        <KonvaImage
          id={id}
          image={image}
          x={visual.position.x}
          y={visual.position.y}
          draggable
          stroke={isHovered ? "green" : "transparent"} //  Hover border
          strokeWidth={isHovered ? 10 : 0} //  Hover border
          onMouseEnter={() => setIsHovered(true)}           //  Set Hover
          onMouseLeave={() => setIsHovered(false)}          //  Remove Hover 
          onDragEnd={(e) => {
            handleDragEnd(id, {
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
        />
      )}
    </>
  );
};

export default ImageVisual;
