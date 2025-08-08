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
  const setVisualSize = useVisualStore((state) => state.setVisualSize);
  const setUseOriginalSizeOnLoad = useVisualStore(
    (state) => state.setUseOriginalSizeOnLoad
  );
  const size = visual?.size;

  // Initial render
  useEffect(() => {
    if (!visual || !chartRef) return;
    fetch(visual.uploadData.src)
      .then((res) => res.json())
      .then((jsonData) => {
        jsonData.autosize = {
          type: "fit",
          contains: "padding",
        };
        jsonData.background = null;

        if (!visual.useOriginalSizeOnLoad && size) {
          jsonData.width = "container";
          jsonData.height = "container";
        }

        if (chartRef.current) {
          embed(chartRef.current, jsonData, {
            actions: false,
            tooltip: true,
            renderer: "canvas",
          }).then(() => {
            const viewEl = chartRef.current?.querySelector("canvas");

            if (viewEl) {
              const bounds = viewEl.getBoundingClientRect();

              if (visual.useOriginalSizeOnLoad) {
                setVisualSize(id, {
                  width: bounds.width,
                  height: bounds.height,
                });
                setUseOriginalSizeOnLoad(id, false);
              }
            }
          });
        }
      });
  }, [id, visual?.useOriginalSizeOnLoad]);

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [size]);

  return (
    <div
      id={id}
      className={
        visual?.isHovered
          ? "outline-2 outline-offset-0 outline-green-500 relative"
          : ""
      }
      ref={chartRef}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        ...(size ? { width: size.width, height: size.height } : {}),
        pointerEvents: "auto",
        zIndex: 10,
      }}
    >
      {visual?.isHovered && (
        <>
          <div className="w-5 h-5 border-2 border-green-500 absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2" />
          <div className="w-5 h-5 border-2 border-green-500 absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2" />
          <div className="w-5 h-5 border-2 border-green-500 absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2" />
          <div className="w-5 h-5 border-2 border-green-500 absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2" />
        </>
      )}
    </div>
  );
};

export default VegaLiteVisual;
