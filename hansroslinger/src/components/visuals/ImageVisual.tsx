"use client";

import { Image as KonvaImage } from "react-konva";
import React, { useEffect, useState } from "react";
import { UploadProp } from "types/application";

type ImageVisualProp = {
  id: string;
  data: UploadProp;
};

const ImageVisual = ({ id, data }: ImageVisualProp) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = data.src;
    img.onload = () => {
      setImage(img);
    };
  }, [data]);

  return <>{image && <KonvaImage id={id} image={image} draggable />}</>;
};

export default ImageVisual;
