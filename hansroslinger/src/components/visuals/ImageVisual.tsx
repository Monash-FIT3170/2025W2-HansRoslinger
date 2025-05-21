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
  const setVisualSize = useVisualStore((state) => state.setVisualSize);

  useEffect(() => {
    
    const img = new window.Image();
    img.src = visual.uploadData.src;
    img.onload = () => {
      setImage(img);
      setVisualSize(id, {
      width: img.naturalWidth,
      height: img.naturalHeight,
    })
    };

  }, [id, visual.uploadData.src, setVisualSize]);

  console.log(visual)

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
          stroke="red"
          strokeWidth={5}
        />
      )}
    </>
  );
};

export default ImageVisual;
