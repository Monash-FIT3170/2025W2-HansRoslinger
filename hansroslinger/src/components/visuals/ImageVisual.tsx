"use client";

import { Image as KonvaImage } from "react-konva";
import React, { useEffect, useState } from "react";
import { VisualProp } from "types/application";

type ImageVisualProp = {
  id: string;
  visual: VisualProp;
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

  return <>{image && <KonvaImage id={id} image={image} draggable />}</>;
};

export default ImageVisual;
