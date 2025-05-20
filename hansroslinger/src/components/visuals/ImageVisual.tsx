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
  // const [isHovered, setIsHovered] = useState(false); //  for hover effect

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
          // stroke={isHovered ? "green" : "transparent"} //  Hover border
          // strokeWidth={isHovered ? 10 : 0} //  Hover border
          // onMouseEnter={() => setIsHovered(true)}           //  Set Hover
          // onMouseLeave={() => setIsHovered(false)}          //  Remove Hover 
        />
      )}
    </>
  );
};

export default ImageVisual;
