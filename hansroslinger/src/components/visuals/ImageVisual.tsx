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
          width={visual.size.width}
          height={visual.size.height}
        />
      )}
    </>
  );
};

export default ImageVisual;
