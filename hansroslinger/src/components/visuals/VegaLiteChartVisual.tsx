"use client";
import embed from "vega-embed";
import { useEffect, useRef } from "react";
import { useVisualStore } from "store/visualsSlice";

type VegaLiteVisualProp = {
  id: string;
};

const VegaLiteVisual = ({ id }: VegaLiteVisualProp) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const visual = useVisualStore((state) => state.getVisual(id));

  const position = visual ? visual.position : { x: 0, y: 0 };
  const size = visual?.size;

  // Replace when pinch is ready
  // If pinch -> drag, pointer events is none so drag can be registered on konva
  const isPinch = true;

  useEffect(() => {
    if (visual && size) {
      fetch(visual.uploadData.src)
        .then((res) => res.json())
        .then((jsonData) => {
          if (chartRef.current) {
            
            jsonData.width = size.width;
            jsonData.height = size.height;
            jsonData.autosize = {
              type: "fit",
              contains: "padding",
            };

            chartRef.current.innerHTML = "";
            embed(chartRef.current, jsonData, {
              actions: false,
              tooltip: true,
              renderer: "canvas",
            });
          }
        });
    }
    // don't want it to re-render when position change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, size?.width, size?.height]);

  return (
    <div
      id={id}
      ref={chartRef}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        ...(size ? { width: size.width, height: size.height } : {}),
        pointerEvents: isPinch ? "none" : "auto",
        zIndex: 10,
      }}
    />
  );
};

export default VegaLiteVisual;
