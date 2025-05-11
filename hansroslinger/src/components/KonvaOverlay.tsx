"use client";

import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect } from "react-konva";

type ShapeType = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
};

const KonvaOverlay = () => {
  const [shapes, setShapes] = useState<ShapeType[]>([]);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const updateSize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const addRectangle = () => {
    const newRect: ShapeType = {
      id: Date.now().toString(),
      x: 50 + shapes.length * 20,
      y: 50 + shapes.length * 20,
      width: 100,
      height: 60,
      fill: "rgba(20,184,166,0.7)",
    };
    setShapes([...shapes, newRect]);
  };

  const updateShapePosition = (id: string, x: number, y: number) => {
    setShapes((prev) =>
      prev.map((shape) => (shape.id === id ? { ...shape, x, y } : shape)),
    );
  };

  return (
    <div className="absolute inset-0 z-10">
      <div className="absolute top-4 left-4 z-20 pointer-events-auto">
        <button
          onClick={addRectangle}
          className="bg-teal-500 text-white px-4 py-2 rounded shadow hover:bg-teal-700 transition"
        >
          Add Rectangle
        </button>
      </div>

      {dimensions && (
        <div className="w-full h-full pointer-events-auto">
          <Stage width={dimensions.width} height={dimensions.height}>
            <Layer>
              {shapes.map((shape) => (
                <Rect
                  key={shape.id}
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  fill={shape.fill}
                  draggable
                  onDragEnd={(e) =>
                    updateShapePosition(shape.id, e.target.x(), e.target.y())
                  }
                />
              ))}
            </Layer>
          </Stage>
        </div>
      )}
    </div>
  );
};

export default KonvaOverlay;
