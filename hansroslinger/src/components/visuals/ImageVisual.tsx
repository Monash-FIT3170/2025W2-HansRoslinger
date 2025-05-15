"use client";

import { Image as KonvaImage } from "react-konva";
import React, { useEffect, useState } from "react";
import { Visual } from "types/application";

type ImageVisualProp = {
  id: string;
  visual: Visual;
};

const ImageVisual = ({ id, visual }: ImageVisualProp) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isHovered, setIsHovered] = useState(false); //  for hover effect

  useEffect(() => {
    const img = new window.Image();
    img.src = visual.uploadData.src;
    img.onload = () => {
      setImage(img);
    };
  }, [visual]);

  return (
    <>
      {image && (
        <KonvaImage
          id={id}
          image={image}
          x={visual.position.x}
          y={visual.position.y}
          draggable
          shadowColor={isHovered ? "green" : "transparent"}  //  Hover glow
          shadowBlur={isHovered ? 30 : 0}
          shadowOffset={{ x: 0, y: 0 }}
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
