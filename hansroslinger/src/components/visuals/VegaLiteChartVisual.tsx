"use client";
import embed from "vega-embed";
import { useEffect, useRef } from "react";
import { useVisualStore } from "app/store/visualsSlice";

type VegaLiteVisualProp = {
  id: string;
};

const VegaLiteVisual = ({ id }: VegaLiteVisualProp) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const visual = useVisualStore((state) => state.getVisual(id));
  const setVisualSize = useVisualStore((state) => state.setVisualSize);

  const position = visual ? visual.position : { x: 0, y: 0 };
  const size = visual?.size;

  // Replace when pinch is ready
  // If pinch -> drag, pointer events is none so drag can be registered on konva
  const isPinch = true;

  useEffect(() => {
    if (visual) {
      fetch(visual.uploadData.src)
        .then((res) => res.json())
        .then((jsonData) => {
          if (chartRef.current) {
            embed(chartRef.current, jsonData, {
              actions: false,
              tooltip: true,
              renderer: "canvas",
            }).then(() => {
              // Get Vega chart bounding box
              const viewEl = chartRef.current?.querySelector("canvas");
              if (viewEl) {
                const bounds = viewEl.getBoundingClientRect();
                setVisualSize(id, {
                  width: bounds.width,
                  height: bounds.height,
                });
              }
            });
          }
        });
    }
    // don't want it to re-render when position change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
